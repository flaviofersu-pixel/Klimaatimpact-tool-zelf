// Getallen, bytes en bandbreedtes netjes in het Nederlands tonen ("1,2 GB", "van 0,3 tot 4,6 kWh").
import type { Bandbreedte } from './types';

const EENHEDEN = ['bytes', 'kB', 'MB', 'GB', 'TB'];
const GRENS_BIJNA_NUL = 0.001;

// Een afgerond getal met Nederlandse komma.
export function formatGetal(getal: number): string {
  if (getal === 0) {
    return '0';
  }
  // Heel kleine getallen zijn op het scherm niet zinvol; dan zeggen we het in gewone taal.
  if (Math.abs(getal) < GRENS_BIJNA_NUL) {
    return 'bijna 0';
  }
  // Onder de 1 tonen we twee "betekenisvolle" cijfers, zodat 0,0003 niet als 0 op het scherm komt.
  if (Math.abs(getal) < 1) {
    return getal.toLocaleString('nl-NL', { maximumSignificantDigits: 2 });
  }
  return getal.toLocaleString('nl-NL', { maximumFractionDigits: 1 });
}

// Een getal precies zoals het is, zonder afronden (voor de factoren van het rekenmodel).
export function formatExact(getal: number): string {
  return getal.toLocaleString('nl-NL', { maximumFractionDigits: 10 });
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
  // Zijn laag en hoog allebei heel klein, dan is "van bijna 0 tot bijna 0" overbodig.
  if (Math.abs(bandbreedte.hoog) < GRENS_BIJNA_NUL) {
    return `bijna 0 ${eenheid}`;
  }
  return `van ${formatGetal(bandbreedte.laag)} tot ${formatGetal(bandbreedte.hoog)} ${eenheid}`;
}

export function formatDatum(datum: Date): string {
  return datum.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}
