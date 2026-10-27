# Leerlog KlimaatImpactTool

Per fase staat hier eerst het plan, daarna wat er gebouwd is en hoe het werkt. Lees het naast de code.

---

## Fase 1: Projectopzet

### Plan

1. Vite-template `react-ts` ophalen en de packages uit CLAUDE.md installeren.
2. ESLint (in plaats van oxlint uit het nieuwe template) en Vitest instellen.
3. Alle mappen en bestanden uit de mappenstructuur aanmaken, elk met een commentaarregel bovenaan.
4. Per scherm een simpele component die alleen de titel toont.
5. Hash-routes in `routes.tsx`, `FluentProvider` met `webLightTheme` in `App.tsx`.
6. `.env.example` en `.gitignore` (met `.env`).
7. Controle: build, test, lint. Daarna dit leerlog aanvullen en committen.

Bestanden voor fase 8 en 9 (`.gitlab-ci.yml`, `public/staticwebapp.config.json`, `appPackage/`) maak ik nog niet.

### Wat er gebouwd is

Een leeg maar werkend project. `npm run dev` start de app; je ziet de titel "Welkom". Ga naar `http://localhost:5173/#/dashboard` en je ziet de titel van het Dashboard.

### Welke bestanden

| Bestand | Wat het doet |
| --- | --- |
| `package.json` | Lijst van packages en de scripts `dev`, `build`, `test`, `lint`. |
| `vite.config.ts` | Instellingen voor Vite én Vitest (één bestand voor beide). Poort 5173 staat vast. |
| `eslint.config.js` | Regels voor `npm run lint`, ook de regels van React Hooks. |
| `tsconfig*.json` | TypeScript-instellingen uit het template. |
| `.env.example` | Voorbeeld voor je eigen `.env` met `VITE_CLIENT_ID`. `.env` zelf staat in `.gitignore`. |
| `src/main.tsx` | Startpunt: zet `<App />` in de `<div id="root">` van `index.html`. |
| `src/App.tsx` | `FluentProvider` (het thema) om de router heen. |
| `src/routes.tsx` | Eén hash-route per scherm. |
| `src/pages/*/*.tsx` | Eén component per scherm, nu alleen een titel. |
| `src/model/types.ts`, `src/graph/types.ts` | Het datamodel uit CLAUDE.md, alvast als TypeScript-types. |
| overige bestanden | Lege bestanden met een commentaarregel die zegt in welke fase ze gevuld worden. |

### Hoe het samenwerkt

`index.html` laadt `main.tsx`. Die maakt `<App />`. `App` zet het Fluent-thema klaar en geeft de router door. De router kijkt naar het stuk na `#` in de adresbalk en kiest het scherm dat daarbij hoort.

### Twee afwijkingen van CLAUDE.md, en waarom

1. **TypeScript 6.0 in plaats van 7.** Het nieuwe Vite-template gebruikt TypeScript 7, maar `typescript-eslint` (nodig voor ESLint) werkt nog alleen met versies onder 6.1. Daarom staat TypeScript op 6.0.
2. **ESLint in plaats van oxlint.** Het template gebruikt tegenwoordig oxlint. CLAUDE.md vraagt ESLint (`eslint.config.js`), dus dat is vervangen.

Ook: de map `docs/ontwerp/` met de Figma-exports bestaat nog niet. De schermen in fase 3 en later volgen daarom de beschrijving in CLAUDE.md en de bouwprompts. Zet de PNG's erin, dan kunnen de schermen later dichter naar het ontwerp.

### Drie dingen om zelf te begrijpen

1. **Hash-routes.** De URL `/#/dashboard` vraagt de server altijd om `index.html`; alleen de browser kijkt naar het deel na `#`. Daardoor hoeft een statische host geen speciale regels te kennen.
2. **Providers.** `FluentProvider` is een component die iets (hier het thema) doorgeeft aan alles wat erbinnen staat. Later komen er meer providers bij: voor inloggen en voor het scanresultaat.
3. **Scripts.** `npm run build` controleert eerst alle types (`tsc -b`) en bouwt daarna. Een typefout laat de build dus mislukken, ook als de app in `npm run dev` nog draait.

### Oefening

Voeg een tiende route toe, `#/test`, die een scherm met de titel "Testpagina" toont. Welke twee bestanden moet je aanraken? Haal de route daarna weer weg.

