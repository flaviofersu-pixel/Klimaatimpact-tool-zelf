// haalTeams(): de teams waar de medewerker lid van is. Hun SharePoint-sites zijn de mogelijke doelen.
import { graphGet, type GraphOpties } from './client';
import type { GraphTeam } from './types';

interface Pagina {
  value: GraphTeam[];
  '@odata.nextLink'?: string;
}

export const TEAMS_PAD = '/me/joinedTeams?$select=id,displayName';

export async function haalTeams(opties: GraphOpties): Promise<GraphTeam[]> {
  const teams: GraphTeam[] = [];
  let volgende: string | undefined = TEAMS_PAD;

  while (volgende) {
    const pagina: Pagina = await graphGet<Pagina>(volgende, opties);
    teams.push(...(pagina.value ?? []));
    volgende = pagina['@odata.nextLink'];
  }
  return teams;
}
