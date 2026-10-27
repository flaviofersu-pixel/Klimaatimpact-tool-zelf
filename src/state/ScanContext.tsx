// Houdt het scanresultaat vast, alleen in React-state (dus in het geheugen). Niets gaat naar storage.
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { vertaalAuthFout } from '../auth/foutmelding';
import { useToken } from '../auth/useToken';
import { maakVoorbeeldItems, maakVoorbeeldQuota } from '../demo/voorbeeldData';
import { getQuota } from '../graph/drive';
import { vertaalScanFout } from '../graph/foutmelding';
import { scanDrive } from '../graph/scan';
import { maakAnalyse } from '../model/analyse';
import { rekenConfig } from '../model/config';
import { naarBestanden } from '../model/naarBestand';
import type { Bestand, ScanResultaat } from '../model/types';
import { ScanContext, type ScanContextWaarde } from './scanContextWaarde';

// Fouten van MSAL hebben een errorCode; die vertalen we als inlogfout, de rest als scanfout.
function vertaalFout(fout: unknown): string {
  if (typeof fout === 'object' && fout !== null && 'errorCode' in fout) {
    return vertaalAuthFout(fout);
  }
  return vertaalScanFout(fout);
}

export function ScanProvider({ children }: { children: ReactNode }) {
  const haalToken = useToken();
  const [scan, setScan] = useState<ScanResultaat | null>(null);
  const [isVoorbeeld, setIsVoorbeeld] = useState(false);
  // Het moment van de scan. De analyse rekent leeftijden vanaf dit moment.
  const [scanMoment, setScanMoment] = useState(() => new Date());
  // Hiermee kunnen we een lopende scan annuleren. Een ref, want het hoeft het scherm niet te verversen.
  const annuleerder = useRef<AbortController | null>(null);

  // De analyse wordt alleen opnieuw berekend als het scanresultaat verandert.
  const analyse = useMemo(() => {
    if (scan?.status !== 'klaar') {
      return null;
    }
    return maakAnalyse(scan.bestanden, scan.quota, rekenConfig, scanMoment);
  }, [scan, scanMoment]);

  // Stopt een lopende scan zonder melding. Die scan is daarna niet meer "actueel" en verandert niets meer.
  function stopVorigeScan() {
    annuleerder.current?.abort();
    annuleerder.current = null;
  }

  function laadVoorbeelddata() {
    stopVorigeScan();
    const nu = new Date();
    const items = maakVoorbeeldItems(nu);
    const bestanden = naarBestanden(items);
    setScanMoment(nu);
    setIsVoorbeeld(true);
    setScan({ status: 'klaar', quota: maakVoorbeeldQuota(items), bestanden, gelezen: bestanden.length });
  }

  async function startScan() {
    stopVorigeScan();
    const controller = new AbortController();
    annuleerder.current = controller;
    // Is dit nog de scan die loopt? Zo niet, dan negeren we wat hij nog terugmeldt.
    const isActueel = () => annuleerder.current === controller;

    setIsVoorbeeld(false);
    setScan({ status: 'bezig', bestanden: [], gelezen: 0 });

    const opties = { haalToken, signal: controller.signal };
    try {
      const quota = await getQuota(opties);
      if (isActueel()) {
        setScan((vorige) => (vorige ? { ...vorige, quota } : vorige));
      }

      const bestanden: Bestand[] = [];
      await scanDrive({
        ...opties,
        opElkePagina: (items) => {
          bestanden.push(...naarBestanden(items));
          if (isActueel()) {
            setScan((vorige) => (vorige ? { ...vorige, gelezen: bestanden.length } : vorige));
          }
        },
      });

      if (isActueel()) {
        setScanMoment(new Date());
        setScan({ status: 'klaar', quota, bestanden, gelezen: bestanden.length });
      }
    } catch (fout) {
      if (isActueel()) {
        setScan((vorige) => ({
          status: 'fout',
          quota: vorige?.quota,
          bestanden: [],
          gelezen: vorige?.gelezen ?? 0,
          fout: vertaalFout(fout),
        }));
      }
    }
  }

  // De knop Annuleren: de scan stopt en het Scannen-scherm meldt "De scan is geannuleerd".
  function annuleerScan() {
    annuleerder.current?.abort();
  }

  function wisScan() {
    stopVorigeScan();
    setScan(null);
    setIsVoorbeeld(false);
  }

  const waarde: ScanContextWaarde = {
    scan,
    analyse,
    isVoorbeeld,
    laadVoorbeelddata,
    startScan: () => void startScan(),
    annuleerScan,
    wisScan,
  };

  return <ScanContext value={waarde}>{children}</ScanContext>;
}
