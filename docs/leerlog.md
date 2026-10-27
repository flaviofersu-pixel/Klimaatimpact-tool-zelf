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
