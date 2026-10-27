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

// De grootste eenheid waarin het getal nog minstens 1 is. Decimaal (1 kB = 1000 bytes), net als het rekenmodel.
export function kiesEenheid(bytes: number): { eenheid: string; deler: number } {
  let deler = 1;
  let index = 0;
  while (bytes / deler >= 1000 && index < EENHEDEN.length - 1) {
    deler = deler * 1000;
    index++;
  }
  return { eenheid: EENHEDEN[index], deler };
}

export function formatBytes(bytes: number): string {
  const { eenheid, deler } = kiesEenheid(bytes);
  if (deler === 1) {
    return `${bytes} bytes`;
  }
  return `${(bytes / deler).toLocaleString('nl-NL', { maximumFractionDigits: 1 })} ${eenheid}`;
}

export function formatBandbreedte(bandbreedte: Bandbreedte, eenheid: string): string {
  // Zijn laag en hoog allebei heel klein, dan zeggen we gewoon "bijna 0" in plaats van "van bijna 0 tot bijna 0".
  if (Math.abs(bandbreedte.hoog) < GRENS_BIJNA_NUL) {
    return `bijna 0 ${eenheid}`;
  }
  return `van ${formatGetal(bandbreedte.laag)} tot ${formatGetal(bandbreedte.hoog)} ${eenheid}`;
}

// "1 bestand", "2 bestanden", "12.345 bestanden".
export function formatAantal(aantal: number, enkelvoud: string, meervoud: string): string {
  return `${aantal.toLocaleString('nl-NL')} ${aantal === 1 ? enkelvoud : meervoud}`;
}

export function formatDatum(datum: Date): string {
  return datum.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}