---

## Fase 2: Rekenmodel en analyse

### Plan

Alles in `src/model/`, zonder React en zonder netwerk. Volgorde:

1. `config.ts`: de voorlopige factoren met bron.
2. `rekenmodel.ts`: `berekenImpact(bytes, config)` met laag en hoog.
3. `naarBestand.ts`: `DriveItem` → `Bestand` (of `null` voor mappen en verwijderde items), soort uit de extensie, map uit `parentReference.path`.
4. `analyse.ts`: `maakAnalyse(bestanden, quota, config, nu)` met groepen per leeftijd, soort en map, en de grootste bestanden.
5. `opmaak.ts` (nieuw): getallen en bytes netjes in het Nederlands tonen. Ook puur, dus ook in `model/`.
6. Tests: `rekenmodel.test.ts` (met de controletest van 250 GB), `naarBestand.test.ts`, `analyse.test.ts`, `opmaak.test.ts`.

### Wat er gebouwd is

Het "rekenhart" van de tool. Geen schermen, alleen functies die je met tests controleert. `npm test` draait 44 tests.

### Welke bestanden

| Bestand | Wat het doet |
| --- | --- |
| `src/model/config.ts` | De factoren (watt per TB, kopieën, PUE, uren, CO2 per kWh) met hun bron. |
| `src/model/rekenmodel.ts` | `berekenImpact(bytes, config)`: rekent twee keer, met de lage en met de hoge factoren. |
| `src/model/naarBestand.ts` | `naarBestand(item)`: maakt van een Graph-item een `Bestand`, of `null` voor een map of verwijderd item. Bepaalt de soort uit de extensie en de map uit het pad. |
| `src/model/analyse.ts` | `maakAnalyse(bestanden, quota, config, nu)`: totaal, prullenbak, groepen en de 20 grootste bestanden. Ook `isOuderDan()`, die het Opruimen-scherm later gebruikt. |
| `src/model/opmaak.ts` | Getallen, bytes en "van ... tot ..." in het Nederlands. |
| `src/model/*.test.ts` | De tests. |

### Hoe het samenwerkt

```
DriveItem (uit Graph) --naarBestand--> Bestand --maakAnalyse--> Analyse
                                                      |
                                                      +-- berekenImpact (per groep)
```

`maakAnalyse` sorteert de bestanden in groepen en roept voor elke groep `berekenImpact` aan met het totaal aantal bytes van die groep. Omdat de formule recht evenredig is (twee keer zoveel bytes is twee keer zoveel kWh), mag je de bytes eerst optellen en dan pas rekenen.

Keuzes die je moet kennen:

- **Totaal** = alle gescande bestanden bij elkaar. De **prullenbak** komt uit `quota.deleted`, want delta geeft verwijderde bestanden niet als bestand terug.
- **Per map** groepeert op de bovenste map (`/Documenten/Projecten/2024` telt bij "Documenten"). Bestanden direct in de hoofdmap vallen onder "Hoofdmap". Zo blijft de lijst kort.
- **Leeftijd** telt vanaf `nu` terug in kalendermaanden. Een bestand van precies een half jaar oud valt in "6 tot 12 maanden".

### Drie dingen om zelf te begrijpen

1. **Pure functies.** Een pure functie gebruikt alleen wat je erin stopt en geeft altijd hetzelfde antwoord. Daarom krijgt `maakAnalyse` de datum `nu` als parameter, in plaats van zelf `new Date()` te doen. Anders zou een test volgend jaar ineens falen.
2. **Bandbreedte.** We weten de echte stroom per TB niet precies. Daarom rekenen we met een lage en een hoge schatting en tonen we beide. `laag` gebruikt overal de lage factoren, `hoog` overal de hoge.
3. **De controletest.** Met de oude factoren uit Gröger 2020 moet 250 GB ongeveer 65,7 kWh opleveren. Als iemand de formule per ongeluk verandert, faalt deze test meteen.

### Oefening

Zet in `config.ts` het aantal kopieën op 3 en draai `npm test`. Welke test faalt, en waarom faalt de controletest níet? Zet de waarde daarna terug.

---

## Fase 3: Voorbeelddata en de inzichtschermen

### Plan

De ontwerpen in `docs/ontwerp/` ontbreken nog. Ik bouw de schermen daarom met standaard Fluent UI-onderdelen en de beschrijving uit CLAUDE.md.

