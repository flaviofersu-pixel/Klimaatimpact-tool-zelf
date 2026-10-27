// Tests voor maakAnalyse. "nu" staat vast, zodat de uitkomst altijd hetzelfde is.
import { describe, expect, it } from 'vitest';
import {
  HOOFDMAP,
  LEEFTIJD_MIDDEL,
  LEEFTIJD_NIEUW,
  LEEFTIJD_OUD,
  bepaalLeeftijdsgroep,
  bovensteMap,
  maakAnalyse,
} from './analyse';
import { rekenConfig } from './config';
import { berekenImpact } from './rekenmodel';
import type { Bestand } from './types';

const nu = new Date('2026-06-15T12:00:00Z');

function maakBestand(extra: Partial<Bestand>): Bestand {
  return {
    id: 'id',
    naam: 'bestand.docx',
    grootte: 1000,
    gewijzigdOp: new Date('2026-06-01T00:00:00Z'),
    map: '/Documenten',
    soort: 'word',
    ...extra,
  };
}

describe('bepaalLeeftijdsgroep', () => {
  it('deelt bestanden in naar leeftijd', () => {
    expect(bepaalLeeftijdsgroep(maakBestand({ gewijzigdOp: new Date('2026-03-01') }), nu)).toBe(LEEFTIJD_NIEUW);
    expect(bepaalLeeftijdsgroep(maakBestand({ gewijzigdOp: new Date('2025-10-01') }), nu)).toBe(LEEFTIJD_MIDDEL);
    expect(bepaalLeeftijdsgroep(maakBestand({ gewijzigdOp: new Date('2024-01-01') }), nu)).toBe(LEEFTIJD_OUD);
  });

  it('net iets meer dan een half jaar oud valt in 6 tot 12 maanden', () => {
    expect(bepaalLeeftijdsgroep(maakBestand({ gewijzigdOp: new Date('2025-12-15T12:00:00Z') }), nu)).toBe(
      LEEFTIJD_MIDDEL,
    );
  });
});

describe('bovensteMap', () => {
  it('pakt de eerste map uit het pad', () => {
    expect(bovensteMap('/Documenten/Projecten/2024')).toBe('Documenten');
  });

  it('noemt de hoofdmap "Hoofdmap"', () => {
    expect(bovensteMap('/')).toBe(HOOFDMAP);
  });
});

describe('maakAnalyse', () => {
  const bestanden = [
    maakBestand({ id: 'a', grootte: 100, soort: 'word', map: '/Documenten', gewijzigdOp: new Date('2026-05-01') }),
    maakBestand({ id: 'b', grootte: 5000, soort: 'video', map: '/Video', gewijzigdOp: new Date('2023-01-01') }),
    maakBestand({ id: 'c', grootte: 300, soort: 'word', map: '/Documenten/Oud', gewijzigdOp: new Date('2025-09-01') }),
    maakBestand({ id: 'd', grootte: 50, soort: 'overig', map: '/', gewijzigdOp: new Date('2026-06-01') }),
  ];
  const quota = { used: 9000, deleted: 2000, total: 1e12 };

  const analyse = maakAnalyse(bestanden, quota, rekenConfig, nu);

  it('telt alle bestanden op in het totaal', () => {
    expect(analyse.totaal).toEqual(berekenImpact(5450, rekenConfig));
  });

  it('rekent de prullenbak uit de quota', () => {
    expect(analyse.prullenbak.bytes).toBe(2000);
  });

  it('geeft altijd drie leeftijdsgroepen in vaste volgorde', () => {
    expect(analyse.perLeeftijd.map((groep) => [groep.naam, groep.aantal, groep.impact.bytes])).toEqual([
      [LEEFTIJD_NIEUW, 2, 150],
      [LEEFTIJD_MIDDEL, 1, 300],
      [LEEFTIJD_OUD, 1, 5000],
    ]);
  });

  it('groepeert per soort, grootste eerst', () => {
    expect(analyse.perSoort.map((groep) => [groep.naam, groep.aantal])).toEqual([
      ["Video's", 1],
      ['Word', 2],
      ['Overig', 1],
    ]);
  });

  it('groepeert per bovenste map, grootste eerst', () => {
    expect(analyse.perMap.map((groep) => [groep.naam, groep.impact.bytes])).toEqual([
      ['Video', 5000],
      ['Documenten', 400],
      [HOOFDMAP, 50],
    ]);
  });

  it('zet de grootste bestanden bovenaan', () => {
    expect(analyse.grootste.map((bestand) => bestand.id)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('verandert de volgorde van de originele lijst niet', () => {
    expect(bestanden.map((bestand) => bestand.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('werkt met één bestand', () => {
    const een = maakAnalyse([bestanden[0]], quota, rekenConfig, nu);

    expect(een.totaal.bytes).toBe(100);
    expect(een.perSoort).toHaveLength(1);
    expect(een.grootste).toHaveLength(1);
  });

  it('telt een bestand zonder grootte (0 bytes) wel mee in het aantal', () => {
    const leeg = maakBestand({ id: 'leeg', grootte: 0 });
    const analyseMetLeeg = maakAnalyse([leeg], undefined, rekenConfig, nu);

    expect(analyseMetLeeg.perSoort[0].aantal).toBe(1);
    expect(analyseMetLeeg.totaal.bytes).toBe(0);
  });

  it('kan 100.000 bestanden aan', () => {
    const veel = Array.from({ length: 100_000 }, (_, i) =>
      maakBestand({ id: `b${i}`, grootte: i, map: `/Map ${i % 50}`, gewijzigdOp: new Date(2020, 0, 1 + (i % 2000)) }),
    );
    const start = performance.now();
    const groot = maakAnalyse(veel, quota, rekenConfig, nu);

    expect(groot.perMap).toHaveLength(50);
    expect(groot.grootste[0].grootte).toBe(99_999);
    expect(performance.now() - start).toBeLessThan(2000); // ruim; in de praktijk een fractie daarvan
  });

  it('werkt met een lege OneDrive en zonder quota', () => {
    const leeg = maakAnalyse([], undefined, rekenConfig, nu);

    expect(leeg.totaal.bytes).toBe(0);
    expect(leeg.prullenbak.bytes).toBe(0);
    expect(leeg.perLeeftijd).toHaveLength(3);
    expect(leeg.perSoort).toEqual([]);
    expect(leeg.perMap).toEqual([]);
    expect(leeg.grootste).toEqual([]);
  });
});
