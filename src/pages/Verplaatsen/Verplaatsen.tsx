// Scherm 11 (oefenfeature, fase 10): links je OneDrive, rechts de SharePoint van je team.
// Sleep een bestand naar rechts, of vink bestanden aan en gebruik de knop (voor wie niet kan slepen).
import {
  Body1,
  Button,
  Card,
  Field,
  makeStyles,
  mergeClasses,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Select,
  Title1,
  tokens,
} from '@fluentui/react-components';
import { useState } from 'react';
import { GeenScan } from '../../components/GeenScan';
import { formatAantal } from '../../model/opmaak';
import type { MapItem } from '../../model/types';
import { useScan } from '../../state/useScan';
import { useVerplaatsen } from '../../state/useVerplaatsen';
import { MapVenster } from './MapVenster';
import { VerplaatsDialoog } from './VerplaatsDialoog';

const useStyles = makeStyles({
  kaart: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '720px',
  },
  // Twee kolommen naast elkaar; op een smal scherm onder elkaar
  tweeKolommen: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  samenvatting: {
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
    boxShadow: tokens.shadow16,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
});

export function Verplaatsen() {
  const styles = useStyles();
  const { analyse } = useScan();
  const verplaatsen = useVerplaatsen();
  const { onedrive, sharepoint } = verplaatsen;

  // Id's van de bestanden die links zijn aangevinkt. We tellen alleen bestanden uit de map die nu open is.
  const [gekozen, setGekozen] = useState<string[]>([]);
  // De bestanden in de dialoog. null: de dialoog is dicht.
  const [inDialoog, setInDialoog] = useState<MapItem[] | null>(null);

  if (!analyse) {
    return <GeenScan />;
  }

  const gekozenIds = new Set(gekozen);
  const gekozenBestanden = onedrive.items.filter((item) => gekozenIds.has(item.id));
  const doelmap = sharepoint.pad[sharepoint.pad.length - 1];
  const doelNaam = sharepoint.pad.map((stap) => stap.naam).join(' › ');
  const kanVerplaatsen = sharepoint.plek !== null && !sharepoint.laden && doelmap !== undefined;

  function wisselBestand(id: string) {
    setGekozen(gekozenIds.has(id) ? gekozen.filter((gekozenId) => gekozenId !== id) : [...gekozen, id]);
  }

  // Een bestand is rechts losgelaten. Was het aangevinkt, dan gaan alle aangevinkte mee; anders alleen dit bestand.
  function bijLosgelaten(bestandId: string) {
    const bestand = onedrive.items.find((item) => item.id === bestandId && !item.isMap);
    if (!bestand || !kanVerplaatsen) {
      return;
    }
    setInDialoog(gekozenIds.has(bestandId) ? gekozenBestanden : [bestand]);
  }

  function sluitDialoog() {
    setInDialoog(null);
    setGekozen([]);
    verplaatsen.wisResultaten();
  }

  function kiesTeam(teamId: string) {
    const team = verplaatsen.teams.find((t) => t.id === teamId);
    if (team) {
      verplaatsen.kiesTeam(team);
    }
  }

  return (
    <>
      <Title1 as="h1">Verplaatsen naar SharePoint</Title1>

      {verplaatsen.verbinding !== 'verbonden' && (
        <Card className={styles.kaart}>
          <Body1>
            Werkdocumenten die je met je team deelt, horen in de SharePoint van je team. Daar kan iedereen erbij en
            gelden de bewaarregels van de gemeente. Hier zie je links je OneDrive en rechts de SharePoint van een team
            waar je in zit. Sleep een bestand naar rechts om het te verplaatsen.
          </Body1>
          {!verplaatsen.isVoorbeeld && (
            <Body1>
              Hiervoor heeft de tool meer rechten nodig dan voor de scan: je teams zien en bestanden in OneDrive en
              SharePoint aanpassen. Microsoft vraagt je daar in een apart venster om. De tool verplaatst alleen iets als
              jij dat bevestigt.
            </Body1>
          )}
          {verplaatsen.verbindFout && (
            <MessageBar intent="error" layout="multiline">
              <MessageBarBody>{verplaatsen.verbindFout}</MessageBarBody>
            </MessageBar>
          )}
          <div className={styles.knoppen}>
            <Button appearance="primary" disabled={verplaatsen.verbinding === 'bezig'} onClick={verplaatsen.verbind}>
              {verplaatsen.verbinding === 'bezig' ? 'Bezig met verbinden...' : 'Verbinden met SharePoint'}
            </Button>
          </div>
        </Card>
      )}

      {verplaatsen.verbinding === 'verbonden' && (
        <>
          <MessageBar intent="info" layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>Verplaatsen verlaagt de uitstoot niet.</MessageBarTitle>
              Het bestand neemt in SharePoint evenveel ruimte in als in je OneDrive. Het helpt wel als je team daarna
              één versie deelt, in plaats van dat iedereen een eigen kopie bewaart.
            </MessageBarBody>
          </MessageBar>

          <div className={styles.tweeKolommen}>
            <MapVenster
              titel="Mijn OneDrive"
              venster={onedrive}
              gekozenIds={gekozenIds}
              onWisselBestand={wisselBestand}
            />
            <MapVenster
              titel="SharePoint van je team"
              venster={sharepoint}
              leegTekst={
                verplaatsen.teams.length === 0
                  ? 'Je bent geen lid van een team. Zonder team is er geen SharePoint om naar te verplaatsen.'
                  : 'Kies hierboven een team.'
              }
              onLosgelaten={bijLosgelaten}
              kop={
                verplaatsen.teams.length > 0 && (
                  <Field label="Team">
                    <Select value={verplaatsen.gekozenTeamId} onChange={(_gebeurtenis, data) => kiesTeam(data.value)}>
                      <option value="" disabled>
                        Kies een team
                      </option>
                      {verplaatsen.teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.naam}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )
              }
            />
          </div>

          {/* De knop doet hetzelfde als slepen. Zo kan het ook met het toetsenbord of een schermlezer. */}
          <Card className={mergeClasses(styles.kaart, styles.samenvatting)}>
            <Body1 role="status">
              {gekozenBestanden.length === 0
                ? 'Vink links bestanden aan, of sleep een bestand naar rechts.'
                : `Gekozen: ${formatAantal(gekozenBestanden.length, 'bestand', 'bestanden')}.`}
            </Body1>
            <div className={styles.knoppen}>
              <Button
                appearance="primary"
                disabled={gekozenBestanden.length === 0 || !kanVerplaatsen}
                onClick={() => setInDialoog(gekozenBestanden)}
              >
                {kanVerplaatsen ? `Verplaatsen naar ${doelNaam}` : 'Verplaatsen (kies eerst een team)'}
              </Button>
            </div>
          </Card>
        </>
      )}

      <VerplaatsDialoog
        open={inDialoog !== null}
        bestanden={inDialoog ?? []}
        doelNaam={doelNaam}
        inDoelmap={sharepoint.items}
        bezig={verplaatsen.bezigMetVerplaatsen}
        aantalKlaar={verplaatsen.aantalKlaar}
        resultaten={verplaatsen.resultaten}
        onVerplaats={verplaatsen.verplaats}
        onSluiten={sluitDialoog}
      />
    </>
  );
}
