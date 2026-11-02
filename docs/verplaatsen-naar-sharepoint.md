# Verplaatsen naar SharePoint: zo bouw je het in het echte project

In dit oefenproject is de feature af (fase 10 in `docs/leerlog.md`). Dit document zegt wat je moet regelen en in welke volgorde je bouwt als je hem naar het echte project haalt.

## Wat de feature doet

Twee tabellen naast elkaar. Links staat je eigen OneDrive en rechts de SharePoint van een team waar je lid van bent. In beide tabellen open je mappen en ga je terug via het kruimelpad. Je sleept een bestand van links naar rechts, of je vinkt bestanden aan en klikt op de knop. Een dialoog legt uit wat er gebeurt. Na je bevestiging staat het bestand in SharePoint en gaat het origineel naar de prullenbak van je OneDrive.

## 1. Eerst regelen (voordat je code schrijft)

Dit is het belangrijkste deel. Zonder deze stappen werkt de feature in het echte project niet.

| Wat | Wie | Waarom |
| --- | --- | --- |
| Beslissen dat de tool mag schrijven | Team en opdrachtgever | De harde regels zeggen nu: alleen lezen, nooit `Files.Read.All` of `Sites.*`. Deze feature heeft `Files.ReadWrite.All` nodig. Leg de beslissing vast in CLAUDE.md, zoals in dit oefenproject. |
| Toestemming van de IT-beheerder (admin consent) | IT van de gemeente | Met `Files.ReadWrite.All` kan de app alles aanpassen waar de medewerker bij kan. Bijna elke organisatie laat dat alleen toe na een goedkeuring door de beheerder. |
| Privacy-check (DPIA of een korte toets) | Privacy officer van de gemeente | De tool ziet nu ook namen en mappen van teamgenoten in SharePoint. |
| API-rechten in de app-registratie | Wie de app-registratie beheert | Microsoft Graph, Delegated: `Team.ReadBasic.All` en `Files.ReadWrite.All` toevoegen. |
| Een testomgeving | Team | Test nooit op echte gemeentebestanden. Gebruik een Microsoft 365-developer-tenant met een paar teams en verzonnen bestanden. |

**Alternatief om aan IT voor te leggen:** `Sites.Selected`. Daarmee geeft de beheerder per site toegang, in plaats van tot alles. Dat is veiliger, maar elke nieuwe teamsite moet de beheerder dan apart vrijgeven. Bespreek beide opties.

## 2. Welke Graph-aanroepen

| Doel | Aanroep | Bestand |
| --- | --- | --- |
| Hoofdmap van je OneDrive (en het drive-id) | `GET /me/drive/root?$select=id,parentReference,webUrl` | `graph/mappen.ts` |
| Je teams | `GET /me/joinedTeams?$select=id,displayName` | `graph/teams.ts` |
| Hoofdmap van de SharePoint van een team | `GET /groups/{team-id}/drive/root?$select=id,parentReference,webUrl` | `graph/mappen.ts` |
| Wat er in een map staat | `GET /drives/{drive-id}/items/{map-id}/children?$select=...&$top=200` | `graph/mappen.ts` |
| Bestaat de naam al in de doelmap? | `GET /drives/{drive-id}/items/{map-id}:/{naam}?$select=id` (404 = nee) | `graph/verplaatsen.ts` |
| Kopiëren | `POST /drives/{drive-id}/items/{id}/copy?@microsoft.graph.conflictBehavior=fail` → 202 | `graph/verplaatsen.ts` |
| Origineel naar de prullenbak | `DELETE /drives/{drive-id}/items/{id}` → 204 | `graph/verplaatsen.ts` |

**Waarom kopiëren en verwijderen, en niet gewoon verplaatsen?** Graph kan een bestand niet in één keer naar een andere drive verplaatsen. Je OneDrive en de SharePoint van een team zijn twee verschillende drives.

## 3. Bouwvolgorde

Bouw van onder naar boven, net als de andere fasen. Na elke stap draai je `npm test`.

1. **Model** (`model/types.ts`, `model/mappen.ts` met tests): `MapItem`, `Opslagplek`, `Team`, `VerplaatsResultaat`, en pure functies om om te zetten, te sorteren en dubbele namen te vinden. Dit kun je bouwen zonder rechten.
2. **Graph-client** (`graph/client.ts`): naast `graphGet` ook `graphPost` en `graphDelete`. De wachtlogica voor 429/503 staat dan op één plek (`stuurVerzoek`).
3. **Graph-functies** (`graph/mappen.ts`, `graph/teams.ts`, `graph/verplaatsen.ts`) met tests die een nep-fetch gebruiken. Test vooral de volgorde in `verplaatsBestand`: eerst kopiëren, dan wachten, en pas dan verwijderen.
4. **Foutmeldingen** (`graph/foutmelding.ts`): elke melding zegt waar het bestand nu staat.
5. **Rechten** (`config/env.ts`, `auth/useToken.ts`): `scopesVerplaatsen` als aparte lijst, en `useToken(scopesVerplaatsen)`.
6. **Bron** (`state/opslagBron.ts`, `demo/voorbeeldOpslag.ts`): één interface met een echte versie en een voorbeeldversie.
7. **Hooks** (`state/useMapVenster.ts`, `state/useVerplaatsen.ts`).
8. **Scherm** (`pages/Verplaatsen/`), route, kopbalk en paginatitel.
9. **Controle**: build, test, lint, en het scherm met voorbeelddata in de browser.
10. **Pas daarna**: testen met een echt account in de testtenant (zie stap 5 hieronder).

