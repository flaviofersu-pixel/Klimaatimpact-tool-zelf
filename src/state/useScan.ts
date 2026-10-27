// Hook voor schermen: geeft het scanresultaat, de analyse en de functies uit ScanContext.
import { use } from 'react';
import { ScanContext } from './scanContextWaarde';

export function useScan() {
  const waarde = use(ScanContext);
  if (!waarde) {
    throw new Error('useScan() werkt alleen binnen <ScanProvider>.');
  }
  return waarde;
}
