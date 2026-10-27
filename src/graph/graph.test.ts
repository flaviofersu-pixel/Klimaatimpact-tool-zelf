// Tests voor de Graph-laag met een nep-fetch: geen echt netwerk en geen echt wachten.
import { describe, expect, it, vi } from 'vitest';
import { bepaalWachttijd, graphGet, GraphFout, type GraphOpties } from './client';
import { getQuota } from './drive';
import { vertaalScanFout } from './foutmelding';
import { DELTA_PAD, scanDrive } from './scan';
import type { DriveItem } from './types';

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

// Maakt opties met een nep-fetch die de antwoorden één voor één teruggeeft.
function maakOpties(...antwoorden: Response[]) {
  const fetchFunctie = vi.fn<typeof fetch>();
  for (const antwoord of antwoorden) {
    fetchFunctie.mockResolvedValueOnce(antwoord);
  }
  const wachtFunctie = vi.fn(async () => {});
  const opties: GraphOpties = { haalToken: async () => 'nep-token', fetchFunctie, wachtFunctie };
  return { opties, fetchFunctie, wachtFunctie };
}

function item(id: string, extra: Partial<DriveItem> = {}): DriveItem {
  return { id, name: `${id}.txt`, size: 10, lastModifiedDateTime: '2026-01-01T00:00:00Z', file: {}, ...extra };
}

describe('graphGet', () => {
  it('stuurt het token mee en geeft de JSON terug', async () => {
    const { opties, fetchFunctie } = maakOpties(json({ hallo: 'wereld' }));

    await expect(graphGet('/me', opties)).resolves.toEqual({ hallo: 'wereld' });
    const [url, init] = fetchFunctie.mock.calls[0];
    expect(url).toBe('https://graph.microsoft.com/v1.0/me');
    expect(init?.headers).toEqual({ Authorization: 'Bearer nep-token' });
  });

  it('wacht bij 429 het aantal seconden uit Retry-After en probeert opnieuw', async () => {
    const { opties, fetchFunctie, wachtFunctie } = maakOpties(
      json({}, 429, { 'Retry-After': '7' }),
      json({ ok: true }),
    );

    await expect(graphGet('/me', opties)).resolves.toEqual({ ok: true });
    expect(fetchFunctie).toHaveBeenCalledTimes(2);
    expect(wachtFunctie).toHaveBeenCalledWith(7000, undefined);
  });

  it('wacht 10 seconden bij 503 zonder Retry-After', async () => {
    const { opties, wachtFunctie } = maakOpties(json({}, 503), json({ ok: true }));

    await graphGet('/me', opties);
    expect(wachtFunctie).toHaveBeenCalledWith(10000, undefined);
  });

  it('geeft het op na 5 pogingen', async () => {
    const { opties, fetchFunctie } = maakOpties(...Array.from({ length: 5 }, () => json({}, 429)));

    await expect(graphGet('/me', opties)).rejects.toMatchObject({ status: 429 });
    expect(fetchFunctie).toHaveBeenCalledTimes(5);
  });

  it('geeft andere fouten door met status en foutcode', async () => {
    const { opties } = maakOpties(json({ error: { code: 'itemNotFound' } }, 404));

    await expect(graphGet('/me/drive', opties)).rejects.toEqual(new GraphFout(404, 'itemNotFound'));
  });

  it('maakt van een netwerkfout status 0', async () => {
    const fetchFunctie = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(graphGet('/me', { haalToken: async () => 't', fetchFunctie })).rejects.toMatchObject({ status: 0 });
  });

  it('weigert URL buiten graph.microsoft.com', async () => {
    const { opties, fetchFunctie } = maakOpties();

    await expect(graphGet('https://example.com/stiekem', opties)).rejects.toThrow('graph.microsoft.com');
    expect(fetchFunctie).not.toHaveBeenCalled();
  });
});

describe('bepaalWachttijd', () => {
  it('leest seconden en datums, met een maximum', () => {
    const nu = Date.parse('2026-01-01T12:00:00Z');
    expect(bepaalWachttijd('3', nu)).toBe(3000);
    expect(bepaalWachttijd(null, nu)).toBe(10000);
    expect(bepaalWachttijd('Thu, 01 Jan 2026 12:00:20 GMT', nu)).toBe(20000);
    expect(bepaalWachttijd('9999', nu)).toBe(120000);
  });
});

describe('getQuota', () => {
  it('haalt used, deleted en total op', async () => {
    const { opties, fetchFunctie } = maakOpties(json({ quota: { used: 500, deleted: 20, total: 1000, state: 'normal' } }));

    await expect(getQuota(opties)).resolves.toEqual({ used: 500, deleted: 20, total: 1000 });
    expect(fetchFunctie.mock.calls[0][0]).toBe('https://graph.microsoft.com/v1.0/me/drive?$select=quota');
  });
});

describe('scanDrive', () => {
  it('volgt @odata.nextLink tot de laatste pagina en roept de callback per pagina aan', async () => {
    const volgende = 'https://graph.microsoft.com/v1.0/me/drive/root/delta?token=abc';
    const { opties, fetchFunctie } = maakOpties(
      json({ value: [item('a'), item('b')], '@odata.nextLink': volgende }),
      json({ value: [item('c')], '@odata.deltaLink': 'https://graph.microsoft.com/v1.0/klaar' }),
    );
    const paginas: string[][] = [];

    await scanDrive({ ...opties, opElkePagina: (items) => paginas.push(items.map((i) => i.id)) });

    expect(paginas).toEqual([['a', 'b'], ['c']]);
    expect(fetchFunctie.mock.calls.map((aanroep) => aanroep[0])).toEqual([
      `https://graph.microsoft.com/v1.0${DELTA_PAD}`,
      volgende,
    ]);
  });

  it('vraagt alleen de toegestane velden op', () => {
    expect(DELTA_PAD).toBe(
      '/me/drive/root/delta?$select=id,name,size,file,folder,parentReference,lastModifiedDateTime,fileSystemInfo,webUrl,deleted',
    );
  });
});

describe('vertaalScanFout', () => {
  it('geeft begrijpelijke meldingen', () => {
    expect(vertaalScanFout(new DOMException('weg', 'AbortError'))).toContain('geannuleerd');
    expect(vertaalScanFout(new GraphFout(0, 'netwerk'))).toContain('verbinding');
    expect(vertaalScanFout(new GraphFout(403, 'accessDenied'))).toContain('toestemming');
    expect(vertaalScanFout(new GraphFout(404, 'itemNotFound'))).toContain('geen OneDrive');
    expect(vertaalScanFout(new GraphFout(500, 'x'))).toContain('code 500');
  });
});
