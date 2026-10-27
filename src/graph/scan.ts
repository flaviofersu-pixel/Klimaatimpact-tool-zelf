// scanDrive(): leest alle items van de eigen OneDrive met delta, ook in submappen, pagina voor pagina.
import { graphGet, type GraphOpties } from './client';
import type { DriveItem } from './types';

// Alleen metadata. Nooit de inhoud van bestanden en geen deelgegevens (harde regel 2).
const VELDEN = 'id,name,size,file,folder,parentReference,lastModifiedDateTime,fileSystemInfo,webUrl,deleted';
export const DELTA_PAD = `/me/drive/root/delta?$select=${VELDEN}`;

interface DeltaPagina {
  value: DriveItem[];
  '@odata.nextLink'?: string; // er komt nog een pagina
  '@odata.deltaLink'?: string; // dit was de laatste pagina
}

export interface ScanOpties extends GraphOpties {
  opElkePagina: (items: DriveItem[]) => void; // voor de voortgang
}

export async function scanDrive(opties: ScanOpties): Promise<void> {
  let volgende: string | undefined = DELTA_PAD;

  // Zolang Graph een nextLink meestuurt, is er nog een pagina.
  while (volgende) {
    const pagina: DeltaPagina = await graphGet<DeltaPagina>(volgende, opties);
    opties.opElkePagina(pagina.value ?? []);
    volgende = pagina['@odata.nextLink'];
  }
}
