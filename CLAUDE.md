# KlimaatImpactTool – versie 1

Webapp die de eigen OneDrive van een medewerker scant, de klimaatimpact van de opslag berekent (kWh en CO2 per jaar, als bandbreedte) en helpt met opruimen. Draait los in de browser en later als personal tab in Microsoft Teams. Studententeam HvA, opdrachtgever Gemeente Amsterdam.

Volledige onderbouwing: "Techstack-advies KlimaatImpactTool v1" en "Architectuur KlimaatImpactTool v1" (Claude Docs van het team). Dit bestand is de samenvatting waar je je aan houdt.

## Harde regels

1. **Geen backend en geen database.** Alleen statische bestanden. Alle berekeningen gebeuren in de browser.
2. **Alleen metadata.** Lees nooit de inhoud van bestanden en geen deelgegevens. Alleen de velden in de `$select` hieronder.
3. **Niets opslaan.** Geen `localStorage`, IndexedDB of cookies voor scanresultaten. Het scanresultaat leeft alleen in React-state (`ScanContext`). De MSAL-cache staat op `sessionStorage`.
4. **Geen andere servers.** Geen analytics, geen CDN-scripts, geen fonts van buitenaf. Alleen `login.microsoftonline.com` (en de Microsoft-loginpagina's) en `graph.microsoft.com`.
5. **Laagindeling.** Alleen `src/graph/` praat met Microsoft Graph. Alleen `src/auth/` gebruikt MSAL.js en TeamsJS. `src/model/` bevat alleen pure functies (geen React, geen netwerk). Schermen roepen nooit zelf `fetch` aan.
6. **Geen geheimen in de repo.** Een SPA heeft alleen een client-id (niet geheim). Zet die in `.env` (staat in `.gitignore`), met `.env.example` als voorbeeld.
7. **Teksten in de tool zeggen nooit dat een bestand "weg mag".** Bij oude bestanden verwijzen we naar de bewaarregels van de organisatie (Archiefwet, selectielijsten).

## Techstack

| Onderdeel | Package | Versie |
| --- | --- | --- |
| Taal | TypeScript | uit het Vite-template |
| Framework | `react`, `react-dom` | 19 |
| Build | `vite` (template `react-ts`) | 8 |
| Routing | `react-router` met hash-routes | laatste |
| Inloggen | `@azure/msal-browser`, `@azure/msal-react` | 5 |
| Teams | `@microsoft/teams-js` | 2 |
| UI | `@fluentui/react-components` (Fluent UI v9) | 9 |
| Grafieken | `recharts` | 3 |
| Testen | `vitest` | laatste |
| Hosting | Azure Static Web Apps (Free), deploy via GitLab CI | |

Graph roepen we aan met gewone `fetch` en het MSAL-token. Geen Graph SDK.

**MSAL v5 let op:** veel voorbeelden online zijn voor v2 tot v4. In v5 bestaan `supportsNestedAppAuth` en `PublicClientNext` niet meer. Gebruik `createStandardPublicClientApplication` (browser) en `createNestablePublicClientApplication` (Teams, NAA). Volg alleen de officiële v5-documentatie.

## Mappenstructuur

```text
klimaatimpacttool/
├── .gitlab-ci.yml               # deploy naar Static Web Apps; token als CI/CD-variabele DEPLOYMENT_TOKEN
├── appPackage/                  # Teams-app, pas later nodig
│   ├── manifest.json            # personal tab, contentUrl, validDomains
│   ├── color.png                # 192 x 192
│   └── outline.png              # 32 x 32
├── docs/
│   ├── architectuur.md
│   ├── rekenmodel.md
│   ├── leerlog.md               # per fase: wat er gebouwd is en hoe het werkt
│   └── ontwerp/                 # de 10 schermen als PNG, geëxporteerd uit Figma
├── public/
│   └── staticwebapp.config.json # CSP, frame-ancestors voor Teams, fallback naar index.html
├── src/
│   ├── main.tsx                 # Teams of browser herkennen, MSAL starten, App tonen
│   ├── App.tsx                  # FluentProvider, MsalProvider, ScanProvider, router
│   ├── routes.tsx               # hash-routes, één route per scherm
│   ├── config/env.ts            # client-id, redirect, scopes uit import.meta.env
│   ├── auth/
│   │   ├── msal.ts              # standaard of nestable PublicClientApplication
│   │   ├── teams.ts             # isInTeams(), app.initialize(), thema van Teams
│   │   └── useToken.ts          # eerst stil token, anders popup
│   ├── graph/
│   │   ├── client.ts            # fetch met token, 429 + Retry-After, @odata.nextLink
│   │   ├── drive.ts             # getQuota()
│   │   ├── scan.ts              # scanDrive() met delta en voortgang
│   │   ├── opruimen.ts          # deleteItem(): enige plek met schrijfrecht (zie open beslissing)
│   │   └── types.ts             # DriveItem, Quota
│   ├── model/
│   │   ├── types.ts             # Bestand, Impact, Analyse, Groep, Bandbreedte, ...
│   │   ├── config.ts            # factoren rekenmodel met bron en jaar
│   │   ├── rekenmodel.ts        # bytes -> kWh -> kg CO2, met laag en hoog
│   │   ├── analyse.ts           # groeperen per leeftijd, soort, map; grootste bestanden
│   │   ├── naarBestand.ts       # DriveItem -> Bestand
│   │   └── rekenmodel.test.ts
│   ├── state/ScanContext.tsx    # ScanResultaat en Opruimselectie, alleen in geheugen
│   ├── demo/voorbeeldData.ts    # verzonnen DriveItems om zonder inloggen te bouwen en te demonstreren
│   ├── pages/                   # één map per scherm, namen zoals in Figma
│   │   ├── Welkom/              # 1
│   │   ├── Privacy/             # 2 privacy en toestemming
│   │   ├── Scannen/             # 3 voortgang en foutmeldingen
│   │   ├── Dashboard/           # 4
│   │   ├── ZoRekenenWe/         # 5
│   │   ├── GrootsteBestanden/   # 6 grootste bestanden en soorten
│   │   ├── PerMap/              # 7 bestanden per map
│   │   ├── Opruimen/            # 8 oude bestanden, met BevestigDialoog.tsx (9, Fluent Dialog)
│   │   └── Resultaat/           # 10 resultaat en tips
│   ├── components/
│   │   ├── Kopbalk.tsx
│   │   ├── ImpactKaart.tsx
│   │   ├── LeeftijdKaart.tsx
│   │   ├── BestandenTabel.tsx
│   │   └── charts/SoortenGrafiek.tsx
│   └── styles/theme.ts          # Fluent-thema: licht, donker, Teams
├── .env.example                 # VITE_CLIENT_ID=
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts               # ook Vitest-instellingen
├── eslint.config.js
└── README.md
```

Elke schermmap heeft een component met dezelfde naam (`pages/Dashboard/Dashboard.tsx`). Een onderdeel dat op twee schermen gebruikt wordt, verhuist naar `components/`.

Naamgeving: technische mappen in het Engels, domeinbegrippen en schermen in het Nederlands, zoals hierboven en in het datamodel.

## Datamodel

```ts
// graph/types.ts — alleen de velden die we met $select ophalen
export interface DriveItem {
  id: string;
  name: string;
  size?: number;                       // bytes
  lastModifiedDateTime: string;
  fileSystemInfo?: { createdDateTime?: string; lastModifiedDateTime?: string };
  parentReference?: { path?: string };
  file?: { mimeType?: string };
  folder?: { childCount?: number };
  webUrl?: string;
  deleted?: { state?: string };         // delta kan verwijderde items teruggeven: overslaan
}

export interface Quota {
  used: number;                         // bytes
  deleted: number;                      // bytes in de prullenbak
  total: number;
}

// model/types.ts
export interface Bandbreedte { laag: number; hoog: number }

export type Bestandssoort = 'word' | 'excel' | 'powerpoint' | 'pdf' | 'afbeelding' | 'video' | 'overig';

export interface Bestand {
  id: string;
  naam: string;
  grootte: number;                      // bytes
  gewijzigdOp: Date;                    // fileSystemInfo.lastModifiedDateTime, anders lastModifiedDateTime
  map: string;
  soort: Bestandssoort;
  webUrl?: string;
}

export interface ScanResultaat {
  status: 'bezig' | 'klaar' | 'fout';
  quota?: Quota;
  bestanden: Bestand[];
  gelezen: number;                      // voortgang
  fout?: string;
}

export interface RekenConfig {
  wattPerTB: Bandbreedte;
  kopieen: number;
  pue: number;
  urenPerJaar: number;
  kgCo2PerKwh: Bandbreedte;
  bron: Record<string, string>;         // bron en jaar per factor
}

export interface Impact {
  bytes: number;
  kwhPerJaar: Bandbreedte;
  kgCo2PerJaar: Bandbreedte;
}

export interface Groep { naam: string; aantal: number; impact: Impact }

export interface Analyse {
  totaal: Impact;
  prullenbak: Impact;
  perLeeftijd: Groep[];                 // < 6 maanden, 6 tot 12 maanden, > 12 maanden
  perSoort: Groep[];
  perMap: Groep[];
  grootste: Bestand[];
}

export interface Opruimselectie {
  gekozen: string[];                    // Bestand-id's
  verwijderd: Bestand[];                // vervalt als we alleen lezen (zie open beslissing)
  besparing: Impact;
}
```

## Rekenmodel

```
kWh per jaar = (bytes / 10^12) × wattPerTB × kopieen × pue × urenPerJaar / 1000
kg CO2 per jaar = kWh per jaar × kgCo2PerKwh
```

Bereken `laag` met de lage waarden en `hoog` met de hoge waarden. Gebruik decimale eenheden (1 TB = 10^12 bytes), zoals het bronrapport.

Voorlopige waarden voor `model/config.ts` (het team stelt de definitieve vast, zie het rekenmodel-document):

| Factor | Laag | Hoog | Bron |
| --- | --- | --- | --- |
| wattPerTB | 0,65 | 10 | Cloud Carbon Footprint (6,5 W per 10 TB); Gröger 2020 |
| kopieen | 2 | 2 | Gröger 2020 |
| pue | 1,185 | 1,185 | Cloud Carbon Footprint, waarde voor Microsoft |
| urenPerJaar | 8760 | 8760 | hele jaar |
| kgCo2PerKwh | 0,20 | 0,328 | CBS 2025 (over 2024); co2emissiefactoren.nl 2024 |

Controletest (`rekenmodel.test.ts`): met de oude HvA-factoren (10 W, 2 kopieën, PUE 1,5, 0,468 kg/kWh) geeft 250 GB ongeveer 65,7 kWh en 30,7 kg CO2 per jaar (Gröger 2020, par. 6.7).

## Microsoft Graph

| Doel | Aanroep | Scope |
| --- | --- | --- |
| Opslag en prullenbak | `GET /me/drive?$select=quota` | `Files.Read` |
| Alle bestanden, ook in submappen | `GET /me/drive/root/delta?$select=id,name,size,file,folder,parentReference,lastModifiedDateTime,fileSystemInfo,webUrl,deleted` | `Files.Read` |
| Verwijderen (alleen na bevestigen) | `DELETE /me/drive/items/{id}` → 204, gaat naar de prullenbak | `Files.ReadWrite` |

- Volg `@odata.nextLink` tot die er niet meer is. Toon voortgang na elke pagina.
- Bij status 429 of 503: wacht het aantal seconden uit `Retry-After` en probeer opnieuw.
- Mappen worden geen `Bestand`; tel alleen items met `file`.
- Scopes bij inloggen: `User.Read`, `Files.Read`. Nooit `Files.Read.All` of `Sites.*`.

## Inloggen

- App-registratie: single-page application, "accounts in elke organisatie en persoonlijke Microsoft-accounts". Authority: `https://login.microsoftonline.com/common`.
- Redirect-URI's: `http://localhost:5173` (dev), de Static Web Apps-URL, en voor Teams `brk-multihub://<ons-domein>` (alleen het domein, zonder pad).
- In de browser: `createStandardPublicClientApplication`, popup-login.
- In Teams: eerst `app.initialize()` van TeamsJS, daarna `createNestablePublicClientApplication`.
- `isInTeams()` mag de app buiten Teams niet laten hangen: gebruik een korte timeout.

## Open beslissing: verwijderen vanuit de tool

Nog niet besloten of versie 1 zelf bestanden verwijdert (vraagt `Files.ReadWrite`) of alleen een link "Openen in OneDrive" toont (alleen `Files.Read`). Tot die keuze: maak `graph/opruimen.ts` aan als stub met een TODO en vraag `Files.ReadWrite` nergens aan.

## Scripts

- `npm run dev`: lokale server op http://localhost:5173
- `npm run build`: productie-build in `dist/`
- `npm test`: Vitest
- `npm run lint`: ESLint

## Werkwijze

- Business engineers werken vooral in `pages/` en `components/`. Wijzigingen in `auth/`, `graph/` of `model/` gaan via een merge request met review.
- UI-teksten in het Nederlands, in gewone taal.
- Schermontwerpen staan als afbeeldingen in `docs/ontwerp/` (export uit Figma). Volg die zo goed mogelijk met Fluent UI-componenten.

## Leerafspraken (het team wil van de code leren)

1. Begin elke opdracht met een kort plan: welke bestanden je maakt of wijzigt en in welke volgorde. Wacht op akkoord voordat je begint.
2. Schrijf code die een beginner kan volgen: duidelijke namen, kleine functies, en een korte commentaarregel waar iets niet vanzelf spreekt. Geen slimme trucs.
3. Controleer na afloop dat `npm run build`, `npm test` en `npm run lint` werken.
4. Vul daarna `docs/leerlog.md` aan met een nieuw kopje per fase: wat je hebt gebouwd, welke bestanden, hoe de onderdelen samenwerken, en de drie belangrijkste dingen om zelf te begrijpen. In gewone taal.
5. Sluit af met één kleine oefening die het team zelf kan doen om het te snappen (bijvoorbeeld: verander X en kijk wat er gebeurt). Geef de oplossing niet meteen.
6. Stel een commitbericht voor, maar commit pas als daarom gevraagd wordt.
