// Tests voor het omzetten van Graph-items naar Bestanden.
import { describe, expect, it } from 'vitest';
import type { DriveItem } from '../graph/types';
import { bepaalMap, bepaalSoort, naarBestand, naarBestanden } from './naarBestand';

function maakItem(extra: Partial<DriveItem>): DriveItem {
  return {
    id: 'id-1',
    name: 'verslag.docx',
    size: 1000,
    lastModifiedDateTime: '2026-01-10T10:00:00Z',
    parentReference: { path: '/drive/root:/Documenten' },
    file: { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ...extra,
  };
}

describe('bepaalSoort', () => {
  it.each([
    ['notulen.docx', 'word'],
    ['BEGROTING.XLSX', 'excel'],
    ['presentatie.pptx', 'powerpoint'],
    ['folder.pdf', 'pdf'],
    ['foto.jpeg', 'afbeelding'],
    ['film.mp4', 'video'],
    ['archief.zip', 'overig'],
    ['zonder-extensie', 'overig'],
    ['.verborgen', 'overig'],
  ])('%s is %s', (naam, soort) => {
    expect(bepaalSoort(naam)).toBe(soort);
  });
});

describe('bepaalMap', () => {
  it('haalt het stuk vóór root: weg', () => {
    expect(bepaalMap('/drive/root:/Documenten/Projecten')).toBe('/Documenten/Projecten');
  });

  it('werkt ook met een drive-id in het pad', () => {
    expect(bepaalMap('/drives/abc123/root:/Foto')).toBe('/Foto');
  });

  it('geeft / voor de hoofdmap', () => {
    expect(bepaalMap('/drive/root:')).toBe('/');
    expect(bepaalMap(undefined)).toBe('/');
  });

  it('zet %20 om naar een spatie', () => {
    expect(bepaalMap('/drive/root:/Mijn%20documenten')).toBe('/Mijn documenten');
  });
});

describe('naarBestand', () => {
  it('zet een gewoon bestand om', () => {
    const bestand = naarBestand(maakItem({ webUrl: 'https://example.invalid/verslag' }));

    expect(bestand).toEqual({
      id: 'id-1',
      naam: 'verslag.docx',
      grootte: 1000,
      gewijzigdOp: new Date('2026-01-10T10:00:00Z'),
      map: '/Documenten',
      soort: 'word',
      webUrl: 'https://example.invalid/verslag',
    });
  });

  it('gebruikt bij voorkeur fileSystemInfo.lastModifiedDateTime', () => {
    const bestand = naarBestand(
      maakItem({ fileSystemInfo: { lastModifiedDateTime: '2020-05-01T00:00:00Z' } }),
    );

    expect(bestand?.gewijzigdOp).toEqual(new Date('2020-05-01T00:00:00Z'));
  });

  it('slaat mappen over', () => {
    expect(naarBestand(maakItem({ file: undefined, folder: { childCount: 3 } }))).toBeNull();
  });

  it('slaat verwijderde items over', () => {
    expect(naarBestand(maakItem({ deleted: { state: 'deleted' } }))).toBeNull();
  });

  it('telt een bestand zonder grootte als 0 bytes', () => {
    expect(naarBestand(maakItem({ size: undefined }))?.grootte).toBe(0);
  });

  it('naarBestanden laat mappen weg', () => {
    const items = [maakItem({ id: 'a' }), maakItem({ id: 'b', file: undefined, folder: {} })];

    expect(naarBestanden(items).map((bestand) => bestand.id)).toEqual(['a']);
  });
});
