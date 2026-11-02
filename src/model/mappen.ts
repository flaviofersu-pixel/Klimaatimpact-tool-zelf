// Pure functies voor het Verplaatsen-scherm: DriveItems omzetten, sorteren en controleren op dubbele namen.
import type { DriveItem } from '../graph/types';
import type { MapItem, Opslagplek } from './types';

// Maakt een Opslagplek van de hoofdmap die Graph teruggeeft. Het id van de drive staat in parentReference.
export function naarOpslagplek(hoofdmap: DriveItem, soort: Opslagplek['soort'], naam: string): Opslagplek {
  const driveId = hoofdmap.parentReference?.driveId;
  if (!driveId) {
    throw new Error('Graph gaf geen drive-id terug voor deze opslagplek.');
  }
  return { soort, naam, driveId, hoofdmapId: hoofdmap.id, webUrl: hoofdmap.webUrl };
}

// Zet een DriveItem om naar een regel in de tabel. Verwijderde items worden null.
// Anders dan bij de scan tellen mappen hier wél mee: je moet ze kunnen openen.
export function naarMapItem(item: DriveItem): MapItem | null {
  if (item.deleted) {
    return null;
  }
  const gewijzigd = item.fileSystemInfo?.lastModifiedDateTime ?? item.lastModifiedDateTime;

  return {
    id: item.id,
    naam: item.name,
    isMap: item.folder !== undefined,
    grootte: item.size ?? 0,
    gewijzigdOp: new Date(gewijzigd),
    webUrl: item.webUrl,
  };
}

// Mappen eerst, daarna bestanden. Binnen elke groep op naam, zoals in de Verkenner.
export function sorteerMapItems(items: MapItem[]): MapItem[] {
  return [...items].sort((a, b) => {
    if (a.isMap !== b.isMap) {
      return a.isMap ? -1 : 1;
    }
    return a.naam.localeCompare(b.naam, 'nl', { sensitivity: 'base', numeric: true });
  });
}

export function naarMapItems(items: DriveItem[]): MapItem[] {
  const regels: MapItem[] = [];
  for (const item of items) {
    const regel = naarMapItem(item);
    if (regel) {
      regels.push(regel);
    }
  }
  return sorteerMapItems(regels);
}

// Welke bestanden hebben een naam die in de doelmap al bestaat?
// SharePoint ziet "Plan.docx" en "plan.docx" als dezelfde naam, dus we vergelijken zonder hoofdletters.
export function zoekDubbeleNamen(teVerplaatsen: MapItem[], inDoelmap: MapItem[]): string[] {
  const bestaandeNamen = new Set(inDoelmap.map((item) => item.naam.toLowerCase()));
  return teVerplaatsen.filter((item) => bestaandeNamen.has(item.naam.toLowerCase())).map((item) => item.naam);
}

// Alle bytes in een lijst regels bij elkaar. Een map telt mee met alles wat erin zit.
export function grootteVanItems(items: MapItem[]): number {
  let totaal = 0;
  for (const item of items) {
    totaal += item.grootte;
  }
  return totaal;
}
