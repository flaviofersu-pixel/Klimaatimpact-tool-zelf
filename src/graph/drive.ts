// getQuota(): hoeveel ruimte de eigen OneDrive gebruikt, hoeveel in de prullenbak staat, en het maximum.
import { graphGet, type GraphOpties } from './client';
import type { Quota } from './types';

interface DriveAntwoord {
  quota?: Partial<Quota>;
}

export async function getQuota(opties: GraphOpties): Promise<Quota> {
  const drive = await graphGet<DriveAntwoord>('/me/drive?$select=quota', opties);
  return {
    used: drive.quota?.used ?? 0,
    deleted: drive.quota?.deleted ?? 0,
    total: drive.quota?.total ?? 0,
  };
}
