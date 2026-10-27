// Factoren van het rekenmodel, met bron en jaar. Voorlopige waarden: het team stelt de definitieve vast.
import type { RekenConfig } from './types';

export const rekenConfig: RekenConfig = {
  // Stroom per terabyte opslag, in watt
  wattPerTB: { laag: 0.65, hoog: 10 },
  // Hoeveel kopieën de cloudaanbieder van elk bestand bewaart
  kopieen: 2,
  // Power Usage Effectiveness: extra stroom van het datacenter (koeling enzovoort)
  pue: 1.185,
  // Opslag staat het hele jaar aan
  urenPerJaar: 8760,
  // Uitstoot per kWh stroom, in kg CO2
  kgCo2PerKwh: { laag: 0.2, hoog: 0.328 },
  bron: {
    wattPerTB: 'Laag: Cloud Carbon Footprint (6,5 W per 10 TB). Hoog: Gröger 2020.',
    kopieen: 'Gröger 2020.',
    pue: 'Cloud Carbon Footprint, waarde voor Microsoft.',
    urenPerJaar: 'Het hele jaar (365 × 24 uur).',
    kgCo2PerKwh: 'Laag: CBS 2025 (over 2024). Hoog: co2emissiefactoren.nl 2024.',
  },
};