1. `src/demo/voorbeeldData.ts`: ongeveer 300 verzonnen DriveItems (vaste "willekeur", dus elke keer dezelfde lijst), plus een paar mappen en een verwijderd item om te laten zien dat die worden overgeslagen.
2. `src/state/`: `scanContextWaarde.ts` (de context), `ScanContext.tsx` (de provider met `laadVoorbeelddata()`), `useScan.ts` (de hook voor schermen). Drie bestanden, omdat React-tools willen dat een bestand met een component alleen componenten exporteert.
3. `src/components/`: `AppLayout.tsx` (kopbalk, melding voorbeelddata, het scherm), `Kopbalk.tsx`, `ImpactKaart.tsx`, `LeeftijdKaart.tsx`, `BestandenTabel.tsx`, `GeenScan.tsx`, `charts/SoortenGrafiek.tsx`.
4. Schermen: Welkom (knop "Bekijk met voorbeelddata"), Dashboard, Zo rekenen we, Grootste bestanden en soorten, Bestanden per map.
5. `routes.tsx`: alle schermen binnen `AppLayout`.

### Wat er gebouwd is

Je kunt de tool nu bekijken zonder in te loggen. Klik op het welkomstscherm op **Bekijk met voorbeelddata**: je komt op het Dashboard met 286 verzonnen bestanden. Bovenaan elk scherm staat een oranje melding dat het voorbeelddata is. Via de kopbalk ga je naar Grootste bestanden, Per map en Zo rekenen we.

### Welke bestanden

| Bestand | Wat het doet |
| --- | --- |
| `src/demo/voorbeeldData.ts` | Maakt de verzonnen DriveItems, plus mappen en een verwijderd item. |
| `src/state/scanContextWaarde.ts` | Beschrijft wat er in de context zit en maakt de context aan. |
| `src/state/ScanContext.tsx` | `ScanProvider`: bewaart het scanresultaat in `useState` en rekent met `useMemo` de analyse uit. |
| `src/state/useScan.ts` | `useScan()`: hiermee haalt een scherm de gegevens op. |
| `src/components/AppLayout.tsx` | Kopbalk + melding voorbeelddata + `<Outlet />` (de plek voor het scherm). |
| `src/components/Kopbalk.tsx` | Naam van de tool en navigatie (alleen zichtbaar als er gegevens zijn). |
| `src/components/ImpactKaart.tsx` | Grootte, kWh en CO₂ als "van ... tot ...". |
| `src/components/LeeftijdKaart.tsx` | De drie leeftijdsgroepen met een balk. |
| `src/components/GroepenTabel.tsx` | Tabel voor groepen (gebruikt voor soorten én voor mappen, daarom in `components/`). |
| `src/components/BestandenTabel.tsx` | Tabel met losse bestanden. |
| `src/components/GeenScan.tsx` | Melding als iemand een scherm opent zonder gegevens (bijvoorbeeld na verversen). |
| `src/components/charts/SoortenGrafiek.tsx` | Recharts-staafgrafiek, met een verborgen tekst voor schermlezers. |
| `src/pages/...` | Welkom, Dashboard, Zo rekenen we, Grootste bestanden, Per map. |

Ook aangepast: `src/model/opmaak.ts`. Heel kleine getallen werden "0"; nu tonen we twee betekenisvolle cijfers, en onder 0,001 de woorden "bijna 0". De factoren op "Zo rekenen we" komen ongerond op het scherm (PUE 1,185 en niet 1,2).

### Hoe het samenwerkt

```
App
└─ FluentProvider (thema)
   └─ ScanProvider (scan + analyse in het geheugen)
      └─ RouterProvider
         └─ AppLayout (Kopbalk, melding)
            └─ het scherm van de huidige URL  -> useScan() -> analyse
```

1. De knop op Welkom roept `laadVoorbeelddata()` aan.
2. Die maakt DriveItems, zet ze om met `naarBestanden()` en zet het resultaat met `setScan()` in de state.
3. React tekent alles opnieuw. `useMemo` ziet een nieuw `scan` en roept `maakAnalyse()` aan.
4. Elk scherm leest met `useScan()` de `analyse` en toont die.

Ververs je de pagina (F5), dan is alles weg. Dat is de bedoeling: we bewaren niets (harde regel 3).

