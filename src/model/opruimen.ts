// Pure functies voor het Opruimen-scherm: oude bestanden kiezen, sorteren en de mogelijke besparing berekenen.
import { isOuderDan, totaleGrootte } from './analyse';
import { berekenImpact } from './rekenmodel';
import type { Bestand, Impact, RekenConfig } from './types';

export const OUD_VANAF_MAANDEN = 6;

export type SorteerKolom = 'naam' | 'map' | 'grootte' | 'gewijzigdOp';
export type SorteerRichting = 'oplopend' | 'aflopend';

// Bestanden die langer dan een half jaar niet zijn gewijzigd, grootste eerst.
export function kiesOudeBestanden(bestanden: Bestand[], nu: Date): Bestand[] {
  return sorteerBestanden(
    bestanden.filter((bestand) => isOuderDan(bestand, OUD_VANAF_MAANDEN, nu)),
    'grootte',
    'aflopend',
  );
}

// Vergelijkt twee bestanden op één kolom. Negatief: a eerst, positief: b eerst.
function vergelijk(a: Bestand, b: Bestand, kolom: SorteerKolom): number {
  if (kolom === 'grootte') {
    return a.grootte - b.grootte;
  }
  if (kolom === 'gewijzigdOp') {
    return a.gewijzigdOp.getTime() - b.gewijzigdOp.getTime();
  }
  // Tekst: op z'n Nederlands, zonder verschil tussen hoofd- en kleine letters, en "bestand 2" vóór "bestand 10".
  return a[kolom].localeCompare(b[kolom], 'nl', { sensitivity: 'base', numeric: true });
}

// Geeft een nieuwe, gesorteerde lijst terug. De originele lijst blijft zoals hij was.
export function sorteerBestanden(bestanden: Bestand[], kolom: SorteerKolom, richting: SorteerRichting): Bestand[] {
  const factor = richting === 'oplopend' ? 1 : -1;
  return [...bestanden].sort((a, b) => factor * vergelijk(a, b, kolom));
}

// Wat het scheelt als de gekozen bestanden niet meer in OneDrive (en niet meer in de prullenbak) staan.
export function berekenBesparing(bestanden: Bestand[], gekozen: string[], config: RekenConfig): Impact {
  const gekozenIds = new Set(gekozen);
  const gekozenBestanden = bestanden.filter((bestand) => gekozenIds.has(bestand.id));
  return berekenImpact(totaleGrootte(gekozenBestanden), config);
}
