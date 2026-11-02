// Hook voor het Verplaatsen-scherm: links je OneDrive, rechts de SharePoint van een team, en het verplaatsen zelf.
// Alles staat alleen in React-state. Verlaat je het scherm, dan is het weg (harde regel 3).
import { useMemo, useState } from 'react';
import { vertaalAuthFout } from '../auth/foutmelding';
import { useToken } from '../auth/useToken';
import { scopesVerplaatsen } from '../config/env';
import { maakVoorbeeldBron } from '../demo/voorbeeldOpslag';
import { vertaalMapFout, vertaalVerplaatsFout } from '../graph/foutmelding';
import type { MapItem, Team, VerplaatsResultaat } from '../model/types';
import { maakGraphBron } from './opslagBron';
import { useMapVenster } from './useMapVenster';
import { useScan } from './useScan';

export type Verbinding = 'niet verbonden' | 'bezig' | 'verbonden' | 'fout';

// Fouten van MSAL hebben een errorCode (bijvoorbeeld: popup gesloten); de rest komt van Graph.
function vertaalVerbindFout(fout: unknown): string {
  if (typeof fout === 'object' && fout !== null && 'errorCode' in fout) {
    return vertaalAuthFout(fout);
  }
  return vertaalMapFout(fout);
}

export function useVerplaatsen() {
  const { isVoorbeeld } = useScan();
  // Een token met de extra rechten. De eerste keer vraagt Microsoft in een popup om toestemming.
  const haalToken = useToken(scopesVerplaatsen);
  // Voorbeelddata: een verzonnen bron in het geheugen. Anders: de echte, via Microsoft Graph.
  const bron = useMemo(() => (isVoorbeeld ? maakVoorbeeldBron() : maakGraphBron(haalToken)), [isVoorbeeld, haalToken]);

  const onedrive = useMapVenster(bron);
  const sharepoint = useMapVenster(bron);
  const [verbinding, setVerbinding] = useState<Verbinding>('niet verbonden');
  const [verbindFout, setVerbindFout] = useState<string | undefined>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [gekozenTeamId, setGekozenTeamId] = useState('');

  const [bezigMetVerplaatsen, setBezigMetVerplaatsen] = useState(false);
  const [aantalKlaar, setAantalKlaar] = useState(0); // voortgang
  const [resultaten, setResultaten] = useState<VerplaatsResultaat[]>([]);

  async function kiesTeam(team: Team) {
    setGekozenTeamId(team.id);
    try {
      sharepoint.openPlek(await bron.haalTeamOpslag(team));
    } catch (fout) {
      setVerbindFout(vertaalMapFout(fout));
    }
  }

  // Na een klik op "Verbinden met SharePoint". Pas hier vraagt de tool de extra rechten.
  async function verbind() {
    setVerbinding('bezig');
    setVerbindFout(undefined);
    try {
      onedrive.openPlek(await bron.haalOneDrive());
      const gevondenTeams = await bron.haalTeams();
      setTeams(gevondenTeams);
      setVerbinding('verbonden');
      // Zit je in maar één team, dan hoef je niets te kiezen.
      if (gevondenTeams.length === 1) {
        await kiesTeam(gevondenTeams[0]);
      }
    } catch (fout) {
      setVerbinding('fout');
      setVerbindFout(vertaalVerbindFout(fout));
    }
  }

  // Verplaatst de bestanden één voor één naar de map die rechts open is.
  // Eén voor één: dan zie je de voortgang, en een fout bij één bestand stopt de rest niet.
  async function verplaats(bestanden: MapItem[]) {
    const van = onedrive.plek;
    const naar = sharepoint.plek;
    const doelmap = sharepoint.pad[sharepoint.pad.length - 1];
    if (!van || !naar || !doelmap) {
      return;
    }

    setBezigMetVerplaatsen(true);
    setAantalKlaar(0);
    setResultaten([]);
    const nieuweResultaten: VerplaatsResultaat[] = [];

    for (const bestand of bestanden) {
      try {
        await bron.verplaatsBestand(bestand, van, naar, doelmap.id);
        nieuweResultaten.push({ naam: bestand.naam, gelukt: true });
      } catch (fout) {
        nieuweResultaten.push({ naam: bestand.naam, gelukt: false, melding: vertaalVerplaatsFout(fout) });
      }
      setAantalKlaar(nieuweResultaten.length);
    }

    setResultaten(nieuweResultaten);
    setBezigMetVerplaatsen(false);
    // Beide tabellen opnieuw ophalen, zodat je ziet waar alles nu staat.
    await Promise.all([onedrive.herlaad(), sharepoint.herlaad()]);
  }

  function wisResultaten() {
    setResultaten([]);
    setAantalKlaar(0);
  }

  return {
    isVoorbeeld,
    verbinding,
    verbindFout,
    teams,
    gekozenTeamId,
    onedrive,
    sharepoint,
    bezigMetVerplaatsen,
    aantalKlaar,
    resultaten,
    verbind: () => void verbind(),
    kiesTeam: (team: Team) => void kiesTeam(team),
    verplaats: (bestanden: MapItem[]) => void verplaats(bestanden),
    wisResultaten,
  };
}
