// verplaatsBestand(): zet één bestand van OneDrive in een SharePoint-map. Naast opruimen.ts de enige plek die schrijft.
//
// Graph kan een bestand niet in één keer naar een andere drive verplaatsen. Daarom in stappen:
//   1. controleren dat de naam in de doelmap nog vrij is
//   2. kopiëren naar de doelmap (Graph doet dat op de achtergrond)
//   3. wachten tot de kopie in de doelmap staat
//   4. pas dan het origineel verwijderen (het gaat naar de prullenbak van OneDrive)
import { graphDelete, graphGet, graphPost, GraphFout, wacht, type GraphOpties } from './client';

const WACHTTIJD_KOPIE_MS = 3000; // zo vaak kijken we of de kopie al klaar is
const MAX_KEER_KIJKEN = 40; // 40 x 3 seconden = 2 minuten

export interface VerplaatsOpdracht {
  vanDriveId: string;
  bestandId: string;
  naam: string;
  naarDriveId: string;
  naarMapId: string;
}

export function kopieerPad(vanDriveId: string, bestandId: string): string {
  return `/drives/${encodeURIComponent(vanDriveId)}/items/${encodeURIComponent(bestandId)}/copy?@microsoft.graph.conflictBehavior=fail`;
}

// Een item in een map opzoeken op naam ("path-based addressing": /items/{map-id}:/{naam}).
export function zoekOpNaamPad(driveId: string, mapId: string, naam: string): string {
  return `/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(mapId)}:/${encodeURIComponent(naam)}?$select=id`;
}

// Staat er in de map al iets met deze naam? 404 betekent: nee.
async function bestaatInMap(driveId: string, mapId: string, naam: string, opties: GraphOpties): Promise<boolean> {
  try {
    await graphGet(zoekOpNaamPad(driveId, mapId, naam), opties);
    return true;
  } catch (fout) {
    if (fout instanceof GraphFout && fout.status === 404) {
      return false;
    }
    throw fout;
  }
}

// Kijkt om de paar seconden of de kopie al in de doelmap staat.
// We gebruiken bewust niet de "monitor-URL" die Graph teruggeeft: die staat op een server van SharePoint,
// niet op graph.microsoft.com (harde regel 4). Zie docs/verplaatsen-naar-sharepoint.md.
async function wachtOpKopie(opdracht: VerplaatsOpdracht, opties: GraphOpties): Promise<void> {
  const wachtEven = opties.wachtFunctie ?? wacht;

  for (let keer = 1; keer <= MAX_KEER_KIJKEN; keer++) {
    await wachtEven(WACHTTIJD_KOPIE_MS, opties.signal);
    if (await bestaatInMap(opdracht.naarDriveId, opdracht.naarMapId, opdracht.naam, opties)) {
      return;
    }
  }
  // De kopie is na 2 minuten nog niet te zien. Het origineel laten we dan staan.
  throw new GraphFout(408, 'kopieDuurtTeLang');
}

export async function verplaatsBestand(opdracht: VerplaatsOpdracht, opties: GraphOpties): Promise<void> {
  // 1. Bestaat de naam al, dan zou stap 3 het verkeerde bestand "vinden". Daarom stoppen we meteen.
  if (await bestaatInMap(opdracht.naarDriveId, opdracht.naarMapId, opdracht.naam, opties)) {
    throw new GraphFout(409, 'nameAlreadyExists');
  }

  // 2. Kopiëren. Graph antwoordt meteen met 202 ("aangenomen") en kopieert daarna op de achtergrond.
  await graphPost(
    kopieerPad(opdracht.vanDriveId, opdracht.bestandId),
    { parentReference: { driveId: opdracht.naarDriveId, id: opdracht.naarMapId }, name: opdracht.naam },
    opties,
  );

  // 3. Wachten tot de kopie er staat.
  await wachtOpKopie(opdracht, opties);

  // 4. Het origineel naar de prullenbak. Lukt dat niet, dan staat het bestand nu op twee plekken.
  try {
    await graphDelete(`/drives/${encodeURIComponent(opdracht.vanDriveId)}/items/${encodeURIComponent(opdracht.bestandId)}`, opties);
  } catch (fout) {
    const status = fout instanceof GraphFout ? fout.status : 0;
    throw new GraphFout(status, 'origineelNietVerwijderd');
  }
}
