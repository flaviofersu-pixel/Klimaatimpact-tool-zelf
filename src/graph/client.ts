// fetch naar Microsoft Graph met het token. Wacht bij 429 en 503 op Retry-After en probeert opnieuw.

export const GRAPH_BASIS = 'https://graph.microsoft.com/v1.0';

const MAX_POGINGEN = 5;
const STANDAARD_WACHTTIJD_S = 10; // als Graph geen Retry-After meestuurt
const MAX_WACHTTIJD_S = 120;

// Een fout van Graph, met de HTTP-status en de foutcode uit het antwoord (bijvoorbeeld "itemNotFound").
// Status 0 betekent: geen antwoord, bijvoorbeeld omdat de verbinding weg is.
export class GraphFout extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string) {
    super(`Graph-fout ${status} ${code}`);
    this.name = 'GraphFout';
    this.status = status;
    this.code = code;
  }
}

export interface GraphOpties {
  haalToken: () => Promise<string>;
  signal?: AbortSignal; // om de scan te annuleren
  // Alleen voor tests: een nep-fetch en een wachtfunctie die niet echt wacht.
  fetchFunctie?: typeof fetch;
  wachtFunctie?: (ms: number, signal?: AbortSignal) => Promise<void>;
}

// Wacht een aantal milliseconden, maar stop meteen als er geannuleerd wordt.
export function wacht(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

// Retry-After is een aantal seconden ("30") of een datum. Geeft milliseconden terug.
export function bepaalWachttijd(retryAfter: string | null, nu: number = Date.now()): number {
  let seconden = STANDAARD_WACHTTIJD_S;
  if (retryAfter && /^\d+$/.test(retryAfter.trim())) {
    seconden = Number(retryAfter);
  } else if (retryAfter && !Number.isNaN(Date.parse(retryAfter))) {
    seconden = Math.max(0, (Date.parse(retryAfter) - nu) / 1000);
  }
  return Math.min(seconden, MAX_WACHTTIJD_S) * 1000;
}

// Maakt een volledige URL en controleert dat we alleen met Graph praten (harde regel 4).
function maakUrl(padOfUrl: string): string {
  const url = padOfUrl.startsWith('https://') ? padOfUrl : `${GRAPH_BASIS}${padOfUrl}`;
  if (new URL(url).hostname !== 'graph.microsoft.com') {
    throw new Error('De tool praat alleen met graph.microsoft.com.');
  }
  return url;
}

// Haalt de foutcode uit een foutantwoord van Graph: { "error": { "code": "..." } }.
async function leesFoutcode(antwoord: Response): Promise<string> {
  try {
    const body = (await antwoord.json()) as { error?: { code?: string } };
    return body.error?.code ?? '';
  } catch {
    return '';
  }
}

function isAnnulering(fout: unknown): boolean {
  return fout instanceof DOMException && fout.name === 'AbortError';
}

// Doet een GET-verzoek naar Graph en geeft de JSON terug.
export async function graphGet<T>(padOfUrl: string, opties: GraphOpties): Promise<T> {
  const url = maakUrl(padOfUrl);
  const doeFetch = opties.fetchFunctie ?? fetch;
  const wachtEven = opties.wachtFunctie ?? wacht;

  for (let poging = 1; poging <= MAX_POGINGEN; poging++) {
    const token = await opties.haalToken();

    let antwoord: Response;
    try {
      antwoord = await doeFetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: opties.signal,
      });
    } catch (fout) {
      if (isAnnulering(fout)) {
        throw fout;
      }
      throw new GraphFout(0, 'netwerk'); // geen antwoord: verbinding weg
    }

    if (antwoord.ok) {
      return (await antwoord.json()) as T;
    }

    // Te druk (429) of even niet beschikbaar (503): wachten en opnieuw proberen.
    const isTeDruk = antwoord.status === 429 || antwoord.status === 503;
    if (isTeDruk && poging < MAX_POGINGEN) {
      await wachtEven(bepaalWachttijd(antwoord.headers.get('Retry-After')), opties.signal);
      continue;
    }

    throw new GraphFout(antwoord.status, await leesFoutcode(antwoord));
  }

  // Komt hier niet: de laatste poging geeft altijd een antwoord of een fout.
  throw new GraphFout(429, 'teVaakGeprobeerd');
}