### Drie dingen om zelf te begrijpen

1. **Context.** Zonder context zou je de analyse van `App` via props naar elk scherm moeten doorgeven. Een context is een "kanaal" waar elk onderdeel binnen de provider op kan inschakelen met `useScan()`.
2. **`useMemo`.** De analyse uitrekenen kost tijd bij duizenden bestanden. `useMemo` onthoudt de uitkomst en rekent alleen opnieuw als `scan` of `scanMoment` verandert.
3. **Vaste "willekeur".** `maakWillekeur(2026)` geeft elke keer dezelfde reeks getallen. Daardoor ziet de demo er bij iedereen hetzelfde uit en kun je er een test op schrijven (`voorbeeldData.test.ts`).

### Oefening

Voeg in `voorbeeldData.ts` een sjabloon toe voor een nieuwe map `/Podcasts` met 5 `.mp3`-bestanden van 30 tot 80 MB. Bij welke soort komen ze terecht op het scherm Grootste bestanden, en waarom? Wat moet je veranderen om ze bij een eigen soort "Audio" te laten horen?

---

## Fase 4: Inloggen in de browser

### Plan

Belangrijk verschil met oudere voorbeelden: **in MSAL v5 werkt een popup alleen via een "redirect bridge"-pagina.** Microsoft stuurt de popup na het inloggen terug naar die pagina, en die geeft het antwoord door aan het hoofdvenster. Bron: de officiële migratiegids v4 → v5 (`lib/msal-browser/docs/v4-migration.md`).

1. `src/vite-env.d.ts`: TypeScript laten weten dat `VITE_CLIENT_ID` bestaat.
2. `src/config/env.ts`: client-id, authority, redirect-URI (`/redirect.html`) en scopes. `isClientIdIngesteld` voor de melding als hij ontbreekt.
3. `redirect.html` + `src/auth/redirect.ts`: de bridge-pagina, die alleen `broadcastResponseToMainFrame()` aanroept. In `vite.config.ts` wordt `redirect.html` een tweede ingang van de build.
4. `src/auth/msal.ts`: `maakMsalVoorBrowser()` met `createStandardPublicClientApplication`, cache in `sessionStorage`. `maakMsalVoorTeams()` met `createNestablePublicClientApplication` staat klaar, maar wordt nog niet gebruikt.
5. `src/auth/foutmelding.ts`: MSAL-foutcodes vertalen naar gewone taal (popup geblokkeerd, toestemming geweigerd, geen internet).
6. `src/auth/useAuth.ts`: inloggen, uitloggen en de naam van de gebruiker. `src/auth/useToken.ts`: eerst stil een token halen, anders met een popup.
7. `src/auth/AuthProvider.tsx`: zet `MsalProvider` om de app. Zo blijft alle MSAL-code in `src/auth/`, en gebruikt `App.tsx` alleen `AuthProvider`.
8. `main.tsx`: eerst MSAL starten, daarna de app tonen. Zonder client-id start de app gewoon, met voorbeelddata.
9. Privacy-scherm met de knop "Inloggen en mijn OneDrive berekenen". Kopbalk met naam en knop Uitloggen.

### Wat er gebouwd is

Inloggen met een Microsoft-account via een popup. Op het Privacy-scherm staat wat de tool wel en niet bekijkt, en de knop **Inloggen en mijn OneDrive berekenen**. Na het inloggen staan je naam en de knop **Uitloggen** rechts in de kopbalk. Het Scannen-scherm is nog leeg (dat komt in fase 5).

Zonder `VITE_CLIENT_ID` start de app gewoon. De inlogknop is dan grijs en een gele melding legt uit wat er ontbreekt. Voorbeelddata werkt altijd.

**Getest in de browser** met een nep-client-id: de popup gaat naar `login.microsoftonline.com/common`, met `redirect_uri=http://localhost:5180/redirect.html` en scopes `User.Read Files.Read` (plus `openid profile offline_access`, die MSAL altijd toevoegt). `localStorage` bleef leeg en er waren geen cookies. Een echte inlogtest kan pas met een echt client-id.

### Actie voor het team: redirect-URI

Zet in de app-registratie (Authentication → Single-page application) als redirect-URI:

```
http://localhost:5173/redirect.html
```

