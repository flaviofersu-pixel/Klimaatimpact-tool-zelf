# Architectuur (samenvatting)

De volledige onderbouwing staat in het Claude Doc "Architectuur KlimaatImpactTool v1". Dit is de korte versie voor in de repo.

- De app is een statische single-page app (Vite + React). Er is geen backend en geen database.
- Lagen, van onder naar boven:
  - `src/model/`: pure functies (rekenmodel, analyse). Geen React, geen netwerk.
  - `src/graph/`: de enige plek die met Microsoft Graph praat.
  - `src/auth/`: de enige plek die MSAL.js en TeamsJS gebruikt.
  - `src/state/`: `ScanContext` houdt het scanresultaat alleen in het geheugen.
  - `src/pages/` en `src/components/`: de schermen. Die roepen nooit zelf `fetch` aan.
- Routes zijn hash-routes (`#/dashboard`), zodat de statische host geen serverregels nodig heeft.

## Verplaatsen naar SharePoint (fase 10)

Dezelfde lagen, met één extra idee: een **bron**. Het scherm praat met een `OpslagBron` en weet niet of daarachter Microsoft Graph zit of de voorbeelddata.

```
pages/Verplaatsen/          Verplaatsen.tsx, MapVenster.tsx (2x), VerplaatsDialoog.tsx
        |
state/useVerplaatsen.ts     verbinden, team kiezen, verplaatsen (één voor één)
state/useMapVenster.ts      per tabel: plek, kruimelpad, inhoud van de open map
        |
state/opslagBron.ts  ---- of ----  demo/voorbeeldOpslag.ts
  maakGraphBron()                    maakVoorbeeldBron()  (alles in het geheugen)
        |
graph/mappen.ts, graph/teams.ts, graph/verplaatsen.ts
        |
model/mappen.ts             pure functies: omzetten, sorteren, dubbele namen
```

Rechten: `Team.ReadBasic.All` en `Files.ReadWrite.All`, pas gevraagd bij "Verbinden met SharePoint". Uitleg en afwegingen: `docs/verplaatsen-naar-sharepoint.md`.
