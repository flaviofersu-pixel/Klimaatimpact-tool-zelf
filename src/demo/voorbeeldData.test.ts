// Tests voor de voorbeelddata: genoeg bestanden, altijd dezelfde, en mappen worden overgeslagen.
import { describe, expect, it } from 'vitest';
import { naarBestanden } from '../model/naarBestand';
import { maakVoorbeeldItems, maakVoorbeeldQuota } from './voorbeeldData';

const nu = new Date('2026-06-15T12:00:00Z');

describe('voorbeelddata', () => {
  it('heeft ongeveer 300 bestanden', () => {
    const bestanden = naarBestanden(maakVoorbeeldItems(nu));

    expect(bestanden.length).toBeGreaterThanOrEqual(250);
    expect(bestanden.length).toBeLessThanOrEqual(350);
  });

  it('is elke keer hetzelfde', () => {
    expect(maakVoorbeeldItems(nu)).toEqual(maakVoorbeeldItems(nu));
  });

  it('bevat mappen en een verwijderd item die niet als bestand meetellen', () => {
    const items = maakVoorbeeldItems(nu);
    const bestanden = naarBestanden(items);

    expect(items.length).toBeGreaterThan(bestanden.length);
  });

  it('heeft alle soorten', () => {
    const soorten = new Set(naarBestanden(maakVoorbeeldItems(nu)).map((bestand) => bestand.soort));

    expect([...soorten].sort()).toEqual(['afbeelding', 'excel', 'overig', 'pdf', 'powerpoint', 'video', 'word']);
  });

  it('quota.used is minstens zo groot als alle bestanden samen', () => {
    const items = maakVoorbeeldItems(nu);
    const totaal = naarBestanden(items).reduce((som, bestand) => som + bestand.grootte, 0);

    expect(maakVoorbeeldQuota(items).used).toBeGreaterThanOrEqual(totaal);
  });
});
