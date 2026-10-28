# Zelf bouwen: de KlimaatImpactTool stap voor stap

Deze handleiding is voor iemand die net begint met programmeren. Je bouwt de hele tool zelf, bestand voor bestand. Je typt de code zelf; deze handleiding vertelt je **wat** je bouwt, **waarom**, en **hoe je controleert** of het werkt.

Het project waar dit bestand in staat, is je **antwoordmodel**. Zit je vast, kijk dan in het bestand met dezelfde naam. Maar probeer het eerst zelf. Je leert het meest van de stukken waar je even op vastloopt.

---

## Inhoud

- [Voordat je begint](#voordat-je-begint)
- [Hoe je met deze handleiding werkt](#hoe-je-met-deze-handleiding-werkt)
- [Stap 0: je werkplek klaarzetten](#stap-0-je-werkplek-klaarzetten)
- [Stap 1: een leeg project dat start](#stap-1-een-leeg-project-dat-start)
- [Stap 2: het datamodel (types)](#stap-2-het-datamodel-types)
- [Stap 3: het rekenmodel en je eerste test](#stap-3-het-rekenmodel-en-je-eerste-test)
- [Stap 4: van Graph-item naar Bestand](#stap-4-van-graph-item-naar-bestand)
- [Stap 5: de analyse](#stap-5-de-analyse)
- [Stap 6: getallen netjes tonen](#stap-6-getallen-netjes-tonen)
- [Stap 7: schermen en routes](#stap-7-schermen-en-routes)
- [Stap 8: voorbeelddata](#stap-8-voorbeelddata)
- [Stap 9: ScanContext, het geheugen van de app](#stap-9-scancontext-het-geheugen-van-de-app)
- [Stap 10: gedeelde onderdelen en de eerste echte schermen](#stap-10-gedeelde-onderdelen-en-de-eerste-echte-schermen)
- [Stap 11: de grafiek](#stap-11-de-grafiek)
- [Stap 12: de app-registratie in Entra](#stap-12-de-app-registratie-in-entra)
- [Stap 13: inloggen met MSAL](#stap-13-inloggen-met-msal)
- [Stap 14: praten met Microsoft Graph](#stap-14-praten-met-microsoft-graph)
- [Stap 15: de echte scan](#stap-15-de-echte-scan)
- [Stap 16: oude bestanden en resultaat](#stap-16-oude-bestanden-en-resultaat)
- [Stap 17: de harde regels bewaken met ESLint](#stap-17-de-harde-regels-bewaken-met-eslint)
- [Stap 18: afwerking (toegankelijkheid, randgevallen, smal scherm)](#stap-18-afwerking)
- [Problemen die wij tegenkwamen](#problemen-die-wij-tegenkwamen)
- [Woordenlijst](#woordenlijst)

---

## Voordat je begint

### Wat je al een beetje moet kennen

Je hoeft geen expert te zijn. Wel handig:

- **HTML en CSS**: wat een `<div>`, `<button>` en `<h1>` is.
- **JavaScript-basis**: variabelen (`const`, `let`), functies, `if`, lijsten (arrays) en objecten.
- **De terminal**: een map openen (`cd`) en een commando typen.

Ken je dit nog niet? Doe eerst een paar uur van een gratis cursus, bijvoorbeeld de JavaScript-basis op [javascript.info](https://javascript.info/) (deel 1, hoofdstuk 1 en 2).

### Wat je onderweg leert

| Onderwerp | Waar in de handleiding | Officiële uitleg |
| --- | --- | --- |
| TypeScript (JavaScript met types) | stap 2 | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) |
| Testen met Vitest | stap 3 | [vitest.dev](https://vitest.dev/guide/) |
| React (componenten, state, hooks) | stap 7 tot 11 | [react.dev/learn](https://react.dev/learn) |
| Fluent UI (knoppen, kaarten, tabellen) | stap 7 en verder | [react.fluentui.dev](https://react.fluentui.dev/) |
| Routes | stap 7 | [reactrouter.com](https://reactrouter.com/) |
| Recharts (grafieken) | stap 11 | [recharts.org](https://recharts.org/) |
| Inloggen met MSAL | stap 13 | [MSAL.js op GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) |
| Microsoft Graph | stap 14 | [learn.microsoft.com/graph](https://learn.microsoft.com/graph/overview) |

**Tip:** lees bij React eerst de pagina's "Your First Component", "Passing Props", "State: A Component's Memory" en "Sharing State Between Components". Die vier heb je het meest nodig.

### De harde regels (lees ze nu, ze bepalen hoe je bouwt)

Uit `CLAUDE.md`, in gewone taal:

1. **Geen server en geen database.** Alles draait in de browser.
2. **Alleen gegevens óver bestanden** (naam, grootte, datum, map). Nooit de inhoud.
3. **Niets bewaren.** Geen `localStorage`, geen cookies. Sluit je het tabblad, dan is alles weg.
4. **Alleen praten met Microsoft** (`login.microsoftonline.com` en `graph.microsoft.com`).
5. **Lagen.** Elke map heeft één taak. Een scherm haalt nooit zelf gegevens van internet.
6. **Geen geheimen in git.**
7. **Nooit zeggen dat een bestand "weg mag".** Bij oude bestanden verwijzen we naar de bewaarregels.

---

## Hoe je met deze handleiding werkt

Elke stap heeft dezelfde onderdelen:

- **Doel**: wat je aan het eind hebt.
- **Wat je leert**: het belangrijkste begrip.
- **Doen**: de opdrachten, in volgorde.
- **Controle**: hoe je ziet dat het werkt.
- **Vastgelopen?**: waar je in het antwoordmodel kijkt.

Na **elke** stap:

1. Draai `npm run build`, `npm test` en `npm run lint` (vanaf stap 3). Alles groen? Pas dan verder.
2. Maak een commit: `git add -A` en daarna `git commit -m "Stap N: korte omschrijving"`. Zo kun je altijd terug.
3. Schrijf in je eigen woorden 2 of 3 zinnen op wat je hebt geleerd. Dat helpt meer dan je denkt.

> **Werk in een nieuwe map**, bijvoorbeeld `klimaatimpact-zelf`, naast deze map. Dan raak je het antwoordmodel niet kwijt.

---

## Stap 0: je werkplek klaarzetten

**Doel:** alle gereedschap staat klaar.

**Doen:**

1. Installeer **Node.js LTS** van [nodejs.org](https://nodejs.org/). Controleer in de terminal: `node -v` moet een versienummer geven.
2. Installeer **Git** van [git-scm.com](https://git-scm.com/). Controleer: `git --version`.
3. Installeer in VS Code de extensie **ESLint** (van Microsoft). Dan zie je fouten al tijdens het typen.
4. Stel Git in met je naam en e-mail (eenmalig):

   ```bash
   git config --global user.name "Je Naam"
   git config --global user.email "jij@voorbeeld.nl"
   ```

**Controle:** `node -v`, `npm -v` en `git --version` geven alle drie een versie.

---

## Stap 1: een leeg project dat start

**Doel:** een React-app die "Welkom" toont op `http://localhost:5173`.

**Wat je leert:** wat Vite is (een programma dat je code omzet naar iets wat de browser snapt, en een testserver start), en wat `package.json` is (de lijst met onderdelen van je project).

**Doen:**

1. Open een terminal in de map waar je nieuwe project moet komen en typ:

   ```bash
   npm create vite@latest klimaatimpact-zelf -- --template react-ts
   cd klimaatimpact-zelf
   git init
   ```

2. Installeer de onderdelen die de tool gebruikt:

   ```bash
   npm install react-router @azure/msal-browser@5 @azure/msal-react@5 @microsoft/teams-js@2 @fluentui/react-components@9 recharts@3
   npm install -D typescript@~6.0 vitest eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
   ```

   Waarom `typescript@~6.0`? Het nieuwe template gebruikt TypeScript 7, maar de ESLint-koppeling werkt daar nog niet mee. Zie [Problemen die wij tegenkwamen](#problemen-die-wij-tegenkwamen).

3. Het template gebruikt `oxlint`. Wij gebruiken ESLint. Haal oxlint weg: `npm uninstall oxlint` en verwijder het bestand `.oxlintrc.json`.

4. Zet in `package.json` bij `"scripts"` deze vier regels (pas aan wat er al staat):

   ```json
   "dev": "vite",
   "build": "tsc -b && vite build",
   "test": "vitest run",
   "lint": "eslint ."
   ```

5. Maak `eslint.config.js`. Begin simpel: neem de vorm uit het antwoordmodel over, maar **alleen het eerste blok** (tot en met `languageOptions`). De extra regels komen in stap 17.

6. Zet in `.gitignore` onderaan:

   ```
   .env
   .env.*
   !.env.example
   ```

   En maak `.env.example` met de regel `VITE_CLIENT_ID=`.

7. Maak alle mappen uit de mappenstructuur in `CLAUDE.md` aan (`src/model`, `src/graph`, `src/auth`, `src/pages/Welkom`, ...). Lege mappen mogen.

8. Vervang de inhoud van `src/App.tsx` door een component die alleen `<h1>Welkom</h1>` toont. Verwijder `App.css`, `index.css` en de map `assets` uit het template, en haal de imports ervan weg.

9. Start: `npm run dev` en open `http://localhost:5173`.

**Controle:** je ziet "Welkom". `npm run build` en `npm run lint` geven geen fouten.

**Vastgelopen?** Kijk in `package.json`, `eslint.config.js`, `.gitignore` en `vite.config.ts` van het antwoordmodel.

---

## Stap 2: het datamodel (types)

**Doel:** twee bestanden die beschrijven welke gegevens de tool kent.

**Wat je leert:** TypeScript-types. Een `interface` is een afspraak: "een Bestand heeft altijd een naam (tekst) en een grootte (getal)". Typ je later per ongeluk `bestand.grote`, dan waarschuwt de editor meteen.

**Doen:**

1. Maak `src/graph/types.ts` en neem de interfaces `DriveItem` en `Quota` over uit het hoofdstuk "Datamodel" in `CLAUDE.md`.
2. Maak `src/model/types.ts` en neem de rest van het datamodel over (`Bandbreedte`, `Bestandssoort`, `Bestand`, `ScanResultaat`, `RekenConfig`, `Impact`, `Groep`, `Analyse`, `Opruimselectie`).
3. Zet bovenaan elk bestand een commentaarregel die zegt waar het bestand voor is.

**Begrijp het verschil:** `DriveItem` is hoe **Microsoft** een bestand beschrijft (Engelse namen, veel velden optioneel). `Bestand` is hoe **wij** een bestand beschrijven (Nederlandse namen, alles ingevuld). In stap 4 maak je de vertaling van het één naar het ander.

**Controle:** `npm run build` geeft geen fouten.

---

## Stap 3: het rekenmodel en je eerste test

**Doel:** een functie die van een aantal bytes de stroom en CO₂ per jaar uitrekent, plus een test die bewijst dat het klopt.

**Wat je leert:** een **pure functie** (zelfde invoer geeft altijd dezelfde uitkomst, en de functie doet verder niets) en een **test** (code die je code controleert).

**Doen:**

1. Zet in `vite.config.ts` een `test`-onderdeel met `include: ['src/**/*.test.ts']`. Importeer `defineConfig` dan uit `'vitest/config'` in plaats van `'vite'`.

2. Maak `src/model/config.ts` met één object `rekenConfig` van het type `RekenConfig`. Vul de waarden in uit de tabel "Rekenmodel" in `CLAUDE.md`, en zet bij `bron` per factor waar het getal vandaan komt.

3. Maak `src/model/rekenmodel.ts` met de functie `berekenImpact(bytes, config)`. Volg de formule:

   ```
   kWh per jaar    = (bytes / 10^12) × wattPerTB × kopieen × pue × urenPerJaar / 1000
   kg CO2 per jaar = kWh per jaar × kgCo2PerKwh
   ```

   Reken twee keer: `laag` met de lage waarden, `hoog` met de hoge waarden.

   > **Tip:** maak eerst een klein hulpfunctietje `kwhPerJaar(bytes, wattPerTB, config)`. Dan roep je dat twee keer aan in plaats van de formule twee keer te typen.

4. Maak `src/model/rekenmodel.test.ts`. Schrijf eerst de **controletest**: met de oude HvA-factoren (10 W, 2 kopieën, PUE 1,5, 0,468 kg/kWh) geeft 250 GB ongeveer 65,7 kWh en 30,7 kg CO₂.

   Een test ziet er zo uit:

   ```ts
   import { describe, expect, it } from 'vitest';

   describe('berekenImpact', () => {
     it('controletest: 250 GB geeft ongeveer 65,7 kWh', () => {
       const impact = berekenImpact(250e9, oudeHvaConfig);
       expect(impact.kwhPerJaar.laag).toBeCloseTo(65.7, 1);
     });
   });
   ```

   `toBeCloseTo` gebruik je bij kommagetallen, omdat computers die niet altijd exact opslaan.

5. Bedenk zelf nog drie tests, bijvoorbeeld: 0 bytes geeft 0; `laag` is nooit groter dan `hoog`; twee keer de helft is evenveel als het geheel.

**Controle:** `npm test` toont al je tests als geslaagd.

**Oefening:** maak expres een fout in de formule (bijvoorbeeld `/ 100` in plaats van `/ 1000`). Faalt je test? Mooi, dan doet hij zijn werk. Zet het daarna terug.

---

## Stap 4: van Graph-item naar Bestand

**Doel:** een functie `naarBestand(item)` die een `DriveItem` omzet naar een `Bestand`, of `null` teruggeeft als het geen bestand is.

**Wat je leert:** gegevens "schoonmaken" voordat je ermee rekent, en omgaan met velden die kunnen ontbreken (`?.` en `??`).

**Doen:** maak `src/model/naarBestand.ts` met deze functies. Schrijf bij elke functie meteen een paar tests in `naarBestand.test.ts`.

1. **`bepaalSoort(naam)`**: kijk naar de extensie (het stuk na de laatste punt) en geef `'word'`, `'excel'`, `'powerpoint'`, `'pdf'`, `'afbeelding'`, `'video'` of `'overig'`.
   - Tip: maak een lijst met extensies per soort, bijvoorbeeld `word: ['doc', 'docx', ...]`.
   - Denk aan hoofdletters: `RAPPORT.PDF` is ook een pdf. Gebruik `.toLowerCase()`.
   - Denk aan een naam zonder punt.

2. **`bepaalMap(pad)`**: Graph geeft een pad als `/drive/root:/Documenten/Projecten`. Maak daar `/Documenten/Projecten` van. Is het de hoofdmap, geef dan `/`.
   - Spaties kunnen als `%20` in het pad staan. `decodeURIComponent()` zet dat terug.

3. **`naarBestand(item)`**:
   - Geef `null` als het item een map is (`item.folder`), verwijderd is (`item.deleted`) of geen `item.file` heeft.
   - `gewijzigdOp`: neem `item.fileSystemInfo?.lastModifiedDateTime`, en als die er niet is `item.lastModifiedDateTime`. Maak er een `Date` van.
   - `grootte`: `item.size ?? 0` (geen grootte? dan tellen we 0).

4. **`naarBestanden(items)`**: doe `naarBestand` voor een hele lijst en laat de `null`-waarden weg.

**Controle:** je tests dekken: een gewoon bestand, een map, een verwijderd item, een bestand zonder grootte, en hoofdletters in de extensie.

---

## Stap 5: de analyse

**Doel:** `maakAnalyse(bestanden, quota, config, nu)` maakt van een lijst bestanden alles wat de schermen nodig hebben.

**Wat je leert:** groeperen (bestanden in bakjes verdelen) en waarom je `nu` meegeeft als parameter.

**Doen:** maak `src/model/analyse.ts`.

1. **`maandenTerug(nu, maanden)`** en **`isOuderDan(bestand, maanden, nu)`**. Gebruik `new Date(nu)` en `setMonth(getMonth() - maanden)`. Verander nooit de originele `nu`.

2. **Leeftijdsgroepen:** "Minder dan 6 maanden", "6 tot 12 maanden", "Meer dan een jaar". Geef altijd alle drie terug, in deze volgorde, ook als er een leeg is.

3. **Een algemene functie `groepeer(bestanden, groepVan, config)`.** `groepVan` is een functie die voor één bestand de naam van zijn groep geeft. Zo gebruik je dezelfde functie voor soort, map en leeftijd.
   - Tip: gebruik een `Map` van groepsnaam naar lijst bestanden. Loop daarna over de `Map` en maak per groep een `Groep` met `aantal` en `impact`.

4. **Per map**: groepeer op de **bovenste** map (`/Documenten/Projecten/2024` hoort bij `Documenten`). Bestanden direct in de hoofdmap: "Hoofdmap".

5. **De grootste**: sorteer een **kopie** (`[...bestanden]`) op grootte en neem de eerste 20. Sorteer nooit de originele lijst, want `sort()` verandert de lijst zelf.

6. **Totaal** = alle bestanden bij elkaar. **Prullenbak** = `quota.deleted` (of 0 als er geen quota is).

**Waarom `nu` als parameter?** Zou de functie zelf `new Date()` gebruiken, dan geeft je test volgend jaar een ander antwoord. Met een vaste `nu` in de test blijft de uitkomst altijd hetzelfde.

**Controle:** schrijf tests met een vaste datum (bijvoorbeeld `new Date('2026-06-15T12:00:00Z')`) en vier verzonnen bestanden. Test ook een lege lijst zonder quota.

---

## Stap 6: getallen netjes tonen

**Doel:** `src/model/opmaak.ts` met functies die getallen leesbaar maken.

**Doen:** schrijf deze functies, elk met tests:

| Functie | Voorbeeld |
| --- | --- |
| `formatBytes(bytes)` | `1500` → `"1,5 kB"`, `250e9` → `"250 GB"` (decimaal: 1 kB = 1000 bytes) |
| `formatGetal(getal)` | `65.74` → `"65,7"`, `0.456` → `"0,46"`, heel klein → `"bijna 0"` |
| `formatBandbreedte(b, eenheid)` | `{laag: 1.2, hoog: 18.5}` → `"van 1,2 tot 18,5 kWh"` |
| `formatAantal(n, enkelvoud, meervoud)` | `1` → `"1 bestand"`, `12345` → `"12.345 bestanden"` |
| `formatDatum(datum)` | `"27 okt 2026"` |

**Tip:** `getal.toLocaleString('nl-NL', { maximumFractionDigits: 1 })` geeft automatisch een komma en duizendtalpunten.

**Controle:** tests groen. Je hebt nu het hele rekenhart, zonder één scherm. Dat is precies de bedoeling: dit deel is het belangrijkst om goed te hebben.

---

## Stap 7: schermen en routes

**Doel:** negen lege schermen. Via de adresbalk (`#/dashboard`) kom je bij elk scherm.

**Wat je leert:** een React-**component** (een functie die een stukje scherm teruggeeft) en **routes** (welk scherm bij welk adres hoort).

**Doen:**

1. Maak per scherm een map met een bestand met dezelfde naam, bijvoorbeeld `src/pages/Dashboard/Dashboard.tsx`:

   ```tsx
   import { Title1 } from '@fluentui/react-components';

   export function Dashboard() {
     return <Title1 as="h1">Dashboard</Title1>;
   }
   ```

   De negen schermen: Welkom, Privacy, Scannen, Dashboard, ZoRekenenWe, GrootsteBestanden, PerMap, Opruimen, Resultaat.

2. Maak `src/routes.tsx` met `createHashRouter` uit `react-router`: een lijst van `{ path: '/dashboard', element: <Dashboard /> }`.

3. Zet in `src/App.tsx` een `FluentProvider` met `theme={webLightTheme}` om een `RouterProvider` heen.

**Waarom een hash (`#`) in het adres?** Alles na de `#` blijft in de browser. De server krijgt dus altijd hetzelfde verzoek om `index.html`, en dat kan een simpele statische host aan.

**Controle:** `http://localhost:5173/#/per-map` toont "Bestanden per map".

**Oefening:** voeg een tiende route `#/test` toe en haal hem daarna weer weg. Welke twee bestanden moest je aanraken?

---

## Stap 8: voorbeelddata

**Doel:** ongeveer 300 verzonnen bestanden, zodat je schermen kunt bouwen zonder in te loggen.

**Doen:** maak `src/demo/voorbeeldData.ts` met:

1. Een lijst "sjablonen", bijvoorbeeld `{ map: '/Documenten', naam: 'Notulen teamoverleg {n}', extensie: 'docx', aantal: 45, minMB: 0.02, maxMB: 0.4, maxDagenOud: 900 }`. Zorg voor alle soorten, een paar mappen, en een paar hele grote video's.
2. Een functie `maakVoorbeeldItems(nu)` die per sjabloon `aantal` DriveItems maakt, met een willekeurige grootte en leeftijd.
3. Een paar mappen en één verwijderd item erbij. Die moet je app overslaan, net als bij een echte scan.
4. Een functie `maakVoorbeeldQuota(items)`.

**Belangrijk:** gebruik geen echte namen van personen.

**Slimme truc (optioneel):** gebruik geen `Math.random()`, maar een eigen "willekeur" met een vast startgetal. Dan krijg je elke keer precies dezelfde lijst, en kun je er een test op schrijven. Kijk in het antwoordmodel naar `maakWillekeur`.

**Controle:** schrijf een test: `naarBestanden(maakVoorbeeldItems(nu))` geeft tussen de 250 en 350 bestanden, en alle zeven soorten komen voor.

---

## Stap 9: ScanContext, het geheugen van de app

**Doel:** één plek die de gegevens bewaart, zodat elk scherm erbij kan.

**Wat je leert:** `useState` (iets onthouden), `useMemo` (iets alleen opnieuw uitrekenen als het nodig is) en **context** (gegevens delen zonder ze door tien componenten heen te geven).

**Doen:** maak drie bestanden in `src/state/`:

1. **`scanContextWaarde.ts`**: de interface `ScanContextWaarde` (wat er in de context zit) en `createContext(...)`.
2. **`ScanContext.tsx`**: de component `ScanProvider` met:
   - `const [scan, setScan] = useState<ScanResultaat | null>(null)`
   - `const [isVoorbeeld, setIsVoorbeeld] = useState(false)`
   - `const analyse = useMemo(() => ..., [scan])`: alleen als `scan.status === 'klaar'`, anders `null`.
   - een functie `laadVoorbeelddata()` die de voorbeelddata in `scan` zet.
3. **`useScan.ts`**: een hook die de context ophaalt en een duidelijke fout geeft als je hem buiten de provider gebruikt.

Zet `<ScanProvider>` in `App.tsx` om de `RouterProvider` heen.

**Waarom drie bestanden?** Een React-hulpje (Fast Refresh) wil dat een `.tsx`-bestand met een component alleen componenten exporteert. **Let op Windows:** noem het eerste bestand niet `scanContext.ts`. Windows ziet geen verschil tussen hoofdletters en kleine letters, dus `scanContext.ts` en `ScanContext.tsx` raken in de war.

**Controle:** maak op het Welkom-scherm een knop "Bekijk met voorbeelddata" die `laadVoorbeelddata()` aanroept en naar `/dashboard` gaat (`useNavigate`). Zet op het Dashboard tijdelijk `{analyse?.totaal.bytes}` neer. Zie je een getal? Dan werkt het.

**Oefening:** druk op F5 op het Dashboard. Waarom is het getal weg? (Hint: harde regel 3.)

---

## Stap 10: gedeelde onderdelen en de eerste echte schermen

**Doel:** een kopbalk, kaarten en tabellen, en de schermen Dashboard, Zo rekenen we, Grootste bestanden en Per map.

**Wat je leert:** **props** (gegevens die je aan een component meegeeft), stijlen met `makeStyles` van Fluent, en een **layout-route** (iets wat op elk scherm staat).

**Doen, in deze volgorde:**

1. **`components/AppLayout.tsx`**: kopbalk bovenaan, daaronder `<Outlet />` (de plek waar het scherm komt). Zet in `routes.tsx` alle schermen als `children` van één route met `element: <AppLayout />`.
2. **`components/Kopbalk.tsx`**: naam van de tool, en links (`NavLink`) naar de schermen, alleen zichtbaar als er een analyse is.
3. **Melding voorbeelddata**: zet in `AppLayout` een `MessageBar` "Je bekijkt voorbeelddata" als `isVoorbeeld` waar is.
4. **`components/GeenScan.tsx`**: melding met een knop naar het begin. Elk scherm dat een analyse nodig heeft, toont dit als er nog geen analyse is.
5. **`components/ImpactKaart.tsx`**: props `titel`, `impact`, `toelichting`. Toont grootte, kWh en CO₂ als "van ... tot ...".
6. **`components/LeeftijdKaart.tsx`**: de drie leeftijdsgroepen met een `ProgressBar`.
7. **`components/GroepenTabel.tsx`** en **`components/BestandenTabel.tsx`**: tabellen met Fluent `Table`. Zet de tabel in een `div` met `overflowX: 'auto'`, dan schuift hij op een telefoon opzij in plaats van dat de hele pagina te breed wordt.
8. Bouw nu de schermen: **Dashboard**, **Zo rekenen we** (de formule en een tabel met factoren en bronnen uit `config.ts`), **Grootste bestanden** en **Per map**.

**Regel:** een onderdeel dat op twee schermen staat, hoort in `components/`. Een onderdeel dat maar op één scherm staat, mag in de map van dat scherm.

**Stijlen met Fluent:**

```tsx
const useStyles = makeStyles({
  kaarten: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
});
```

Gebruik `tokens` voor kleuren en afstanden in plaats van vaste waarden. Dan werkt later ook een donker thema of het Teams-thema.

**Controle:** klik door alle schermen met voorbeelddata. Kloppen de getallen in de tabellen met het Dashboard?

---

## Stap 11: de grafiek

**Doel:** een staafgrafiek met opslag per soort op het scherm Grootste bestanden.

**Doen:** maak `components/charts/SoortenGrafiek.tsx` met Recharts (`BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`).

Let op deze vier dingen (wij liepen er allemaal tegenaan):

1. **Eenheid van de as:** kies de eenheid (bytes, kB, MB, GB) op basis van de grootste groep. Anders staat er bij kleine bestanden "0 GB, 0 GB, 0 GB".
2. **Kleuren:** Recharts zet de kleur als SVG-attribuut, en daarin werken Fluent-`tokens` niet goed. Geef de kleur via CSS: `'& .recharts-rectangle': { fill: tokens.colorBrandBackground }`.
3. **Animatie uit:** `isAnimationActive={false}`. Rustiger, en de balk staat meteen op de goede lengte.
4. **Tekstalternatief:** een schermlezer kan een plaatje niet lezen. Verberg de grafiek voor schermlezers (`aria-hidden="true"`) en zet eronder een verborgen tekst met dezelfde cijfers. De tabel eronder helpt ook.

**Controle:** de grafiek toont dezelfde verhoudingen als de tabel eronder.

---

## Stap 12: de app-registratie in Entra

**Doel:** Microsoft weet dat jouw app bestaat en mag vragen om in te loggen.

Dit doe je niet in code, maar in de portal.

1. Ga naar [entra.microsoft.com](https://entra.microsoft.com) → **App registrations** → **New registration**.
2. **Supported account types:** accounts in elke organisatie en persoonlijke Microsoft-accounts.
3. **Redirect URI:** kies platform **Single-page application** (niet "Web"!) en vul in:

   ```
   http://localhost:5173/redirect.html
   ```

4. Na het aanmaken: **API permissions** → Microsoft Graph → Delegated → `User.Read` en `Files.Read`.
5. Kopieer het **Application (client) ID** en zet het in een nieuw bestand `.env`:

   ```
   VITE_CLIENT_ID=jouw-id-hier
   ```

**Controle:** `git status` mag `.env` **niet** tonen (het staat in `.gitignore`).

**Krijg je later "redirect_uri is not valid"?** Dan staat het adres er niet precies zo, of onder het verkeerde platform. Zie [Problemen die wij tegenkwamen](#problemen-die-wij-tegenkwamen).

---

## Stap 13: inloggen met MSAL

**Doel:** de knop "Inloggen en mijn OneDrive berekenen" opent een Microsoft-inlogvenster. Daarna staat je naam in de kopbalk.

**Wat je leert:** hoe inloggen met een **token** werkt: Microsoft geeft je app een tijdelijk "toegangspasje", en daarmee mag de app namens jou gegevens ophalen.

> **Belangrijk:** veel voorbeelden op internet zijn voor MSAL versie 2 tot 4. Wij gebruiken **versie 5**, en die werkt op een paar punten anders. Gebruik alleen de officiële v5-documentatie.

**Doen:**

1. **`src/vite-env.d.ts`**: vertel TypeScript dat `import.meta.env.VITE_CLIENT_ID` bestaat.
2. **`src/config/env.ts`**: `clientId` (uit `.env`, met `.trim()`), `isClientIdIngesteld`, `authority = 'https://login.microsoftonline.com/common'`, `redirectUri = window.location.origin + '/redirect.html'`, `scopes = ['User.Read', 'Files.Read']`.
3. **De redirect bridge** (nieuw in v5): na het inloggen stuurt Microsoft het inlogvenster naar een aparte pagina. Die geeft het antwoord door aan je app.
   - Maak `redirect.html` in de hoofdmap van je project (naast `index.html`) met een script `src/auth/redirect.ts`.
   - In `redirect.ts` staat alleen `broadcastResponseToMainFrame()` uit `@azure/msal-browser/redirect-bridge`.
   - Zet in `vite.config.ts` bij `build.rolldownOptions.input` zowel `index.html` als `redirect.html`, anders komt `redirect.html` niet in de build.
4. **`src/auth/msal.ts`**: een functie die `createStandardPublicClientApplication(config)` aanroept, met `cache: { cacheLocation: 'sessionStorage' }`.
5. **`src/main.tsx`**: start MSAL eerst (`await`), en toon pas daarna de app. Geen client-id? Start de app dan zonder MSAL.
6. **`src/auth/AuthProvider.tsx`**: zet `MsalProvider` om de app. Zo blijft alle MSAL-code in `src/auth/` (harde regel 5).
7. **`src/auth/useAuth.ts`**: `login()` (met `loginPopup`), `logout()`, `naam`, `isIngelogd`.
8. **`src/auth/useToken.ts`**: probeer eerst `acquireTokenSilent`. Alleen bij een `InteractionRequiredAuthError` gebruik je `acquireTokenPopup`.
9. **`src/auth/foutmelding.ts`**: vertaal foutcodes naar Nederlands. Kijk naar `error.errorCode`, niet naar `error.message` (in v5 staat daar alleen een link). Belangrijke codes: `popup_window_error` (popup geblokkeerd), `user_cancelled`, `access_denied` (geen toestemming), `no_network_connectivity`.
10. **Privacy-scherm**: uitleg wat de tool wel en niet bekijkt, en de inlogknop. **Kopbalk**: naam en Uitloggen.

**Eén eigenaardigheid:** sluit iemand het inlogvenster, dan merkt MSAL v5 dat pas na de wachttijd (standaard 60 seconden). Toon daarom tijdens het wachten een knop "Opnieuw proberen" die `overrideInteractionInProgress: true` meegeeft. Doe dat alleen na een klik, nooit automatisch.

**Controle:** je kunt inloggen en uitloggen, en je naam verschijnt. Open de ontwikkelaarstools van de browser (F12) → Application: `localStorage` is leeg.

**Vastgelopen?** Dit is de moeilijkste stap. Kijk gerust in de bestanden in `src/auth/` van het antwoordmodel, en lees het hoofdstuk "Fase 4" in `docs/leerlog.md`.

---

## Stap 14: praten met Microsoft Graph

**Doel:** functies die gegevens ophalen bij Microsoft, en die netjes omgaan met fouten.

**Wat je leert:** `fetch` met een token, `async`/`await`, en wat je doet als een server zegt "even te druk".

**Doen:**

1. **`src/graph/client.ts`**, functie `graphGet(pad, opties)`:
   - Haal een token op en doe `fetch` met de header `Authorization: Bearer <token>`.
   - Gaat het goed (`antwoord.ok`)? Geef de JSON terug.
   - Status **429** of **503**? Lees de header `Retry-After` (aantal seconden), wacht zo lang, en probeer opnieuw. Geen header? Wacht 10 seconden. Maximaal 5 pogingen.
   - Andere fout? Gooi een eigen fout `GraphFout` met de status en de foutcode uit het antwoord.
   - Geen antwoord (internet weg)? `GraphFout` met status 0.
   - Weiger alles wat niet naar `graph.microsoft.com` gaat (harde regel 4).
2. **`src/graph/drive.ts`**: `getQuota()` met `GET /me/drive?$select=quota`.
3. **`src/graph/scan.ts`**: `scanDrive()` met `GET /me/drive/root/delta?$select=...` (de velden staan in `CLAUDE.md`). Graph geeft de bestanden in **pagina's**. Zolang er een `@odata.nextLink` in het antwoord staat, haal je de volgende pagina op. Roep na elke pagina een callback aan, voor de voortgang.
4. **`src/graph/foutmelding.ts`**: 401/403 → geen toestemming; 404 → geen OneDrive gevonden; status 0 → verbinding weg.

**Testen zonder internet:** laat `graphGet` een `fetchFunctie` als optie accepteren. In je tests geef je een nep-fetch mee die vaste antwoorden teruggeeft (`vi.fn()` en `new Response(...)`). Zo test je ook een 429, die je in het echt bijna niet kunt opwekken. Laat in tests ook het wachten nep zijn, anders duurt een test 10 seconden.

**Controle:** tests voor: token meesturen, wachten bij 429, opgeven na 5 keer, foutcode doorgeven, twee pagina's volgen.

---

## Stap 15: de echte scan

**Doel:** na het inloggen wordt je eigen OneDrive gescand, met voortgang en een knop Annuleren.

**Wat je leert:** `AbortController` (een lopende actie stoppen) en `useRef` (iets onthouden zonder het scherm te verversen).

**Doen:**

1. Zet in `ScanContext` een functie `startScan()`:
   - `setScan({ status: 'bezig', bestanden: [], gelezen: 0 })`
   - quota ophalen en in `scan` zetten
   - `scanDrive` met een callback die per pagina `naarBestanden` doet en `gelezen` ophoogt
   - klaar: `status: 'klaar'`; fout: `status: 'fout'` met een melding in gewone taal
2. `annuleerScan()`: roep `abort()` aan op de `AbortController` van de lopende scan. Geef het `signal` mee aan `fetch` en aan het wachten.
3. **Let op oude scans:** start iemand een nieuwe scan terwijl de oude nog loopt, dan mag de oude niets meer veranderen. Bewaar de controller van de lopende scan in een `useRef` en controleer voor elke `setScan` of het nog dezelfde is.
4. **Scannen-scherm**: de totale opslag zodra die binnen is, het aantal gelezen bestanden, een `ProgressBar`, en Annuleren. Bij een fout: de melding en "Opnieuw proberen". Is de scan klaar, ga dan met `useEffect` + `navigate` naar het Dashboard.
5. **Privacy-scherm**: na `login()` meteen `startScan()` en naar `/scannen`.

**Controle:** log in met je eigen account. Zie je de voortgang oplopen en kom je op het Dashboard? Probeer ook Annuleren, en de wifi uit tijdens een scan.

---

## Stap 16: oude bestanden en resultaat

**Doel:** de medewerker ziet bestanden die langer dan een half jaar niet zijn gewijzigd, kiest er een paar, opent ze in OneDrive, en ziet wat dat zou schelen.

**Doen:**

1. **`src/model/opruimen.ts`** (met tests): `kiesOudeBestanden(bestanden, nu)`, `sorteerBestanden(bestanden, kolom, richting)` en `berekenBesparing(bestanden, gekozen, config)`.
   - Tip bij sorteren op naam: `a.naam.localeCompare(b.naam, 'nl', { numeric: true, sensitivity: 'base' })`. Dan komt "bestand 2" vóór "bestand 10" en maakt een hoofdletter niets uit.
2. **`ScanContext`**: een lijst `gekozen` (id's) in `useState`, en een `selectie` met de besparing (`useMemo`). Maak `gekozen` leeg bij elke nieuwe scan.
3. **`src/config/links.ts`**: de link naar de bewaarregels.
4. **Opruimen-scherm**:
   - Bovenaan een gele melding over bewaartermijnen (Archiefwet, selectielijst) met de link.
   - Een tabel met `sortable`, kolomkoppen met `sortDirection` en `onClick`, en per rij een `TableSelectionCell` (vinkje) met een eigen `aria-label`.
   - Toon 100 rijen per keer, met een knop "Meer tonen". Duizenden rijen tegelijk maken de pagina traag.
   - Onderaan: het aantal gekozen bestanden en de besparing.
5. **`BevestigDialoog.tsx`** (Fluent `Dialog`): de tool verwijdert niets. Toon de gekozen bestanden als links naar `webUrl` (nieuw tabblad), en leg uit dat verwijderen in OneDrive eerst naar de prullenbak gaat.
6. **Resultaat-scherm**: `ImpactKaart` met de besparing, en een lijst tips (bijvoorbeeld: deel een link in plaats van een bijlage).

**Woorden doen ertoe (harde regel 7):** schrijf nergens "mag weg", "overbodig" of "onnodig". Een oud bestand kan nog steeds bewaard moeten worden. De medewerker beslist zelf.

**Controle:** vink twee bestanden aan, open de dialoog, ga naar Resultaat. Klopt de besparing met de grootte van de twee bestanden?

---

## Stap 17: de harde regels bewaken met ESLint

**Doel:** `npm run lint` geeft een fout als iemand een harde regel breekt.

**Wat je leert:** een afspraak in een document vergeet je; een regel in de linter niet.

**Doen:** voeg in `eslint.config.js` extra blokken toe:

| Regel | ESLint-instelling | Voor welke map |
| --- | --- | --- |
| Geen `console` | `no-console` | `src/` |
| Geen `localStorage`, `sessionStorage`, `indexedDB` | `no-restricted-globals` | `src/` |
| Geen `document.cookie` | `no-restricted-properties` | `src/` |
| Geen `fetch` | `no-restricted-globals` | `src/`, behalve `src/graph/` |
| Geen MSAL of TeamsJS | `no-restricted-imports` | `src/`, behalve `src/auth/` |
| Geen React of netwerk | `no-restricted-imports` | `src/model/` |

Geef bij elke regel een `message` mee die uitlegt welke harde regel het is.

**Controle:** zet tijdelijk `localStorage.setItem('x', 'y')` in een scherm. Geeft `npm run lint` jouw melding? Haal het daarna weer weg.

---

## Stap 18: afwerking

**Doel:** de tool werkt voor iedereen, ook in rare situaties.

**Toegankelijkheid:**

- [ ] Kun je alles bedienen met alleen Tab, Enter en de spatiebalk? Probeer het, zonder muis.
- [ ] Zie je altijd waar de focus is? In de blauwe kopbalk valt de standaardrand weg: geef links daar een witte `outline` bij `:focus-visible`.
- [ ] Een link "Naar de inhoud" als eerste Tab-stop.
- [ ] Een eigen titel in het tabblad per scherm (`document.title`).
- [ ] Elke knop en elk vinkje heeft een tekst of `aria-label`.
- [ ] Voortgang en selectie in een `role="status"`, zodat een schermlezer ze voorleest.

**Randgevallen** (test ze alle vier):

- [ ] Een lege OneDrive: geen lege grafiek, geen "0 bytes van 0 bytes".
- [ ] Eén bestand: "1 bestand", niet "1 bestanden".
- [ ] Heel veel bestanden: schrijf een test met 100.000 bestanden voor `maakAnalyse`.
- [ ] Een bestand zonder grootte: telt mee als 0 bytes.

**Smal scherm:**

- [ ] Open de ontwikkelaarstools (F12), klik op het telefoon-icoon en kies een breedte van 400 px. Moet je ergens horizontaal scrollen? Dan is iets te breed.

**README.md:** schrijf wat de tool doet, hoe je hem start en hoe je `.env` invult.

**Klaar!** Vergelijk je project nu eens met het antwoordmodel. Wat heb jij anders gedaan? Is jouw manier duidelijker, of juist niet?

---

## Problemen die wij tegenkwamen

| Probleem | Oorzaak | Oplossing |
| --- | --- | --- |
| `npm install` geeft `ERESOLVE` met `typescript-eslint` | Het template gebruikt TypeScript 7; `typescript-eslint` ondersteunt nog alleen versies onder 6.1 | `npm install -D typescript@~6.0` |
| Template heeft `oxlint` in plaats van ESLint | Nieuwer Vite-template | `oxlint` verwijderen, ESLint installeren |
| `scanContext.ts` en `ScanContext.tsx` raken in de war | Windows ziet geen verschil tussen hoofdletters en kleine letters | Geef het een andere naam: `scanContextWaarde.ts` |
| Typefout bij `borderColor` in `makeStyles` | Fluent (Griffel) staat verkorte CSS-eigenschappen niet toe | `...shorthands.borderColor(...)` |
| Grafiekkleur werkt niet | Recharts zet `fill` als SVG-attribuut | Kleur via CSS-klasse |
| Balk in de grafiek te kort op een screenshot | Groei-animatie van Recharts | `isAnimationActive={false}` |
| "redirect_uri is not valid" bij inloggen | Adres niet geregistreerd, of onder platform "Web" | `http://localhost:5173/redirect.html` onder **Single-page application** |
| Inlogknop blijft grijs na het invullen van `.env` | Vite leest `.env` bij het starten | Pagina herladen, of `npm run dev` opnieuw starten |
| Inlogvenster gesloten, maar app blijft wachten | MSAL v5 kan een gesloten popup niet zien | Knop "Opnieuw proberen" met `overrideInteractionInProgress: true` |
| Na F5 zijn de gegevens weg | Zo hoort het: we bewaren niets (harde regel 3) | Niets doen |

---

## Woordenlijst

| Woord | Betekenis |
| --- | --- |
| **Component** | Een functie die een stukje scherm teruggeeft, bijvoorbeeld een kaart of een knop. |
| **Props** | Gegevens die je aan een component meegeeft, zoals `<ImpactKaart titel="Prullenbak" />`. |
| **State** | Wat een component onthoudt. Verandert de state, dan tekent React het scherm opnieuw. |
| **Hook** | Een React-functie die met `use` begint (`useState`, `useMemo`, `useScan`). Alleen te gebruiken bovenin een component. |
| **Context** | Een manier om gegevens te delen met alle componenten binnen een provider. |
| **Route** | De koppeling tussen een adres (`#/dashboard`) en een scherm. |
| **Pure functie** | Een functie die alleen met haar invoer rekent en verder niets verandert. Makkelijk te testen. |
| **Test** | Code die controleert of andere code doet wat je verwacht. |
| **Token** | Een tijdelijk "toegangspasje" van Microsoft, waarmee de app namens jou gegevens mag ophalen. |
| **Scope** | Waar het token voor geldt, bijvoorbeeld `Files.Read`: alleen bestanden lezen. |
| **MSAL** | De bibliotheek van Microsoft voor inloggen. |
| **Microsoft Graph** | De "voordeur" van Microsoft 365 voor apps: via Graph vraag je bestanden, agenda's en meer op. |
| **Delta** | Een Graph-aanroep die alle bestanden in alle mappen teruggeeft, verdeeld over pagina's. |
| **429** | HTTP-code voor "te veel verzoeken, wacht even". |
| **Linter** | Een programma (bij ons ESLint) dat je code controleert op fouten en afspraken. |
| **Build** | Je code omzetten naar bestanden die de browser snel kan laden (map `dist/`). |
| **Bandbreedte** | Bij ons: een uitkomst als "van ... tot ...", omdat we de precieze waarde niet weten. |
