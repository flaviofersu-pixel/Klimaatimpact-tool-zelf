# Bouwprompts KlimaatImpactTool v1

Met deze prompts bouwt Claude in VS Code de hele tool in negen fasen. Elke fase levert iets op dat je kunt starten en bekijken. Door de leerafspraken in CLAUDE.md maakt Claude eerst een plan, legt het daarna in `docs/leerlog.md` uit wat het heeft gedaan, en geeft het je een kleine oefening.

## Zo gebruik je dit

1. Zorg dat de nieuwste `CLAUDE.md` in de hoofdmap van je project staat.
2. Plak één fase per keer. Begin bij elke fase een nieuwe chat, dan blijft Claude scherp.
3. Lees het plan, zeg "akkoord" of stuur bij.
4. Na afloop: start de app (`npm run dev`), kijk of het werkt, lees het leerlog en doe de oefening. Commit pas daarna.
5. Snap je iets niet, vraag dan: "Leg regel X tot Y in bestand Z uit alsof ik net begin met React."

## Wat je zelf vooraf regelt

Dit kan Claude niet voor je doen, omdat het in een portal of in Figma gebeurt.

- **Node.js LTS** geïnstalleerd (`node -v` werkt in de terminal).
- **Schermontwerpen:** exporteer de 10 frames uit Figma als PNG naar `docs/ontwerp/`, met namen als `04-dashboard.png`.
- **App-registratie (voor fase 4):** ga naar de Entra-portal (entra.microsoft.com), App registrations, New registration.
  - Supported account types: accounts in elke organisatie en persoonlijke Microsoft-accounts.
  - Redirect URI: platform Single-page application, `http://localhost:5173`.
  - API permissions: Microsoft Graph, Delegated, `User.Read` en `Files.Read`.
  - Kopieer de Application (client) ID naar `.env` als `VITE_CLIENT_ID=...`.
  - Lukt inloggen in de portal niet met je HvA-account, gebruik dan het account van Azure for Students of je persoonlijke account.

---

## Fase 1: Projectopzet

Sla over als je de eerste opdracht al hebt gedaan.

```
Lees CLAUDE.md. Zet in deze map het project op volgens de techstack en de mappenstructuur:
Vite met het template react-ts, alle packages, alle mappen en bestanden met een commentaarregel
bovenaan, een simpele component per scherm die alleen de titel toont, hash-routes in routes.tsx,
FluentProvider met webLightTheme, .env.example en .gitignore (met .env). Zet Vitest en ESLint op.
Volg de leerafspraken.
```

## Fase 2: Rekenmodel en analyse

```
Lees CLAUDE.md. Bouw de pure functies in src/model/, zonder React en zonder netwerk:
1. config.ts met de voorlopige waarden en hun bron.
2. rekenmodel.ts: berekenImpact(bytes, config) volgens de formule, met laag en hoog.
3. naarBestand.ts: DriveItem naar Bestand. Sla mappen en verwijderde items over. Bepaal soort uit
   de extensie (Word, Excel, PowerPoint, pdf, afbeelding, video, anders overig). gewijzigdOp komt uit
   fileSystemInfo.lastModifiedDateTime, anders lastModifiedDateTime.
4. analyse.ts: maakAnalyse(bestanden, quota, config, nu). Groepen per leeftijd (minder dan 6 maanden,
   6 tot 12 maanden, meer dan een jaar), per soort en per map, plus de grootste bestanden.
   Geef "nu" mee als parameter, zodat de tests altijd hetzelfde uitkomen.
Schrijf Vitest-tests voor alles, met de controletest van 250 GB. Volg de leerafspraken.
```

## Fase 3: Voorbeelddata en de inzichtschermen

```
Lees CLAUDE.md en bekijk de ontwerpen in docs/ontwerp/.
1. Maak src/demo/voorbeeldData.ts met ongeveer 300 verzonnen DriveItems in een paar mappen,
   verdeeld over soorten en leeftijden, met een paar grote video's. Geen echte namen van personen.
2. Maak src/state/ScanContext.tsx: houdt ScanResultaat en Analyse in React-state, niets in storage.
   Voeg een functie laadVoorbeelddata() toe.
3. Zet op het Welkom-scherm een knop "Bekijk met voorbeelddata". Toon daarna overal een duidelijke
   melding "Je bekijkt voorbeelddata".
4. Bouw de schermen Dashboard, Zo rekenen we, Grootste bestanden en soorten, en Bestanden per map
   met Fluent UI en Recharts, zo dicht mogelijk bij de ontwerpen. Toon kWh en CO2 altijd als
   bandbreedte (van ... tot ...).
5. Maak de gedeelde onderdelen in components/ (Kopbalk, ImpactKaart, LeeftijdKaart, BestandenTabel,
   SoortenGrafiek).
Volg de leerafspraken.
```

## Fase 4: Inloggen in de browser

```
Lees CLAUDE.md. Bouw het inloggen voor de browser met MSAL.js versie 5:
1. src/config/env.ts leest VITE_CLIENT_ID. Geef een duidelijke melding als die ontbreekt.
2. src/auth/msal.ts met createStandardPublicClientApplication, authority common, cache in
   sessionStorage. Houd al rekening met Teams (createNestablePublicClientApplication), maar gebruik
   dat nog niet.
3. src/auth/useToken.ts: eerst acquireTokenSilent, anders acquireTokenPopup, met scopes User.Read en
   Files.Read.
4. Zet MsalProvider in App.tsx. Op het Privacy-scherm komt de knop "Inloggen en mijn OneDrive
   berekenen". Na inloggen toon je de naam van de gebruiker in de Kopbalk, met een knop Uitloggen.
5. Toon begrijpelijke foutmeldingen: popup geblokkeerd, toestemming geweigerd, geen internet.
Gebruik alleen de officiële v5-documentatie. Volg de leerafspraken.
```

