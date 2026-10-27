// Verzonnen DriveItems om zonder inloggen te bouwen en te demonstreren. Geen echte namen of gegevens.
import type { DriveItem, Quota } from '../graph/types';

// Een eenvoudige "willekeur" met een vast startgetal: elke keer precies dezelfde reeks getallen.
// Zo ziet de demo er altijd hetzelfde uit en kun je er tests op baseren.
function maakWillekeur(startgetal: number): () => number {
  let toestand = startgetal;
  return () => {
    toestand = (toestand * 1664525 + 1013904223) % 4294967296;
    return toestand / 4294967296; // getal tussen 0 en 1
  };
}

const MB = 1_000_000;

interface Sjabloon {
  map: string;
  naam: string; // {n} wordt een volgnummer
  extensie: string;
  aantal: number;
  minMB: number;
  maxMB: number;
  maxDagenOud: number;
}

// Verdeling over mappen, soorten, groottes en leeftijden.
const SJABLONEN: Sjabloon[] = [
  { map: '/Documenten', naam: 'Notulen teamoverleg {n}', extensie: 'docx', aantal: 45, minMB: 0.02, maxMB: 0.4, maxDagenOud: 900 },
  { map: '/Documenten', naam: 'Beleidsnotitie {n}', extensie: 'pdf', aantal: 25, minMB: 0.2, maxMB: 6, maxDagenOud: 1200 },
  { map: '/Documenten/Projecten', naam: 'Projectplan {n}', extensie: 'docx', aantal: 20, minMB: 0.05, maxMB: 2, maxDagenOud: 700 },
  { map: '/Documenten/Projecten', naam: 'Planning {n}', extensie: 'xlsx', aantal: 20, minMB: 0.02, maxMB: 3, maxDagenOud: 500 },
  { map: '/Presentaties', naam: 'Presentatie kwartaal {n}', extensie: 'pptx', aantal: 30, minMB: 1, maxMB: 60, maxDagenOud: 1000 },
  { map: '/Financien', naam: 'Begroting {n}', extensie: 'xlsx', aantal: 25, minMB: 0.05, maxMB: 8, maxDagenOud: 1500 },
  { map: '/Afbeeldingen', naam: 'Foto evenement {n}', extensie: 'jpg', aantal: 70, minMB: 1.5, maxMB: 9, maxDagenOud: 1400 },
  { map: '/Afbeeldingen/Schermafbeeldingen', naam: 'Schermafbeelding {n}', extensie: 'png', aantal: 25, minMB: 0.1, maxMB: 2, maxDagenOud: 400 },
  { map: '/Video', naam: 'Opname webinar {n}', extensie: 'mp4', aantal: 6, minMB: 400, maxMB: 2500, maxDagenOud: 1100 },
  { map: '/Archief', naam: 'Export {n}', extensie: 'zip', aantal: 10, minMB: 20, maxMB: 300, maxDagenOud: 2000 },
  { map: '', naam: 'Kladblok {n}', extensie: 'txt', aantal: 10, minMB: 0.001, maxMB: 0.05, maxDagenOud: 200 },
];

const MAPPEN = ['Documenten', 'Documenten/Projecten', 'Presentaties', 'Financien', 'Afbeeldingen', 'Afbeeldingen/Schermafbeeldingen', 'Video', 'Archief'];

const DAG_IN_MS = 24 * 60 * 60 * 1000;

function maakBestandItems(nu: Date, willekeur: () => number): DriveItem[] {
  const items: DriveItem[] = [];

  for (const sjabloon of SJABLONEN) {
    for (let n = 1; n <= sjabloon.aantal; n++) {
      const grootteMB = sjabloon.minMB + willekeur() * (sjabloon.maxMB - sjabloon.minMB);
      const dagenOud = Math.floor(willekeur() * sjabloon.maxDagenOud);
      const gewijzigd = new Date(nu.getTime() - dagenOud * DAG_IN_MS).toISOString();
      const naam = `${sjabloon.naam.replace('{n}', String(n))}.${sjabloon.extensie}`;

      items.push({
        id: `voorbeeld-${items.length + 1}`,
        name: naam,
        size: Math.round(grootteMB * MB),
        lastModifiedDateTime: gewijzigd,
        fileSystemInfo: { lastModifiedDateTime: gewijzigd },
        parentReference: { path: `/drive/root:${sjabloon.map}` },
        file: {},
        // Geen webUrl: voorbeeldbestanden bestaan niet echt in OneDrive.
      });
    }
  }
  return items;
}

// Mappen en een verwijderd item: die moet de app overslaan, net als bij een echte scan.
function maakOverigeItems(nu: Date): DriveItem[] {
  const datum = nu.toISOString();
  const mappen: DriveItem[] = MAPPEN.map((pad, index) => {
    const delen = pad.split('/');
    const naam = delen[delen.length - 1];
    const ouder = delen.slice(0, -1).join('/');
    return {
      id: `voorbeeld-map-${index + 1}`,
      name: naam,
      lastModifiedDateTime: datum,
      parentReference: { path: ouder ? `/drive/root:/${ouder}` : '/drive/root:' },
      folder: { childCount: 0 },
    };
  });

  const verwijderd: DriveItem = {
    id: 'voorbeeld-verwijderd-1',
    name: 'Oud concept.docx',
    lastModifiedDateTime: datum,
    deleted: { state: 'deleted' },
  };

  return [...mappen, verwijderd];
}

export function maakVoorbeeldItems(nu: Date): DriveItem[] {
  const willekeur = maakWillekeur(2026);
  return [...maakOverigeItems(nu), ...maakBestandItems(nu, willekeur)];
}

export function maakVoorbeeldQuota(items: DriveItem[]): Quota {
  const prullenbak = 1_200 * MB;
  let gebruikt = prullenbak;
  for (const item of items) {
    if (item.file) {
      gebruikt += item.size ?? 0;
    }
  }
  return { used: gebruikt, deleted: prullenbak, total: 1_000_000 * MB };
}
