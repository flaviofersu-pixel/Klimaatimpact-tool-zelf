// Tests voor het netjes tonen van getallen en bytes.
import { describe, expect, it } from 'vitest';
import { formatBandbreedte, formatBytes, formatGetal } from './opmaak';

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
  it('gebruikt een komma en meer decimalen bij kleine getallen', () => {
    expect(formatGetal(65.74)).toBe('65,7');
    expect(formatGetal(0.456)).toBe('0,46');
    expect(formatGetal(0.0042)).toBe('0,004');
    expect(formatGetal(0)).toBe('0');
  });
});

describe('formatBandbreedte', () => {
  it('toont van ... tot ...', () => {
    expect(formatBandbreedte({ laag: 1.2, hoog: 18.5 }, 'kWh')).toBe('van 1,2 tot 18,5 kWh');
  });
});