## Fase 5: De echte scan via Microsoft Graph

```
Lees CLAUDE.md. Koppel de echte OneDrive:
1. src/graph/client.ts: een functie die fetch doet met het token, bij 429 en 503 wacht op
   Retry-After (met een standaardwaarde als de header ontbreekt) en andere fouten netjes doorgeeft.
2. src/graph/drive.ts: getQuota().
3. src/graph/scan.ts: scanDrive() met delta en de $select uit CLAUDE.md, pagina voor pagina via
   @odata.nextLink, met een callback na elke pagina.
4. Het Scannen-scherm toont de totale opslag zodra die binnen is, een voortgangsbalk met het aantal
   gelezen bestanden, en een knop Annuleren.
5. Na de scan maakt ScanContext de Analyse en gaat de app naar het Dashboard.
6. Foutmeldingen in gewone taal: geen OneDrive, geen toestemming, verbinding weg, scan geannuleerd.
Test met een eigen account. Laat de voorbeelddata-knop werken zoals in fase 3. Volg de leerafspraken.
```

## Fase 6: Opruimen en resultaat

```
Lees CLAUDE.md, ook de open beslissing over verwijderen. Is die nog open, bouw dan de versie met
alleen lezen.
1. Opruimen-scherm: lijst met bestanden ouder dan een half jaar, te sorteren en te selecteren.
   Bovenaan een melding dat er bewaartermijnen gelden, met een link naar de regels. Gebruik nergens
   woorden als "mag weg" of "overbodig".
2. BevestigDialoog (Fluent Dialog): legt uit wat de medewerker gaat doen. Bij alleen lezen: de
   geselecteerde bestanden openen in OneDrive via webUrl, en uitleg dat verwijderen in OneDrive naar
   de prullenbak gaat.
3. Resultaat-scherm: de mogelijke besparing van de selectie als bandbreedte (kWh en CO2 per jaar),
   plus tips, zoals een link delen in plaats van een bijlage mailen.
4. Houd de selectie in ScanContext (Opruimselectie).
Volg de leerafspraken.
```

## Fase 7: Kwaliteit en privacy-check

```
Lees CLAUDE.md. Loop het hele project na en verbeter wat nodig is:
1. Privacy: zoek naar localStorage, IndexedDB, cookies, console.log met gegevens, en URL's buiten
   Microsoft. Maak een lijst van wat je vond en wat je hebt aangepast.
2. Laagindeling: roept een scherm ergens zelf fetch aan, of gebruikt iets buiten src/auth/ MSAL?
3. Toegankelijkheid: alles met het toetsenbord te bedienen, zichtbare focus, labels bij knoppen,
   grafieken met een tekstalternatief.
4. Randgevallen: lege OneDrive, één bestand, heel veel bestanden, bestanden zonder grootte.
5. Werkt het op een smal scherm (400 px breed)?
6. Schrijf README.md: wat de tool doet, hoe je hem lokaal start, en hoe je .env invult.
Volg de leerafspraken.
```

## Fase 8: Publiceren op Azure Static Web Apps

```
Lees CLAUDE.md. Maak het project klaar om te publiceren:
1. public/staticwebapp.config.json met navigationFallback en een Content-Security-Policy die alleen
   'self', login.microsoftonline.com en graph.microsoft.com toestaat. Fluent UI heeft
   style-src 'unsafe-inline' nodig. Zet frame-ancestors al klaar voor Teams.
2. .gitlab-ci.yml volgens de Microsoft-handleiding "Deploy to Azure Static Web Apps with GitLab",
   met OUTPUT_PATH dist en API_TOKEN uit de CI/CD-variabele DEPLOYMENT_TOKEN. Alleen op main.
3. Schrijf in docs/publiceren.md stap voor stap wat ik zelf in de Azure-portal en in GitLab moet
   doen: Static Web App aanmaken (Free, bron "Other"), deployment token kopiëren, variabele in
   GitLab zetten, en de nieuwe URL als redirect-URI toevoegen aan de app-registratie.
Volg de leerafspraken.
```

## Fase 9: De Teams-laag

Doe deze fase pas als jullie een tenant hebben waar je eigen apps mag uploaden (zie het advies over de testomgeving).

```
Lees CLAUDE.md. Maak de app geschikt als personal tab in Teams:
1. src/auth/teams.ts: isInTeams() met een korte timeout, en het Teams-thema ophalen.
2. main.tsx: eerst isInTeams(). In Teams gebruikt msal.ts createNestablePublicClientApplication.
3. styles/theme.ts: kies teamsLightTheme, teamsDarkTheme of teamsHighContrastTheme op basis van het
   Teams-thema, en laat de app meeveranderen als het thema wijzigt.
4. appPackage/manifest.json met één static tab (scope personal), contentUrl en validDomains voor onze
   Static Web Apps-URL, plus de twee iconen (192 x 192 en 32 x 32).
5. Schrijf in docs/teams.md wat ik zelf moet doen: de redirect-URI brk-multihub://<ons-domein>
   toevoegen, het zip-bestand maken en uploaden in Teams, en wat ik moet testen.
Gebruik alleen de officiële documentatie van TeamsJS en nested app authentication. Volg de
leerafspraken.
```

---

## Na de laatste fase

Je hebt dan een werkende versie 1 en een leerlog met negen hoofdstukken. Een goede manier om te checken of je het snapt: kies een klein onderdeel, bijvoorbeeld een extra leeftijdsgroep "meer dan 3 jaar", en bouw het zelf zonder Claude. Laat Claude daarna alleen je code nakijken.
