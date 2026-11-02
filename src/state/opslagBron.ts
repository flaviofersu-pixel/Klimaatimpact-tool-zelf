// Een "bron" voor het Verplaatsen-scherm: waar de mappen vandaan komen en hoe een bestand verplaatst wordt.
// Er zijn twee versies met dezelfde functies: de echte (Microsoft Graph) en de voorbeeldversie (demo/voorbeeldOpslag.ts).
// Het scherm weet niet welke het gebruikt. Zo kun je de feature bouwen en tonen zonder SharePoint.
import type { HaalToken } from '../auth/useToken';
import { haalMapInhoud, haalOneDriveHoofdmap, haalTeamHoofdmap } from '../graph/mappen';
import { haalTeams } from '../graph/teams';
import { verplaatsBestand } from '../graph/verplaatsen';
import { naarMapItems, naarOpslagplek } from '../model/mappen';
import type { MapItem, Opslagplek, Team } from '../model/types';

export interface OpslagBron {
  haalOneDrive: () => Promise<Opslagplek>;
  haalTeams: () => Promise<Team[]>;
  haalTeamOpslag: (team: Team) => Promise<Opslagplek>;
  haalMapInhoud: (plek: Opslagplek, mapId: string) => Promise<MapItem[]>;
  verplaatsBestand: (bestand: MapItem, van: Opslagplek, naar: Opslagplek, naarMapId: string) => Promise<void>;
}

export function maakGraphBron(haalToken: HaalToken): OpslagBron {
  const opties = { haalToken };

  return {
    haalOneDrive: async () => {
      const hoofdmap = await haalOneDriveHoofdmap(opties);
      return naarOpslagplek(hoofdmap, 'onedrive', 'Mijn OneDrive');
    },

    haalTeams: async () => {
      const teams = await haalTeams(opties);
      return teams.map((team) => ({ id: team.id, naam: team.displayName }));
    },

    haalTeamOpslag: async (team) => {
      const hoofdmap = await haalTeamHoofdmap(team.id, opties);
      return naarOpslagplek(hoofdmap, 'sharepoint', team.naam);
    },

    haalMapInhoud: async (plek, mapId) => {
      const items = await haalMapInhoud(plek.driveId, mapId, opties);
      return naarMapItems(items);
    },

    verplaatsBestand: async (bestand, van, naar, naarMapId) => {
      await verplaatsBestand(
        { vanDriveId: van.driveId, bestandId: bestand.id, naam: bestand.naam, naarDriveId: naar.driveId, naarMapId },
        opties,
      );
    },
  };
}
