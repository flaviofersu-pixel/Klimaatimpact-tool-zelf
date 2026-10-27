// De context zelf: welke gegevens en functies elk scherm via useScan() kan gebruiken.
import { createContext } from 'react';
import type { Analyse, Bestand, Opruimselectie, ScanResultaat } from '../model/types';

export interface ScanContextWaarde {
  scan: ScanResultaat | null; // null: er is nog niet gescand
  analyse: Analyse | null; // null zolang de scan niet klaar is
  isVoorbeeld: boolean; // true als we verzonnen voorbeelddata tonen
  oudeBestanden: Bestand[]; // langer dan een half jaar niet gewijzigd
  selectie: Opruimselectie; // welke oude bestanden de medewerker heeft gekozen
  kiesBestanden: (ids: string[]) => void;
  laadVoorbeelddata: () => void;
  startScan: () => void; // scant de echte OneDrive van de ingelogde gebruiker
  annuleerScan: () => void;
  wisScan: () => void;
}

export const ScanContext = createContext<ScanContextWaarde | null>(null);
