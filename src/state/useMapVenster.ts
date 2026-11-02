// Hook voor één tabel op het Verplaatsen-scherm: welke opslagplek, welke map is open, en wat erin staat.
import { useRef, useState } from 'react';
import { vertaalMapFout } from '../graph/foutmelding';
import type { MapItem, Opslagplek } from '../model/types';
import type { OpslagBron } from './opslagBron';

// Eén stap in het kruimelpad bovenaan de tabel: "Mijn OneDrive > Documenten > Oud".
export interface MapStap {
  id: string;
  naam: string;
}

export interface MapVenster {
  plek: Opslagplek | null; // null: nog niets gekozen
  pad: MapStap[]; // de laatste stap is de map die open is
  items: MapItem[];
  laden: boolean;
  fout?: string;
  openPlek: (plek: Opslagplek) => void;
  openMap: (map: MapItem) => void;
  gaNaarStap: (index: number) => void;
  herlaad: () => Promise<void>;
}

export function useMapVenster(bron: OpslagBron): MapVenster {
  const [plek, setPlek] = useState<Opslagplek | null>(null);
  const [pad, setPad] = useState<MapStap[]>([]);
  const [items, setItems] = useState<MapItem[]>([]);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | undefined>();
  // Klik je snel twee mappen na elkaar, dan kan het eerste antwoord als laatste binnenkomen.
  // Met dit volgnummer negeren we antwoorden van een oudere klik.
  const laatsteVerzoek = useRef(0);

  async function laad(nieuwePlek: Opslagplek, nieuwPad: MapStap[]) {
    const verzoek = ++laatsteVerzoek.current;
    setPlek(nieuwePlek);
    setPad(nieuwPad);
    setLaden(true);
    setFout(undefined);
    try {
      const mapId = nieuwPad[nieuwPad.length - 1].id;
      const nieuweItems = await bron.haalMapInhoud(nieuwePlek, mapId);
      if (verzoek === laatsteVerzoek.current) {
        setItems(nieuweItems);
      }
    } catch (fout) {
      if (verzoek === laatsteVerzoek.current) {
        setItems([]);
        setFout(vertaalMapFout(fout));
      }
    } finally {
      if (verzoek === laatsteVerzoek.current) {
        setLaden(false);
      }
    }
  }

  return {
    plek,
    pad,
    items,
    laden,
    fout,
    openPlek: (nieuwePlek) => void laad(nieuwePlek, [{ id: nieuwePlek.hoofdmapId, naam: nieuwePlek.naam }]),
    openMap: (map) => {
      if (plek) {
        void laad(plek, [...pad, { id: map.id, naam: map.naam }]);
      }
    },
    gaNaarStap: (index) => {
      if (plek) {
        void laad(plek, pad.slice(0, index + 1));
      }
    },
    herlaad: async () => {
      if (plek) {
        await laad(plek, pad);
      }
    },
  };
}