## 4. Valkuilen die we in het oefenproject tegenkwamen

- **De monitor-URL valt buiten Graph.** Na een kopie geeft Graph een adres terug waar je de voortgang kunt volgen. Dat adres staat op een server van SharePoint, niet op `graph.microsoft.com`. Dat botst met harde regel 4, met de controle in `graphGet()` en later met de Content-Security-Policy. Wij kijken daarom om de 3 seconden in de doelmap of de kopie er al staat (maximaal 2 minuten). Wil het team toch de monitor-URL gebruiken, dan moeten regel 4 en de CSP aangepast worden. Neem dat dan op in de beslissing.
- **Controleer de naam vóór het kopiëren.** Staat er in de doelmap al een bestand met dezelfde naam, dan mislukt de kopie op de achtergrond. Bij het kijken "staat de kopie er al?" zou je dan het bestand van een collega vinden en je origineel verwijderen. Daarom stopt `verplaatsBestand` meteen als de naam bezet is. SharePoint ziet hoofdletters niet als verschil.
- **Vergelijk de grootte niet.** SharePoint past Office-bestanden soms een beetje aan (eigenschappen), waardoor de kopie een paar bytes anders kan zijn. Wij kijken alleen óf de kopie er staat.
- **Wat er verloren gaat.** De versiegeschiedenis gaat niet mee, gedeelde links werken niet meer, en "gemaakt door" verandert. Dat staat in de dialoog. Laat de opdrachtgever dit vooraf weten.
- **Grote bestanden.** Een video van een paar GB kan langer dan 2 minuten kopiëren. Dan meldt de tool "het kopiëren duurt lang" en blijft het origineel staan. Dat is veilig, maar de medewerker moet daarna zelf in OneDrive opruimen.
- **Persoonlijke Microsoft-accounts hebben geen teams.** `/me/joinedTeams` werkt alleen met werk- of schoolaccounts.
- **`useToken` en nieuwe arrays.** Geef altijd een vaste lijst uit `config/env.ts` mee. Een nieuwe array bij elke render maakt elke keer een nieuwe functie, en dan haalt de bron alles opnieuw op.
- **Slepen is niet genoeg.** Niet iedereen kan slepen (toetsenbord, schermlezer). De knop "Verplaatsen naar ..." doet hetzelfde, en voor de gemeente is dat verplicht (WCAG).
- **Teams (fase 9).** In Teams loopt het inloggen via nested app authentication. De extra scopes gaan op dezelfde manier, maar de toestemmingspopup ziet er anders uit. Test het daar apart.

## 5. Testen met een echt account (testtenant)

1. Maak in de developer-tenant twee teams aan, en zet in één team een bestand `Plan.docx` in de map Projecten.
2. Zet in je eigen OneDrive een `Plan.docx` en een paar andere bestanden.
3. Klik op **Verbinden met SharePoint**. Je krijgt een toestemmingsvenster met de nieuwe rechten. Klik je dat weg, dan moet je een duidelijke melding zien.
4. Verplaats een klein bestand. Controleer in SharePoint dat het er staat, en in de prullenbak van je OneDrive dat het origineel daar staat.
5. Verplaats `Plan.docx` naar Projecten: de dialoog moet zeggen dat het bestand wordt overgeslagen.
6. Probeer het in een team waar je alleen leesrecht hebt: je moet de melding "geen bestanden zetten" krijgen, en er mag niets veranderd zijn.
7. Open een bestand in Word en verplaats het tegelijk: je moet een melding over een geopend bestand krijgen.
8. Kijk in de netwerktab van de browser: alleen verzoeken naar `graph.microsoft.com` en `login.microsoftonline.com`.

## 6. Wat (nog) niet kan

- Mappen verplaatsen (alleen bestanden).
- Terug van SharePoint naar OneDrive.
- Loslaten op een submap in de rechtertabel. Je laat los in de map die open is.
- Annuleren tijdens het verplaatsen.
- Sites die geen team zijn (bijvoorbeeld een losse SharePoint-communicatiesite). Daarvoor heb je `Sites.Read.All` of `Sites.Selected` nodig.
