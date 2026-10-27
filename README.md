# KlimaatImpactTool

Een webapp die laat zien hoeveel stroom en CO₂-uitstoot de opslag in je eigen OneDrive ongeveer kost, en die helpt om oude bestanden terug te vinden. Gemaakt door een studententeam van de HvA voor de Gemeente Amsterdam.

## Wat de tool doet

1. Je logt in met je Microsoft-account (alleen leesrechten: `User.Read` en `Files.Read`).
2. De tool leest de **gegevens over** je bestanden: naam, grootte, datum van laatste wijziging en map. Nooit de inhoud, en niet met wie je deelt.
3. De tool rekent de opslag om naar kWh en kg CO₂ per jaar. Omdat de factoren onzeker zijn, altijd als bandbreedte: "van ... tot ...". Zie het scherm "Zo rekenen we" en [docs/rekenmodel.md](docs/rekenmodel.md).
4. Je ziet je grootste bestanden, opslag per soort en per map, en bestanden die langer dan een half jaar niet zijn gewijzigd.
5. Je kunt oude bestanden kiezen en openen in OneDrive. De tool zelf verwijdert niets. Bij oude bestanden verwijst de tool naar de bewaarregels (Archiefwet, selectielijst).

**Privacy:** er is geen server en geen database. Alles gebeurt in je browser. Het scanresultaat staat alleen in het geheugen; sluit je het tabblad, dan is het weg. De tool praat alleen met `login.microsoftonline.com` en `graph.microsoft.com`.

Zonder in te loggen kun je de tool bekijken met **voorbeelddata** (verzonnen bestanden).

## Lokaal starten

Je hebt [Node.js](https://nodejs.org/) LTS nodig (`node -v` werkt in de terminal).

```bash
npm install        # één keer: packages installeren
npm run dev        # start op http://localhost:5173
```

Overige scripts:

| Script | Wat het doet |
| --- | --- |
| `npm run build` | Controleert de types en maakt de productieversie in `dist/` |
| `npm test` | Draait de tests (Vitest) |
| `npm run lint` | Controleert de code met ESLint, ook op de privacy- en laagregels uit `CLAUDE.md` |

## `.env` invullen

Om echt in te loggen heeft de app het client-id van een app-registratie nodig.

1. Maak in [Microsoft Entra](https://entra.microsoft.com) een app-registratie (App registrations, New registration):
   - Supported account types: accounts in elke organisatie en persoonlijke Microsoft-accounts.
   - Redirect URI: platform **Single-page application**, adres **`http://localhost:5173/redirect.html`**.
     Let op: met `/redirect.html` erachter. MSAL v5 stuurt het inlogvenster naar die aparte pagina.
   - API permissions: Microsoft Graph, Delegated, `User.Read` en `Files.Read`.
2. Kopieer `.env.example` naar `.env`.
3. Vul het Application (client) ID in:

   ```
   VITE_CLIENT_ID=00000000-0000-0000-0000-000000000000
   ```

4. Start `npm run dev` opnieuw (Vite leest `.env` alleen bij het starten).

Het client-id is niet geheim, maar `.env` staat wel in `.gitignore`, zodat iedereen zijn eigen registratie kan gebruiken.

## Hoe de code in elkaar zit

```
src/
  model/       pure functies: rekenmodel, analyse, opmaak (geen React, geen netwerk)
  graph/       de enige plek die met Microsoft Graph praat
  auth/        de enige plek die MSAL.js (en later TeamsJS) gebruikt
  state/       ScanContext: scanresultaat en selectie, alleen in het geheugen
  components/  onderdelen die op meer schermen staan
  pages/       één map per scherm
  demo/        verzonnen voorbeelddata
```

Meer uitleg per bouwfase staat in [docs/leerlog.md](docs/leerlog.md). De afspraken staan in [CLAUDE.md](CLAUDE.md).
