// Houdt het scanresultaat vast, alleen in React-state (dus in het geheugen). Niets gaat naar storage.
import { useMemo, useState, type ReactNode } from 'react';
import { maakVoorbeeldItems, maakVoorbeeldQuota } from '../demo/voorbeeldData';
import { maakAnalyse } from '../model/analyse';
import { rekenConfig } from '../model/config';
import { naarBestanden } from '../model/naarBestand';
import type { ScanResultaat } from '../model/types';
import { ScanContext, type ScanContextWaarde } from './scanContextWaarde';

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scan, setScan] = useState<ScanResultaat | null>(null);
  const [isVoorbeeld, setIsVoorbeeld] = useState(false);
  // Het moment van de scan. De analyse rekent leeftijden vanaf dit moment.
  const [scanMoment, setScanMoment] = useState(() => new Date());

  // De analyse wordt alleen opnieuw berekend als het scanresultaat verandert.
  const analyse = useMemo(() => {
    if (scan?.status !== 'klaar') {
      return null;
    }
    return maakAnalyse(scan.bestanden, scan.quota, rekenConfig, scanMoment);
  }, [scan, scanMoment]);

  function laadVoorbeelddata() {
    const nu = new Date();
    const items = maakVoorbeeldItems(nu);
    const bestanden = naarBestanden(items);
    setScanMoment(nu);
    setIsVoorbeeld(true);
    setScan({ status: 'klaar', quota: maakVoorbeeldQuota(items), bestanden, gelezen: bestanden.length });
  }

  function wisScan() {
    setScan(null);
    setIsVoorbeeld(false);
  }

  const waarde: ScanContextWaarde = { scan, analyse, isVoorbeeld, laadVoorbeelddata, wisScan };

  return <ScanContext value={waarde}>{children}</ScanContext>;
}
