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
import { berekenBesparing, kiesOudeBestanden } from '../model/opruimen';
import type { Bestand, Opruimselectie, ScanResultaat } from '../model/types';
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

  // Id's van de bestanden die de medewerker op het Opruimen-scherm heeft aangevinkt.
  const [gekozen, setGekozen] = useState<string[]>([]);

  // De analyse wordt alleen opnieuw berekend als het scanresultaat verandert.
  const analyse = useMemo(() => {
    if (scan?.status !== 'klaar') {
      return null;
    }
    return maakAnalyse(scan.bestanden, scan.quota, rekenConfig, scanMoment);
  }, [scan, scanMoment]);

  const oudeBestanden = useMemo(() => {
    if (scan?.status !== 'klaar') {
      return [];
    }
    return kiesOudeBestanden(scan.bestanden, scanMoment);
  }, [scan, scanMoment]);

  // Alleen lezen (open beslissing in CLAUDE.md): de tool verwijdert niets, dus "verwijderd" blijft leeg.
  const selectie: Opruimselectie = useMemo(
    () => ({ gekozen, verwijderd: [], besparing: berekenBesparing(oudeBestanden, gekozen, rekenConfig) }),
    [gekozen, oudeBestanden],
  );

  // Stopt een lopende scan zonder melding. Die scan is daarna niet meer "actueel" en verandert niets meer.
  // Ook de keuze van de vorige scan vervalt.
  function stopVorigeScan() {
    annuleerder.current?.abort();
    annuleerder.current = null;
    setGekozen([]);
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
    oudeBestanden,
    selectie,
    kiesBestanden: setGekozen,
    laadVoorbeelddata,
    startScan: () => void startScan(),
    annuleerScan,
    wisScan,
  };

  return <ScanContext value={waarde}>{children}</ScanContext>;
}
