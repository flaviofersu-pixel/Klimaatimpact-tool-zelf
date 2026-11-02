// Tests voor de Graph-laag met een nep-fetch: geen echt netwerk en geen echt wachten.
import { describe, expect, it, vi } from 'vitest';
import { bepaalWachttijd, graphGet, GraphFout, type GraphOpties } from './client';
import { getQuota } from './drive';
import { vertaalScanFout, vertaalVerplaatsFout } from './foutmelding';
import { haalMapInhoud, inhoudPad } from './mappen';
import { DELTA_PAD, scanDrive } from './scan';
import { haalTeams, TEAMS_PAD } from './teams';
import { kopieerPad, verplaatsBestand, zoekOpNaamPad, type VerplaatsOpdracht } from './verplaatsen';
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

describe('haalMapInhoud', () => {
  it('haalt alle pagina\'s van één map op', async () => {
    const volgende = 'https://graph.microsoft.com/v1.0/drives/d1/items/m1/children?skiptoken=x';
    const { opties, fetchFunctie } = maakOpties(
      json({ value: [item('a')], '@odata.nextLink': volgende }),
      json({ value: [item('b')] }),
    );

    const items = await haalMapInhoud('d1', 'm1', opties);

    expect(items.map((i) => i.id)).toEqual(['a', 'b']);
    expect(fetchFunctie.mock.calls[0][0]).toBe(`https://graph.microsoft.com/v1.0${inhoudPad('d1', 'm1')}`);
  });

  it('vraagt alleen metadata op', () => {
    expect(inhoudPad('d1', 'm1')).toContain('$select=id,name,size,file,folder,');
  });
});

describe('haalTeams', () => {
  it('haalt de teams op met alleen id en naam', async () => {
    const { opties, fetchFunctie } = maakOpties(json({ value: [{ id: 't1', displayName: 'Team Klimaat' }] }));

    await expect(haalTeams(opties)).resolves.toEqual([{ id: 't1', displayName: 'Team Klimaat' }]);
    expect(fetchFunctie.mock.calls[0][0]).toBe(`https://graph.microsoft.com/v1.0${TEAMS_PAD}`);
  });
});

describe('verplaatsBestand', () => {
  const opdracht: VerplaatsOpdracht = {
    vanDriveId: 'mijn-drive',
    bestandId: 'b1',
    naam: 'Plan.docx',
    naarDriveId: 'team-drive',
    naarMapId: 'map-1',
  };
  const nietGevonden = () => json({ error: { code: 'itemNotFound' } }, 404);
  const gevonden = () => json({ id: 'kopie-1' });

  it('controleert de naam, kopieert, wacht op de kopie en verwijdert dan het origineel', async () => {
    const { opties, fetchFunctie } = maakOpties(
      nietGevonden(), // 1. naam is vrij
      new Response(null, { status: 202 }), // 2. kopie aangenomen
      nietGevonden(), // 3. kopie nog niet klaar
      gevonden(), //    kopie klaar
      new Response(null, { status: 204 }), // 4. origineel naar de prullenbak
    );

    await verplaatsBestand(opdracht, opties);

    const aanroepen = fetchFunctie.mock.calls.map(([url, init]) => `${init?.method ?? 'GET'} ${url}`);
    const basis = 'https://graph.microsoft.com/v1.0';
    expect(aanroepen).toEqual([
      `GET ${basis}${zoekOpNaamPad('team-drive', 'map-1', 'Plan.docx')}`,
      `POST ${basis}${kopieerPad('mijn-drive', 'b1')}`,
      `GET ${basis}${zoekOpNaamPad('team-drive', 'map-1', 'Plan.docx')}`,
      `GET ${basis}${zoekOpNaamPad('team-drive', 'map-1', 'Plan.docx')}`,
      `DELETE ${basis}/drives/mijn-drive/items/b1`,
    ]);
    expect(JSON.parse(fetchFunctie.mock.calls[1][1]?.body as string)).toEqual({
      parentReference: { driveId: 'team-drive', id: 'map-1' },
      name: 'Plan.docx',
    });
  });

  it('stopt meteen als de naam in de doelmap al bestaat', async () => {
    const { opties, fetchFunctie } = maakOpties(gevonden());

    await expect(verplaatsBestand(opdracht, opties)).rejects.toMatchObject({ status: 409, code: 'nameAlreadyExists' });
    expect(fetchFunctie).toHaveBeenCalledTimes(1); // er is niets gekopieerd of verwijderd
  });

  it('laat het origineel staan als de kopie te lang duurt', async () => {
    const { opties, fetchFunctie } = maakOpties(
      nietGevonden(),
      new Response(null, { status: 202 }),
      ...Array.from({ length: 40 }, nietGevonden),
    );

    await expect(verplaatsBestand(opdracht, opties)).rejects.toMatchObject({ code: 'kopieDuurtTeLang' });
    const methodes = fetchFunctie.mock.calls.map(([, init]) => init?.method ?? 'GET');
    expect(methodes).not.toContain('DELETE');
  });

  it('meldt het als het origineel niet weg kon', async () => {
    const { opties } = maakOpties(
      nietGevonden(),
      new Response(null, { status: 202 }),
      gevonden(),
      json({ error: { code: 'resourceLocked' } }, 423),
    );

    await expect(verplaatsBestand(opdracht, opties)).rejects.toMatchObject({ status: 423, code: 'origineelNietVerwijderd' });
  });
});

describe('vertaalVerplaatsFout', () => {
  it('zegt waar het bestand nu staat', () => {
    expect(vertaalVerplaatsFout(new GraphFout(409, 'nameAlreadyExists'))).toContain('al een bestand met deze naam');
    expect(vertaalVerplaatsFout(new GraphFout(423, 'origineelNietVerwijderd'))).toContain('twee plekken');
    expect(vertaalVerplaatsFout(new GraphFout(408, 'kopieDuurtTeLang'))).toContain('staat nog in je OneDrive');
    expect(vertaalVerplaatsFout(new GraphFout(403, 'accessDenied'))).toContain('geen bestanden zetten');
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