Dus **met** `/redirect.html`, niet alleen `http://localhost:5173` zoals in de bouwprompts staat. Reden: MSAL v5 stuurt de popup naar een aparte "bridge"-pagina. Later komt de Static Web Apps-URL erbij, ook met `/redirect.html` erachter.

### Welke bestanden

| Bestand | Wat het doet |
| --- | --- |
| `src/config/env.ts` | Client-id, authority (`common`), redirect-URI en scopes op één plek. |
| `src/vite-env.d.ts` | Vertelt TypeScript dat `import.meta.env.VITE_CLIENT_ID` bestaat. |
| `redirect.html` + `src/auth/redirect.ts` | De bridge-pagina. Roept alleen `broadcastResponseToMainFrame()` aan. |
| `vite.config.ts` | Bouwt nu twee pagina's: `index.html` en `redirect.html`. |
| `src/auth/msal.ts` | Maakt MSAL: `createStandardPublicClientApplication` (browser) en, voor later, `createNestablePublicClientApplication` (Teams). Cache in `sessionStorage`. |
| `src/auth/AuthProvider.tsx` | Zet `MsalProvider` om de app. |
| `src/auth/useAuth.ts` | `login()`, `logout()`, `naam`, `isIngelogd`. |
| `src/auth/useToken.ts` | `useToken()` geeft een functie die een token voor Graph haalt. |
| `src/auth/foutmelding.ts` | Zet MSAL-foutcodes om in Nederlandse zinnen. Met tests. |
| `src/main.tsx` | Start MSAL vóórdat de app getekend wordt. |
| `src/pages/Privacy/Privacy.tsx` | Uitleg en de inlogknop. |
| `src/components/Kopbalk.tsx` | Naam van de gebruiker en Uitloggen. |

### Hoe het samenwerkt

```
Klik "Inloggen"  ->  useAuth().login()  ->  MSAL opent popup naar login.microsoftonline.com
                                                  |
             gebruiker logt in en geeft toestemming
                                                  v
                     Microsoft stuurt de popup naar /redirect.html?code=...
                                                  |
             redirect.ts geeft het antwoord via een BroadcastChannel door aan het hoofdvenster
                                                  v
           MSAL wisselt de code in voor tokens, bewaart ze in sessionStorage, popup sluit
                                                  v
                     login() is klaar  ->  account actief  ->  naar #/scannen
```

Later (fase 5) roept de scan `useToken()` aan. Die probeert eerst `acquireTokenSilent` (uit de cache of stil vernieuwd). Alleen als Microsoft zegt dat de gebruiker iets moet doen (`InteractionRequiredAuthError`), opent er een popup.

**Een eigenaardigheid van MSAL v5:** MSAL kan niet zien dat iemand de popup sluit (de loginpagina van Microsoft verbreekt de band met het venster). MSAL wacht dan tot de wachttijd om is. Wij zetten die wachttijd op 3 minuten, zodat er tijd is voor tweestapsverificatie. Daarom toont het Privacy-scherm tijdens het wachten de knop **Opnieuw proberen**. Die geeft `overrideInteractionInProgress: true` mee, zodat MSAL de oude poging afbreekt. Dat mag volgens de documentatie alleen na een klik van de gebruiker, nooit automatisch.

### Drie dingen om zelf te begrijpen

1. **Waarom een popup en geen redirect?** Bij een redirect verlaat de hele app de pagina, en dan is alles in het geheugen weg (ook een scan). Een popup laat de app gewoon staan.
2. **sessionStorage, geen localStorage.** De tokens blijven bewaard zolang het tabblad open is. Sluit je het tabblad, dan ben je uitgelogd. Het scanresultaat bewaren we nergens; de tokens wel, omdat MSAL anders bij elke klik opnieuw zou vragen om in te loggen.
3. **Alleen `src/auth/` kent MSAL.** Schermen gebruiken `useAuth()` en `useToken()`. Gaat de app later in Teams een andere manier van inloggen gebruiken, dan verandert alleen `src/auth/`.

### Oefening

Open de app zonder `.env` en kijk naar het Privacy-scherm. Maak daarna een `.env` met een verzonnen id, bijvoorbeeld `VITE_CLIENT_ID=11111111-2222-3333-4444-555555555555`, en start `npm run dev` opnieuw. Wat verandert er, en wat laat Microsoft zien als je op Inloggen klikt? Waarom moet je de dev-server opnieuw starten nadat je `.env` hebt aangepast?
