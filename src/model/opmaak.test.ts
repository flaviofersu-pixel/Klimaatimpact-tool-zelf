// Tests voor het netjes tonen van getallen en bytes.
import { describe, expect, it } from 'vitest';
import { formatAantal, formatBandbreedte, formatBytes, formatExact, formatGetal, kiesEenheid } from './opmaak';

describe('formatBytes', () => {
  it.each([
    [0, '0 bytes'],
    [999, '999 bytes'],
    [1500, '1,5 kB'],
    [2_000_000, '2 MB'],
    [250e9, '250 GB'],
    [1.25e12, '1,3 TB'],
  ])('%d bytes is %s', (bytes, tekst) => {
    expect(formatBytes(bytes)).toBe(tekst);
  });
});

describe('formatGetal', () => {
  it('gebruikt een komma en twee betekenisvolle cijfers onder de 1', () => {
    expect(formatGetal(65.74)).toBe('65,7');
    expect(formatGetal(0.456)).toBe('0,46');
    expect(formatGetal(0.0042)).toBe('0,0042');
    expect(formatGetal(0.000317)).toBe('bijna 0');
    expect(formatGetal(0)).toBe('0');
  });
});

describe('formatExact', () => {
  it('rondt niet af', () => {
    expect(formatExact(1.185)).toBe('1,185');
    expect(formatExact(8760)).toBe('8.760'); // met duizendtalpunt
  });
});

describe('kiesEenheid', () => {
  it('kiest de grootste eenheid waarin het getal minstens 1 is', () => {
    expect(kiesEenheid(500)).toEqual({ eenheid: 'bytes', deler: 1 });
    expect(kiesEenheid(123_456)).toEqual({ eenheid: 'kB', deler: 1000 });
    expect(kiesEenheid(8.5e9)).toEqual({ eenheid: 'GB', deler: 1e9 });
  });
});

describe('formatAantal', () => {
  it('kiest enkelvoud of meervoud en zet een punt bij duizendtallen', () => {
    expect(formatAantal(0, 'bestand', 'bestanden')).toBe('0 bestanden');
    expect(formatAantal(1, 'bestand', 'bestanden')).toBe('1 bestand');
    expect(formatAantal(12345, 'bestand', 'bestanden')).toBe('12.345 bestanden');
  });
});

describe('formatBandbreedte', () => {
  it('toont van ... tot ...', () => {
    expect(formatBandbreedte({ laag: 1.2, hoog: 18.5 }, 'kWh')).toBe('van 1,2 tot 18,5 kWh');
  });

  it('zegt "bijna 0" bij heel kleine waarden', () => {
    expect(formatBandbreedte({ laag: 0.0001, hoog: 0.02 }, 'kg')).toBe('van bijna 0 tot 0,02 kg');
    expect(formatBandbreedte({ laag: 0.000001, hoog: 0.00005 }, 'kg')).toBe('bijna 0 kg');
  });
});
