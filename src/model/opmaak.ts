// Getallen, bytes en bandbreedtes netjes in het Nederlands tonen ("1,2 GB", "van 0,3 tot 4,6 kWh").
import type { Bandbreedte } from './types';

const EENHEDEN = ['bytes', 'kB', 'MB', 'GB', 'TB'];

// Een getal met Nederlandse komma. Kleine getallen krijgen meer cijfers achter de komma.
export function formatGetal(getal: number): string {
  let decimalen = 1;
  if (getal !== 0 && Math.abs(getal) < 1) {
    decimalen = 2;
  }
  if (getal !== 0 && Math.abs(getal) < 0.01) {
    decimalen = 3;
  }
  return getal.toLocaleString('nl-NL', { maximumFractionDigits: decimalen });
}

// Bytes decimaal (1 kB = 1000 bytes), net als het rekenmodel.
export function formatBytes(bytes: number): string {
  let waarde = bytes;
  let eenheid = 0;
  while (waarde >= 1000 && eenheid < EENHEDEN.length - 1) {
    waarde = waarde / 1000;
    eenheid++;
  }
  if (eenheid === 0) {
    return `${waarde} bytes`;
  }
  return `${waarde.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} ${EENHEDEN[eenheid]}`;
}

export function formatBandbreedte(bandbreedte: Bandbreedte, eenheid: string): string {
  return `van ${formatGetal(bandbreedte.laag)} tot ${formatGetal(bandbreedte.hoog)} ${eenheid}`;
}

export function formatDatum(datum: Date): string {
  return datum.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}
