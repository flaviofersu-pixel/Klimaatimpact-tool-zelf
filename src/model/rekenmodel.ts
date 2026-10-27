// Rekent bytes om naar kWh en kg CO2 per jaar, één keer met de lage en één keer met de hoge factoren.
import type { Impact, RekenConfig } from './types';

// We rekenen decimaal, zoals het bronrapport: 1 TB = 10^12 bytes.
const BYTES_PER_TB = 1e12;
const WATTUUR_PER_KWH = 1000;

// kWh per jaar voor een hoeveelheid bytes, bij één gekozen waarde voor watt per TB.
function kwhPerJaar(bytes: number, wattPerTB: number, config: RekenConfig): number {
  const terabytes = bytes / BYTES_PER_TB;
  const watt = terabytes * wattPerTB * config.kopieen * config.pue;
  return (watt * config.urenPerJaar) / WATTUUR_PER_KWH;
}

export function berekenImpact(bytes: number, config: RekenConfig): Impact {
  const kwhLaag = kwhPerJaar(bytes, config.wattPerTB.laag, config);
  const kwhHoog = kwhPerJaar(bytes, config.wattPerTB.hoog, config);

  return {
    bytes,
    kwhPerJaar: { laag: kwhLaag, hoog: kwhHoog },
    kgCo2PerJaar: {
      laag: kwhLaag * config.kgCo2PerKwh.laag,
      hoog: kwhHoog * config.kgCo2PerKwh.hoog,
    },
  };
}
