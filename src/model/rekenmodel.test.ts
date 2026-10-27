// Tests voor het rekenmodel, met de controletest uit Gröger 2020 (par. 6.7).
import { describe, expect, it } from 'vitest';
import { rekenConfig } from './config';
import { berekenImpact } from './rekenmodel';
import type { RekenConfig } from './types';

// De oude HvA-factoren: zonder bandbreedte, dus laag en hoog zijn gelijk.
const oudeHvaConfig: RekenConfig = {
  wattPerTB: { laag: 10, hoog: 10 },
  kopieen: 2,
  pue: 1.5,
  urenPerJaar: 8760,
  kgCo2PerKwh: { laag: 0.468, hoog: 0.468 },
  bron: {},
};

describe('berekenImpact', () => {
  it('controletest: 250 GB geeft ongeveer 65,7 kWh en 30,7 kg CO2 per jaar', () => {
    const impact = berekenImpact(250e9, oudeHvaConfig);

    expect(impact.kwhPerJaar.laag).toBeCloseTo(65.7, 1);
    expect(impact.kwhPerJaar.hoog).toBeCloseTo(65.7, 1);
    expect(impact.kgCo2PerJaar.laag).toBeCloseTo(30.7, 0);
    expect(impact.kgCo2PerJaar.hoog).toBeCloseTo(30.7, 0);
  });

  it('geeft 0 voor 0 bytes', () => {
    const impact = berekenImpact(0, rekenConfig);

    expect(impact.bytes).toBe(0);
    expect(impact.kwhPerJaar).toEqual({ laag: 0, hoog: 0 });
    expect(impact.kgCo2PerJaar).toEqual({ laag: 0, hoog: 0 });
  });

  it('rekent 1 TB uit met de voorlopige waarden', () => {
    const impact = berekenImpact(1e12, rekenConfig);

    // laag: 0,65 W × 2 × 1,185 × 8760 h / 1000 = 13,49 kWh
    expect(impact.kwhPerJaar.laag).toBeCloseTo(13.495, 2);
    // hoog: 10 W × 2 × 1,185 × 8760 h / 1000 = 207,61 kWh
    expect(impact.kwhPerJaar.hoog).toBeCloseTo(207.612, 2);
    expect(impact.kgCo2PerJaar.laag).toBeCloseTo(13.495 * 0.2, 2);
    expect(impact.kgCo2PerJaar.hoog).toBeCloseTo(207.612 * 0.328, 2);
  });

  it('laag is nooit hoger dan hoog', () => {
    const impact = berekenImpact(123_456_789, rekenConfig);

    expect(impact.kwhPerJaar.laag).toBeLessThanOrEqual(impact.kwhPerJaar.hoog);
    expect(impact.kgCo2PerJaar.laag).toBeLessThanOrEqual(impact.kgCo2PerJaar.hoog);
  });

  it('twee keer de helft is evenveel als het geheel', () => {
    const helft = berekenImpact(5e9, rekenConfig);
    const geheel = berekenImpact(10e9, rekenConfig);

    expect(helft.kwhPerJaar.hoog * 2).toBeCloseTo(geheel.kwhPerJaar.hoog, 10);
  });
});
