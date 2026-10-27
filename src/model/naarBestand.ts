// Zet een DriveItem uit Microsoft Graph om naar een Bestand uit ons eigen model.
import type { DriveItem } from '../graph/types';
import type { Bestand, Bestandssoort } from './types';

// Welke extensie bij welke soort hoort. Alles wat hier niet in staat, is 'overig'.
const EXTENSIES: Record<Exclude<Bestandssoort, 'overig'>, string[]> = {
  word: ['doc', 'docx', 'docm', 'dot', 'dotx', 'odt', 'rtf'],
  excel: ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv', 'ods'],
  powerpoint: ['ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'odp'],
  pdf: ['pdf'],
  afbeelding: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'heic', 'webp', 'svg'],
  video: ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'm4v', 'webm'],
};

export function bepaalSoort(naam: string): Bestandssoort {
  const punt = naam.lastIndexOf('.');
  if (punt === -1) {
    return 'overig';
  }
  const extensie = naam.slice(punt + 1).toLowerCase();

  for (const [soort, extensies] of Object.entries(EXTENSIES)) {
    if (extensies.includes(extensie)) {
      return soort as Bestandssoort;
    }
  }
  return 'overig';
}

// Graph geeft een pad als "/drive/root:/Documenten/Projecten". Wij bewaren "/Documenten/Projecten".
// De hoofdmap zelf wordt "/".
export function bepaalMap(pad: string | undefined): string {
  if (!pad) {
    return '/';
  }
  const naRoot = pad.includes('root:') ? pad.slice(pad.indexOf('root:') + 'root:'.length) : pad;
  const map = naRoot === '' ? '/' : naRoot;

  // Soms staan spaties en speciale tekens als %20 in het pad.
  try {
    return decodeURIComponent(map);
  } catch {
    return map;
  }
}

// Geeft null terug voor alles wat geen bestand is: mappen en verwijderde items.
export function naarBestand(item: DriveItem): Bestand | null {
  if (item.deleted || item.folder || !item.file) {
    return null;
  }

  const gewijzigd = item.fileSystemInfo?.lastModifiedDateTime ?? item.lastModifiedDateTime;

  return {
    id: item.id,
    naam: item.name,
    grootte: item.size ?? 0, // zonder grootte tellen we het bestand mee als 0 bytes
    gewijzigdOp: new Date(gewijzigd),
    map: bepaalMap(item.parentReference?.path),
    soort: bepaalSoort(item.name),
    webUrl: item.webUrl,
  };
}

// Handig voor een hele pagina uit Graph: zet alles om en laat de null-waarden weg.
export function naarBestanden(items: DriveItem[]): Bestand[] {
  const bestanden: Bestand[] = [];
  for (const item of items) {
    const bestand = naarBestand(item);
    if (bestand) {
      bestanden.push(bestand);
    }
  }
  return bestanden;
}
