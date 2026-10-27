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
