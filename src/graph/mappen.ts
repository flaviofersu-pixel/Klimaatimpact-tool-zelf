// Mappen openen voor het Verplaatsen-scherm: de hoofdmap van een opslagplek en de inhoud van één map.
import { graphGet, type GraphOpties } from './client';
import type { DriveItem } from './types';

// Alleen metadata, net als bij de scan (harde regel 2). parentReference geeft ons het id van de drive.
const VELDEN_HOOFDMAP = 'id,parentReference,webUrl';
const VELDEN_INHOUD = 'id,name,size,file,folder,lastModifiedDateTime,fileSystemInfo,webUrl,deleted';
const PER_PAGINA = 200;

interface Pagina {
  value: DriveItem[];
  '@odata.nextLink'?: string;
}

// De bovenste map van je eigen OneDrive.
export async function haalOneDriveHoofdmap(opties: GraphOpties): Promise<DriveItem> {
  return graphGet<DriveItem>(`/me/drive/root?$select=${VELDEN_HOOFDMAP}`, opties);
}

// De bovenste map van de documenten van een team. Elk team (Microsoft 365-groep) heeft een SharePoint-site.
export async function haalTeamHoofdmap(teamId: string, opties: GraphOpties): Promise<DriveItem> {
  return graphGet<DriveItem>(`/groups/${encodeURIComponent(teamId)}/drive/root?$select=${VELDEN_HOOFDMAP}`, opties);
}

export function inhoudPad(driveId: string, mapId: string): string {
  return `/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(mapId)}/children?$select=${VELDEN_INHOUD}&$top=${PER_PAGINA}`;
}

// Alles wat direct in één map staat (niet in de submappen). Volgt @odata.nextLink bij grote mappen.
export async function haalMapInhoud(driveId: string, mapId: string, opties: GraphOpties): Promise<DriveItem[]> {
  const items: DriveItem[] = [];
  let volgende: string | undefined = inhoudPad(driveId, mapId);

  while (volgende) {
    const pagina: Pagina = await graphGet<Pagina>(volgende, opties);
    items.push(...(pagina.value ?? []));
    volgende = pagina['@odata.nextLink'];
  }
  return items;
}
