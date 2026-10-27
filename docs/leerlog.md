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
