// Verzonnen OneDrive en teams voor het Verplaatsen-scherm. Alles staat in het geheugen; verplaatsen verandert
// alleen deze lijst. Ververs je de pagina, dan staat alles weer op de oude plek. Geen echte namen of gegevens.
import { GraphFout } from '../graph/client';
import { sorteerMapItems } from '../model/mappen';
import type { MapItem, Opslagplek, Team } from '../model/types';
import type { OpslagBron } from '../state/opslagBron';

const MB = 1_000_000;
const DAG_IN_MS = 24 * 60 * 60 * 1000;
const STANDAARD_VERTRAGING_MS = 300; // doen alsof het netwerk even nodig heeft, zodat je "Laden..." ziet

// Eén map of bestand in het geheugen. ouderId is de map waar het in staat.
interface Knoop {
  id: string;
  naam: string;
  isMap: boolean;
  grootte: number; // alleen bij bestanden; de grootte van een map rekenen we uit
  dagenOud: number;
  driveId: string;
  ouderId: string;
}

// [pad, grootte in MB, dagen oud]. Een pad dat eindigt op "/" is een map.
type Regel = [string, number, number];

const ONEDRIVE: Regel[] = [
  ['Documenten/', 0, 30],
  ['Documenten/Projectplan Klimaat.docx', 0.8, 40],
  ['Documenten/Notulen overleg maart.docx', 0.1, 220],
  ['Documenten/Notulen overleg april.docx', 0.1, 190],
  ['Documenten/Begroting 2026.xlsx', 2.4, 15],
  ['Documenten/Oud/', 0, 400],
  ['Documenten/Oud/Concept beleidsnota.docx', 1.2, 600],
  ['Presentaties/', 0, 60],
  ['Presentaties/Kick-off duurzaamheid.pptx', 35, 60],
  ['Presentaties/Bewonersavond.pptx', 48, 300],
  ['Afbeeldingen/', 0, 100],
  ['Afbeeldingen/Foto werkbezoek 1.jpg', 4.2, 100],
  ['Afbeeldingen/Foto werkbezoek 2.jpg', 3.9, 100],
  ['Opname teamoverleg.mp4', 850, 12],
  ['Kladblok.txt', 0.01, 3],
];

const TEAMS: { team: Team; regels: Regel[] }[] = [
  {
    team: { id: 'team-duurzaamheid', naam: 'Team Duurzaamheid' },
    regels: [
      ['Algemeen/', 0, 10],
      ['Algemeen/Werkafspraken.docx', 0.2, 80],
      ['Projecten/', 0, 20],
      ['Projecten/Projectplan Klimaat.docx', 0.7, 50], // dezelfde naam als in de OneDrive: zo zie je de waarschuwing
      ['Projecten/Planning.xlsx', 0.5, 20],
      ['Presentaties/', 0, 90],
    ],
  },
  {
    team: { id: 'team-communicatie', naam: 'Team Communicatie' },
    regels: [
      ['Algemeen/', 0, 5],
      ['Beeldbank/', 0, 30],
      ['Beeldbank/Logo.png', 0.3, 700],
    ],
  },
  {
    team: { id: 'team-openbare-ruimte', naam: 'Afdeling Openbare Ruimte' },
    regels: [['Algemeen/', 0, 200]],
  },
];

// Zet de lijst regels om naar knopen. De id van een knoop is "drive:pad", dan is hij altijd uniek.
function maakKnopen(driveId: string, regels: Regel[]): Knoop[] {
  const hoofdmapId = `${driveId}:`;
  return regels.map(([pad, grootteMB, dagenOud]) => {
    const isMap = pad.endsWith('/');
    const zonderSlash = isMap ? pad.slice(0, -1) : pad;
    const delen = zonderSlash.split('/');
    const ouderPad = delen.slice(0, -1).join('/');
    return {
      id: `${driveId}:${zonderSlash}`,
      naam: delen[delen.length - 1],
      isMap,
      grootte: Math.round(grootteMB * MB),
      dagenOud,
      driveId,
      ouderId: ouderPad ? `${driveId}:${ouderPad}` : hoofdmapId,
    };
  });
}

// vertragingMs: de tests geven 0 mee, dan hoeven ze niet te wachten.
export function maakVoorbeeldBron(nu: Date = new Date(), vertragingMs = STANDAARD_VERTRAGING_MS): OpslagBron {
  function wachtEven(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, vertragingMs));
  }

  // Alle knopen van alle drives in één lijst. Verplaatsen past deze lijst aan.
  let knopen: Knoop[] = [
    ...maakKnopen('onedrive', ONEDRIVE),
    ...TEAMS.flatMap(({ team, regels }) => maakKnopen(team.id, regels)),
  ];

  function kinderen(mapId: string): Knoop[] {
    return knopen.filter((knoop) => knoop.ouderId === mapId);
  }

  // De grootte van een map is alles wat erin zit, ook in submappen (net als bij Graph).
  function grootteVan(knoop: Knoop): number {
    if (!knoop.isMap) {
      return knoop.grootte;
    }
    let totaal = 0;
    for (const kind of kinderen(knoop.id)) {
      totaal += grootteVan(kind);
    }
    return totaal;
  }

  function naarMapItem(knoop: Knoop): MapItem {
    return {
      id: knoop.id,
      naam: knoop.naam,
      isMap: knoop.isMap,
      grootte: grootteVan(knoop),
      gewijzigdOp: new Date(nu.getTime() - knoop.dagenOud * DAG_IN_MS),
    };
  }

  function maakPlek(soort: Opslagplek['soort'], naam: string, driveId: string): Opslagplek {
    return { soort, naam, driveId, hoofdmapId: `${driveId}:` };
  }

  return {
    haalOneDrive: async () => {
      await wachtEven();
      return maakPlek('onedrive', 'Mijn OneDrive', 'onedrive');
    },

    haalTeams: async () => {
      await wachtEven();
      return TEAMS.map(({ team }) => team);
    },

    haalTeamOpslag: async (team) => {
      await wachtEven();
      return maakPlek('sharepoint', team.naam, team.id);
    },

    haalMapInhoud: async (_plek, mapId) => {
      await wachtEven();
      return sorteerMapItems(kinderen(mapId).map(naarMapItem));
    },

    // Doet hetzelfde als de echte versie, maar dan in de lijst: eerst de naam controleren, dan "verplaatsen".
    verplaatsBestand: async (bestand, _van, naar, naarMapId) => {
      await wachtEven();
      const naamBestaat = kinderen(naarMapId).some((knoop) => knoop.naam.toLowerCase() === bestand.naam.toLowerCase());
      if (naamBestaat) {
        throw new GraphFout(409, 'nameAlreadyExists');
      }
      knopen = knopen.map((knoop) =>
        knoop.id === bestand.id
          ? { ...knoop, id: `${naar.driveId}:verplaatst:${knoop.id}`, driveId: naar.driveId, ouderId: naarMapId }
          : knoop,
      );
    },
  };
}
