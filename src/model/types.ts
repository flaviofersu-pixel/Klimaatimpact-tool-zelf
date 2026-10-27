// De begrippen van de tool (Bestand, Impact, Analyse ...). Los van Microsoft Graph en van React.
import type { Quota } from '../graph/types';

export interface Bandbreedte {
  laag: number;
  hoog: number;
}

export type Bestandssoort = 'word' | 'excel' | 'powerpoint' | 'pdf' | 'afbeelding' | 'video' | 'overig';

export interface Bestand {
  id: string;
  naam: string;
  grootte: number; // bytes
  gewijzigdOp: Date; // fileSystemInfo.lastModifiedDateTime, anders lastModifiedDateTime
  map: string;
  soort: Bestandssoort;
  webUrl?: string;
}

export interface ScanResultaat {
  status: 'bezig' | 'klaar' | 'fout';
  quota?: Quota;
  bestanden: Bestand[];
  gelezen: number; // voortgang
  fout?: string;
}

export interface RekenConfig {
  wattPerTB: Bandbreedte;
  kopieen: number;
  pue: number;
  urenPerJaar: number;
  kgCo2PerKwh: Bandbreedte;
  bron: Record<string, string>; // bron en jaar per factor
}

export interface Impact {
  bytes: number;
  kwhPerJaar: Bandbreedte;
  kgCo2PerJaar: Bandbreedte;
}

export interface Groep {
  naam: string;
  aantal: number;
  impact: Impact;
}

export interface Analyse {
  totaal: Impact;
  prullenbak: Impact;
  perLeeftijd: Groep[]; // < 6 maanden, 6 tot 12 maanden, > 12 maanden
  perSoort: Groep[];
  perMap: Groep[];
  grootste: Bestand[];
}

export interface Opruimselectie {
  gekozen: string[]; // id's van de gekozen bestanden
  verwijderd: Bestand[]; // vervalt als we alleen lezen (zie open beslissing)
  besparing: Impact;
}
