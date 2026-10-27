// Tests voor oude bestanden kiezen, sorteren en de besparing.
import { describe, expect, it } from 'vitest';
import { rekenConfig } from './config';
import { berekenBesparing, kiesOudeBestanden, sorteerBestanden } from './opruimen';
import { berekenImpact } from './rekenmodel';
import type { Bestand } from './types';

const nu = new Date('2026-06-15T12:00:00Z');

function maakBestand(id: string, extra: Partial<Bestand>): Bestand {
  return {
    id,
    naam: `${id}.docx`,
    grootte: 100,
    gewijzigdOp: new Date('2024-01-01'),
    map: '/Documenten',
    soort: 'word',
    ...extra,
  };
}

const bestanden = [
  maakBestand('nieuw', { grootte: 9999, gewijzigdOp: new Date('2026-05-01') }),
  maakBestand('oud-klein', { naam: 'bestand 10.docx', grootte: 50, gewijzigdOp: new Date('2025-11-01') }),
  maakBestand('oud-groot', { naam: 'Bestand 2.docx', grootte: 500, gewijzigdOp: new Date('2023-03-01') }),
];

describe('kiesOudeBestanden', () => {
  it('kiest bestanden van meer dan een half jaar oud, grootste eerst', () => {
    expect(kiesOudeBestanden(bestanden, nu).map((b) => b.id)).toEqual(['oud-groot', 'oud-klein']);
  });

  it('geeft een lege lijst als er niets ouds is', () => {
    expect(kiesOudeBestanden([bestanden[0]], nu)).toEqual([]);
  });
});

describe('sorteerBestanden', () => {
  it('sorteert op grootte, datum en naam', () => {
    expect(sorteerBestanden(bestanden, 'grootte', 'oplopend').map((b) => b.id)).toEqual(['oud-klein', 'oud-groot', 'nieuw']);
    expect(sorteerBestanden(bestanden, 'gewijzigdOp', 'aflopend').map((b) => b.id)).toEqual(['nieuw', 'oud-klein', 'oud-groot']);
  });

  it('sorteert namen zonder op hoofdletters te letten en met getallen op volgorde', () => {
    expect(sorteerBestanden(bestanden, 'naam', 'oplopend').map((b) => b.naam)).toEqual([
      'Bestand 2.docx',
      'bestand 10.docx',
      'nieuw.docx',
    ]);
  });

  it('laat de originele lijst ongemoeid', () => {
    sorteerBestanden(bestanden, 'naam', 'aflopend');
    expect(bestanden.map((b) => b.id)).toEqual(['nieuw', 'oud-klein', 'oud-groot']);
  });
});

describe('berekenBesparing', () => {
  it('telt alleen de gekozen bestanden', () => {
    expect(berekenBesparing(bestanden, ['oud-klein', 'oud-groot'], rekenConfig)).toEqual(
      berekenImpact(550, rekenConfig),
    );
  });

  it('is 0 zonder keuze, en negeert onbekende id\'s', () => {
    expect(berekenBesparing(bestanden, [], rekenConfig).bytes).toBe(0);
    expect(berekenBesparing(bestanden, ['bestaat-niet'], rekenConfig).bytes).toBe(0);
  });
});
