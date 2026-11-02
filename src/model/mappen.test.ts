// Tests voor de pure functies van het Verplaatsen-scherm.
import { describe, expect, it } from 'vitest';
import type { DriveItem } from '../graph/types';
import {
  grootteVanItems,
  naarMapItem,
  naarMapItems,
  naarOpslagplek,
  sorteerMapItems,
  zoekDubbeleNamen,
} from './mappen';
import type { MapItem } from './types';

function maakItem(extra: Partial<DriveItem>): DriveItem {
  return {
    id: 'id-1',
    name: 'plan.docx',
    size: 1000,
    lastModifiedDateTime: '2026-01-10T10:00:00Z',
    file: {},
    ...extra,
  };
}

function regel(naam: string, isMap = false, grootte = 10): MapItem {
  return { id: naam, naam, isMap, grootte, gewijzigdOp: new Date('2026-01-01') };
}

describe('naarMapItem', () => {
  it('zet een bestand om', () => {
    expect(naarMapItem(maakItem({ webUrl: 'https://x' }))).toEqual({
      id: 'id-1',
      naam: 'plan.docx',
      isMap: false,
      grootte: 1000,
      gewijzigdOp: new Date('2026-01-10T10:00:00Z'),
      webUrl: 'https://x',
    });
  });

  it('houdt mappen, met de grootte van alles erin', () => {
    const map = naarMapItem(maakItem({ name: 'Projecten', file: undefined, folder: { childCount: 3 }, size: 5000 }));
    expect(map).toMatchObject({ naam: 'Projecten', isMap: true, grootte: 5000 });
  });

  it('slaat verwijderde items over', () => {
    expect(naarMapItem(maakItem({ deleted: { state: 'deleted' } }))).toBeNull();
  });
});

describe('sorteerMapItems', () => {
  it('zet mappen eerst en sorteert daarna op naam', () => {
    const gesorteerd = sorteerMapItems([regel('b.docx'), regel('Zomer', true), regel('a.docx'), regel('Archief', true)]);
    expect(gesorteerd.map((item) => item.naam)).toEqual(['Archief', 'Zomer', 'a.docx', 'b.docx']);
  });

  it('zet "versie 2" vóór "versie 10"', () => {
    const gesorteerd = sorteerMapItems([regel('versie 10.docx'), regel('versie 2.docx')]);
    expect(gesorteerd.map((item) => item.naam)).toEqual(['versie 2.docx', 'versie 10.docx']);
  });
});

describe('naarMapItems', () => {
  it('zet om, laat verwijderde weg en sorteert', () => {
    const items = [
      maakItem({ id: '1', name: 'b.docx' }),
      maakItem({ id: '2', name: 'Map', file: undefined, folder: {} }),
      maakItem({ id: '3', name: 'weg.docx', deleted: { state: 'deleted' } }),
    ];
    expect(naarMapItems(items).map((item) => item.naam)).toEqual(['Map', 'b.docx']);
  });
});

describe('zoekDubbeleNamen', () => {
  it('vindt namen die in de doelmap al bestaan, zonder op hoofdletters te letten', () => {
    const teVerplaatsen = [regel('Plan.docx'), regel('nieuw.xlsx')];
    const inDoelmap = [regel('plan.DOCX'), regel('ander.pdf')];
    expect(zoekDubbeleNamen(teVerplaatsen, inDoelmap)).toEqual(['Plan.docx']);
  });

  it('geeft een lege lijst als de doelmap leeg is', () => {
    expect(zoekDubbeleNamen([regel('plan.docx')], [])).toEqual([]);
  });
});

describe('naarOpslagplek', () => {
  it('haalt het drive-id uit parentReference', () => {
    const hoofdmap = maakItem({ id: 'root-1', parentReference: { driveId: 'drive-9' }, webUrl: 'https://site' });
    expect(naarOpslagplek(hoofdmap, 'sharepoint', 'Team Klimaat')).toEqual({
      soort: 'sharepoint',
      naam: 'Team Klimaat',
      driveId: 'drive-9',
      hoofdmapId: 'root-1',
      webUrl: 'https://site',
    });
  });

  it('geeft een fout zonder drive-id', () => {
    expect(() => naarOpslagplek(maakItem({}), 'onedrive', 'Mijn OneDrive')).toThrow('drive-id');
  });
});

describe('grootteVanItems', () => {
  it('telt alle bytes op, ook die van mappen', () => {
    expect(grootteVanItems([regel('a', false, 100), regel('Map', true, 900)])).toBe(1000);
    expect(grootteVanItems([])).toBe(0);
  });
});
