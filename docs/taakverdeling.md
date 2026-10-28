# Taakverdeling KlimaatImpactTool

Dit is de werkverdeling voor ons team van vijf: **2 full-stack developers** en **3 business engineers**. We hebben nog **7 weken**: de laatste week van sprint 2, en daarna sprint 3 en sprint 4 van elk 3 weken. Alle taken staan hieronder als issues, met per issue de week waarin het af moet zijn. Kopieer ze naar GitLab, kies wie wat doet, en ga aan de slag.

De taken van de business engineers zijn zo geschreven dat je **geen programmeerervaring** nodig hebt. Waar je toch iets in de code verandert, staat precies hoe, en kijkt een developer mee.

---

## Inhoud

- [Wie is wie](#wie-is-wie)
- [Hoe we werken](#hoe-we-werken)
- [Planning: 7 weken](#planning-7-weken)
- [Overzicht per persoon](#overzicht-per-persoon)
- [Week 1 (rest van sprint 2): fundament](#week-1-rest-van-sprint-2-fundament)
- [Sprint 3 (week 2 t/m 4): inzicht en inloggen](#sprint-3-week-2-tm-4-inzicht-en-inloggen)
- [Sprint 4 (week 5 t/m 7): echte scan, opruimen en oplevering](#sprint-4-week-5-tm-7-echte-scan-opruimen-en-oplevering)
- [Als het krap wordt](#als-het-krap-wordt)
- [Later (backlog)](#later-backlog)
- [Voor business engineers: je eerste wijziging in de code](#voor-business-engineers-je-eerste-wijziging-in-de-code)
- [Zo zet je dit in GitLab](#zo-zet-je-dit-in-gitlab)

---

## Wie is wie

Vul de namen in. In de rest van dit document gebruiken we de afkortingen.

| Afkorting | Rol | Naam | Focus |
| --- | --- | --- | --- |
| **FS-A** | Full-stack developer | ... | Projectopzet, schermen en layout, inloggen, Opruimen |
| **FS-B** | Full-stack developer | ... | Rekenmodel, voorbeelddata, Graph, de scan, grafiek |
| **BE-1** | Business engineer | ... | Ontwerp en teksten, testplan en testen |
| **BE-2** | Business engineer | ... | Rekenmodel en bronnen, voorbeelddata, Entra, toegankelijkheid |
| **BE-3** | Business engineer | ... | Privacy en bewaarregels, contact met de opdrachtgever, gebruikerstest |

**Koppels:** elke business engineer heeft een vaste developer als maatje. Zit je vast, vraag het dan eerst je maatje.

| Business engineer | Maatje |
| --- | --- |
| BE-1 | FS-A |
| BE-2 | FS-B |
| BE-3 | FS-A |

---

## Hoe we werken

### Afspraken

1. **Eén issue = één branch = één merge request.** Noem de branch naar het issue, bijvoorbeeld `kit-05-rekenmodel`.
2. **Nooit direct op `main`.** Alles gaat via een merge request (MR).
3. **Elke MR krijgt een review.** Wijzigingen in `src/auth/`, `src/graph/` of `src/model/` reviewt de andere developer. Wijzigingen van een business engineer reviewt zijn of haar maatje.
4. **Vragen stellen mag altijd.** Zit je langer dan 30 minuten vast, vraag dan hulp. Dat is geen falen, dat is slim werken.
5. **De harde regels uit `CLAUDE.md` gelden voor iedereen**, ook voor teksten. Bijvoorbeeld: de tool zegt nooit dat een bestand "weg mag".

### Wanneer is een issue klaar? (Definition of Done)

- [ ] Alles uit "Klaar als" is gedaan.
- [ ] Bij code: `npm run build`, `npm test` en `npm run lint` geven geen fouten.
- [ ] De MR is goedgekeurd en samengevoegd met `main`.
- [ ] Bij een code-issue van een developer: een kort stukje in `docs/leerlog.md` (wat, waarom, hoe het werkt), zodat de business engineers mee kunnen leren.

### Moeite

| Label | Betekent ongeveer |
| --- | --- |
| **S** | Een paar uur |
| **M** | Een dag |
| **L** | Twee tot drie dagen |

### Handige documenten

- [`CLAUDE.md`](../CLAUDE.md): de afspraken en harde regels.
- [`docs/zelf-bouwen.md`](zelf-bouwen.md): stap-voor-stap bouwhandleiding. Developer-issues verwijzen naar de stap daar.
- Het project `klimaatimpact-tool-finish`: het **antwoordmodel**. Kijk daar als je vastzit.

---

## Planning: 7 weken

| Week | Blok | Aan het eind van de week... |
| --- | --- | --- |
| **1** | Rest van sprint 2 | Iedereen kan de app starten. Project opgezet, rekenmodel en tests klaar. Entra-registratie gedaan. Vragen aan de opdrachtgever gesteld. |
| **2** | Sprint 3 | Analyse klaar. Voorbeelddata en de eerste schermen werken. |
| **3** | Sprint 3 | Alle inzichtschermen met voorbeelddata, met de echte teksten en de grafiek. Testplan in concept. |
| **4** | Sprint 3 | **Inloggen werkt.** De Graph-laag is klaar en getest. Privacytekst goedgekeurd. **Sprintdemo:** voorbeelddata + inloggen. |
| **5** | Sprint 4 | **De echte scan van je eigen OneDrive werkt.** Begin aan Oude bestanden en Resultaat. |
| **6** | Sprint 4 | Oude bestanden en Resultaat klaar. Gebruikerstest en toegankelijkheidscheck gedaan. Begin met testen volgens het testplan. |
| **7** | Sprint 4 | Bugs opgelost, README klaar, **demo voor de opdrachtgever.** Geen nieuwe functies meer in deze week. |

**Twee mijlpalen om niet te missen:**
- **Einde week 4:** inloggen werkt. Lukt dat niet, dan schuift de echte scan en komt de oplevering in gevaar. Vraag dan meteen hulp.
- **Einde week 6:** alles is gebouwd. Week 7 is alleen voor testen, repareren en de demo.

---

## Overzicht per persoon

| | Week 1 | Sprint 3 (week 2 t/m 4) | Sprint 4 (week 5 t/m 7) |
| --- | --- | --- | --- |
| **FS-A** | KIT-03, KIT-04 | KIT-12 (wk 2), KIT-15 (wk 2–3), KIT-22 (wk 3–4) | KIT-28 (wk 5–6), KIT-32 (wk 7) |
| **FS-B** | KIT-05, KIT-06 | KIT-13 (wk 2), KIT-14, KIT-18 (wk 3), KIT-23 (wk 3–4) | KIT-24 (wk 5), KIT-29 (wk 5–6), KIT-32 (wk 7) |
| **BE-1** | KIT-01, KIT-02, KIT-07, KIT-10, start KIT-11 | KIT-11 (t/m wk 3), KIT-16 (wk 3–4), KIT-26 (wk 3–4) | KIT-33 (wk 6), KIT-31 (wk 6–7) |
| **BE-2** | KIT-01, KIT-02, KIT-21, start KIT-08, KIT-10 | KIT-08 (wk 2), KIT-17 (wk 3) | KIT-27 (wk 5), KIT-34 (wk 6), KIT-35 (wk 7) |
| **BE-3** | KIT-01, KIT-02, start KIT-09, KIT-10, KIT-20 | KIT-09 (t/m wk 3), KIT-19 (wk 3), KIT-25 (wk 4), KIT-30 (wk 4–5) | KIT-30, KIT-33 (wk 6) |

KIT-20 (vragen voor de opdrachtgever) loopt de hele 7 weken door bij BE-3.

---

## Week 1 (rest van sprint 2): fundament

Doel: iedereen kan de app starten, het project staat goed opgezet, het rekenhart werkt met tests, en de vragen aan de opdrachtgever zijn gesteld.

### KIT-01 · Werkplek installeren

**Voor:** iedereen · **Week:** 1 · **Moeite:** S · **Hangt af van:** —

**Story:** Als teamlid wil ik de app op mijn eigen laptop kunnen starten, zodat ik kan zien wat we bouwen en kan meewerken.

**Taken:**
- [ ] Installeer **Node.js LTS** van [nodejs.org](https://nodejs.org/). Typ in de terminal `node -v`: je moet een versienummer zien.
- [ ] Installeer **Git** van [git-scm.com](https://git-scm.com/) en **VS Code** van [code.visualstudio.com](https://code.visualstudio.com/).
- [ ] Stel Git in met je naam en HvA-mail (vraag een developer hoe, of zie stap 0 van `zelf-bouwen.md`).
- [ ] Clone de groepsrepo van GitLab (een developer laat het zien).
- [ ] Open in VS Code de terminal en typ: `cd pl-klimaatimpact-tool`, `npm install`, `npm run dev`.
- [ ] Open `http://localhost:5173` in je browser.

**Klaar als:** je de app in je browser ziet draaien.

---

### KIT-02 · Teambeslissingen nemen

**Voor:** iedereen (BE-3 leidt het gesprek en schrijft het op) · **Week:** 1 · **Moeite:** S · **Hangt af van:** —

**Story:** Als team willen we een paar keuzes vastleggen, zodat niemand dubbel werk doet of de verkeerde kant op bouwt.

**Taken:**
- [ ] Bespreek: gebruiken we **Fluent UI** (zoals CLAUDE.md zegt, past bij Microsoft Teams) of **Tailwind** (is eerder geïnstalleerd)? Advies: Fluent UI, omdat de tool later in Teams draait.
- [ ] Bespreek: nemen we de MR `vite-opzet` over (Vite in plaats van Create React App)? Advies: ja.
- [ ] Spreek een vaste dag en tijd af voor stand-up, review en demo.
- [ ] BE-3 schrijft de besluiten met datum in `Notulen/`.

**Klaar als:** de besluiten in de notulen staan en iedereen ze kent.

---

### KIT-03 · Projectopzet afmaken

**Voor:** FS-A · **Week:** 1 · **Moeite:** M · **Hangt af van:** KIT-02 · **Bouwhandleiding:** stap 1

**Story:** Als developer wil ik een project met alle packages, ESLint, Vitest en de mappenstructuur uit CLAUDE.md, zodat het team er meteen in kan bouwen.

**Taken:**
- [ ] MR `vite-opzet` afronden en samenvoegen met `main`.
- [ ] Packages installeren: react-router, MSAL v5, TeamsJS v2, Fluent UI v9, Recharts v3, Vitest.
- [ ] Scripts `dev`, `build`, `test` en `lint` in `package.json`.
- [ ] `.env` in `.gitignore`, `.env.example` met `VITE_CLIENT_ID=`.
- [ ] Alle mappen uit CLAUDE.md aanmaken.
- [ ] Laat in een korte sessie (15 minuten) aan de business engineers zien hoe de mappen in elkaar zitten.

**Klaar als:** build, test en lint slagen op `main`, en iedereen heeft de nieuwe versie gepulld.

---

### KIT-04 · Datamodel (types)

**Voor:** FS-A · **Week:** 1 · **Moeite:** S · **Hangt af van:** KIT-03 · **Bouwhandleiding:** stap 2

**Story:** Als developer wil ik de types uit CLAUDE.md in de code, zodat iedereen dezelfde namen gebruikt en TypeScript fouten vroeg vindt.

**Taken:**
- [ ] `src/graph/types.ts`: `DriveItem`, `Quota`.
- [ ] `src/model/types.ts`: de rest van het datamodel.

**Klaar als:** `npm run build` slaagt.

---

### KIT-05 · Rekenmodel met tests

**Voor:** FS-B · **Week:** 1 · **Moeite:** M · **Hangt af van:** KIT-04 · **Bouwhandleiding:** stap 3

**Story:** Als medewerker wil ik weten hoeveel stroom en CO₂ mijn opslag kost, als bandbreedte, zodat ik een eerlijk beeld krijg.

**Taken:**
- [ ] `src/model/config.ts` met de voorlopige factoren en bronnen. Neem de definitieve waarden over zodra KIT-08 klaar is.
- [ ] `src/model/rekenmodel.ts`: `berekenImpact(bytes, config)`.
- [ ] Tests, met de controletest van 250 GB.

**Klaar als:** de controletest slaagt (250 GB ≈ 65,7 kWh en 30,7 kg CO₂ met de oude HvA-factoren).

---

### KIT-06 · Van Graph-item naar Bestand

**Voor:** FS-B · **Week:** 1 · **Moeite:** M · **Hangt af van:** KIT-04 · **Bouwhandleiding:** stap 4

**Story:** Als developer wil ik de gegevens van Microsoft omzetten naar onze eigen `Bestand`-vorm, zodat de rest van de app er makkelijk mee kan rekenen.

**Taken:**
- [ ] `src/model/naarBestand.ts`: `bepaalSoort`, `bepaalMap`, `naarBestand`, `naarBestanden`.
- [ ] Tests: gewoon bestand, map, verwijderd item, zonder grootte, hoofdletters in de extensie.

**Klaar als:** alle tests slagen.

---

### KIT-07 · Schermontwerpen in de repo

**Voor:** BE-1 · **Week:** 1 · **Moeite:** S · **Hangt af van:** —

**Story:** Als developer wil ik de schermontwerpen naast de code hebben, zodat ik de schermen kan bouwen zoals bedoeld.

**Taken:**
- [ ] Exporteer de 10 frames uit Figma als PNG.
- [ ] Geef ze namen met een nummer: `01-welkom.png`, `02-privacy.png`, `03-scannen.png`, `04-dashboard.png`, `05-zo-rekenen-we.png`, `06-grootste-bestanden.png`, `07-per-map.png`, `08-opruimen.png`, `09-bevestigen.png`, `10-resultaat.png`.
- [ ] Zet ze in `docs/ontwerp/`. Doe dit via een MR (zie [je eerste wijziging](#voor-business-engineers-je-eerste-wijziging-in-de-code)), samen met je maatje.
- [ ] Zijn er nog geen ontwerpen? Maak dan eerst schetsen in Figma, op basis van de schermlijst in CLAUDE.md.

**Klaar als:** de 10 afbeeldingen in `docs/ontwerp/` op `main` staan.

---

### KIT-08 · Rekenmodel: factoren en bronnen controleren

**Voor:** BE-2 · **Week:** 1 en 2 · **Moeite:** M · **Hangt af van:** —

**Story:** Als opdrachtgever wil ik dat de getallen in de tool kloppen en een betrouwbare bron hebben, zodat medewerkers de uitkomst kunnen vertrouwen.

**Taken:**
- [ ] Lees de tabel "Rekenmodel" in CLAUDE.md. Daar staan vijf factoren met een lage en hoge waarde.
- [ ] Zoek per factor de bron op. Klopt het getal? Is er een nieuwere versie (bijvoorbeeld CBS over 2025)?
- [ ] Leg in gewone taal uit wat elke factor betekent (bijvoorbeeld: "PUE = hoeveel extra stroom een datacenter gebruikt voor koeling").
- [ ] Bespreek de definitieve waarden met het team en de opdrachtgever.
- [ ] Schrijf het op in `docs/rekenmodel.md`: per factor de waarde, de bron (met jaar en link) en de uitleg. Geef de definitieve getallen aan FS-B.

**Klaar als:** `docs/rekenmodel.md` per factor een waarde, bron en uitleg heeft, en het team akkoord is.

---

### KIT-09 · Bewaarregels en de open beslissing over verwijderen

**Voor:** BE-3 · **Week:** 1 t/m 3 · **Moeite:** M · **Hangt af van:** —

**Story:** Als medewerker van de gemeente wil ik weten welke regels gelden voordat ik oude bestanden opruim, zodat ik niets weggooi wat bewaard moet worden.

**Taken:**
- [ ] Vraag de opdrachtgever naar de pagina over **bewaartermijnen en de selectielijst** op het intranet van de gemeente. Noteer de link.
- [ ] Zoek uit in gewone woorden wat de Archiefwet en de selectielijst betekenen voor een gewone medewerker (maximaal een half A4).
- [ ] Leg de **open beslissing** voor aan de opdrachtgever: mag de tool zelf bestanden verwijderen (dan vraagt de tool meer rechten), of alleen een link "Openen in OneDrive" tonen? Noteer het antwoord en de reden.
- [ ] Schrijf alles op in `docs/bewaarregels.md`.

**Klaar als:** we een link naar de bewaarregels hebben, een korte uitleg, en een besluit (of een datum waarop het besluit komt) over verwijderen.

---

### KIT-10 · Git leren en je eerste merge request

**Voor:** BE-1, BE-2, BE-3 (ieder een eigen MR) · **Week:** 1 en 2 · **Moeite:** S · **Hangt af van:** KIT-01, KIT-03

**Story:** Als business engineer wil ik zelf een kleine wijziging kunnen insturen, zodat ik later teksten en ontwerpen zelf kan aanpassen.

**Taken:**
- [ ] Volg [je eerste wijziging in de code](#voor-business-engineers-je-eerste-wijziging-in-de-code) met je maatje ernaast.
- [ ] Wijziging: zet je naam en rol in de teamtabel van `README.md`.
- [ ] Maak een MR en laat je maatje hem goedkeuren.

**Klaar als:** jouw MR op `main` staat en je de stappen begrijpt: branch, commit, push, MR.

---

### KIT-21 · App-registratie in Entra

**Voor:** BE-2 (maatje: FS-A) · **Week:** 1 · **Moeite:** S · **Hangt af van:** —

**Story:** Als team willen we dat Microsoft onze app kent, zodat medewerkers kunnen inloggen.

Dit is geen code. Je klikt het aan in een website.

**Taken:**
- [ ] Volg **stap 12** van `docs/zelf-bouwen.md`.
- [ ] Let goed op: platform **Single-page application** (niet "Web"), en de redirect-URI is precies `http://localhost:5173/redirect.html`.
- [ ] Rechten: `User.Read` en `Files.Read`, en verder niets.
- [ ] Geef het **Application (client) ID** aan de developers. Dit is niet geheim, maar zet het niet in git; iedereen zet het in zijn eigen `.env`.
- [ ] Schrijf in `docs/app-registratie.md` welke instellingen je hebt gekozen en waarom.

**Klaar als:** beide developers het client-id in hun eigen `.env` hebben en een developer de instellingen in Entra heeft nagekeken. (Of inloggen echt werkt, zie je pas in week 4 bij KIT-22.)

---

## Sprint 3 (week 2 t/m 4): inzicht en inloggen

Doel: met voorbeelddata werken Dashboard, Grootste bestanden, Per map en Zo rekenen we. Aan het eind van week 4 kun je inloggen met een Microsoft-account, en de Graph-laag is klaar en getest.

### KIT-11 · Alle teksten van de tool schrijven

**Voor:** BE-1 (met input van BE-2 en BE-3) · **Week:** 1 t/m 3 · **Moeite:** L · **Hangt af van:** KIT-07

**Story:** Als medewerker wil ik teksten in gewone taal, zodat ik zonder uitleg snap wat de tool doet.

**Taken:**
- [ ] Maak `docs/teksten.md` met per scherm een kopje.
- [ ] Schrijf per scherm: de titel, de uitleg, de tekst op elke knop, en de meldingen.
- [ ] Regels: kort, "je" in plaats van "u", geen vakjargon. Nooit "mag weg", "overbodig" of "onnodig" (harde regel 7).
- [ ] Laat BE-3 de privacyteksten en BE-2 de rekenteksten nalezen.

**Klaar als:** alle 10 schermen teksten hebben en het team ze heeft nagelezen.

---

### KIT-12 · Analyse en opmaak

**Voor:** FS-A · **Week:** 2 · **Moeite:** M · **Hangt af van:** KIT-05, KIT-06 · **Bouwhandleiding:** stap 5 en 6

**Story:** Als medewerker wil ik mijn bestanden gegroepeerd zien per leeftijd, soort en map, met getallen die ik kan lezen.

**Taken:**
- [ ] `src/model/analyse.ts`: `maakAnalyse(bestanden, quota, config, nu)` met tests.
- [ ] `src/model/opmaak.ts`: `formatBytes`, `formatGetal`, `formatBandbreedte`, `formatAantal`, `formatDatum`, met tests.

**Klaar als:** tests slagen, ook voor een lege lijst en voor één bestand.

---

### KIT-13 · Voorbeelddata en ScanContext

**Voor:** FS-B · **Week:** 2 · **Moeite:** M · **Hangt af van:** KIT-06 · **Bouwhandleiding:** stap 8 en 9

**Story:** Als team willen we de tool kunnen laten zien zonder in te loggen, zodat we kunnen bouwen en demonstreren.

**Taken:**
- [ ] `src/demo/voorbeeldData.ts` met een lijst sjablonen. Houd de lijst bovenaan het bestand en simpel, zodat BE-2 hem kan aanpassen (KIT-17).
- [ ] `src/state/`: `scanContextWaarde.ts`, `ScanContext.tsx`, `useScan.ts`, met `laadVoorbeelddata()`.

**Klaar als:** de voorbeelddata ongeveer 300 bestanden geeft, met alle soorten.

---

### KIT-14 · Grafiek opslag per soort

**Voor:** FS-B · **Week:** 3 · **Moeite:** M · **Hangt af van:** KIT-12, KIT-15 · **Bouwhandleiding:** stap 11

**Story:** Als medewerker wil ik in één oogopslag zien welke soort bestanden de meeste ruimte inneemt.

**Taken:**
- [ ] `src/components/charts/SoortenGrafiek.tsx` met Recharts.
- [ ] De eenheid op de as past zich aan, de animatie staat uit, en er is een tekstalternatief voor schermlezers.

**Klaar als:** de grafiek klopt met de tabel eronder.

---

### KIT-15 · Schermen, routes, layout en gedeelde onderdelen

**Voor:** FS-A · **Week:** 2 en 3 · **Moeite:** L · **Hangt af van:** KIT-12, KIT-13, KIT-07 · **Bouwhandleiding:** stap 7 en 10

**Story:** Als medewerker wil ik door de schermen kunnen klikken en overal dezelfde kopbalk zien.

**Taken:**
- [ ] `routes.tsx` met hash-routes, `AppLayout` met `Kopbalk` en de melding "Je bekijkt voorbeelddata".
- [ ] Gedeelde onderdelen: `ImpactKaart`, `LeeftijdKaart`, `GroepenTabel`, `BestandenTabel`, `GeenScan`.
- [ ] Schermen: Welkom (met de knop voor voorbeelddata), Dashboard, Grootste bestanden, Per map.
- [ ] Zet de teksten van het Welkom-scherm **niet** zelf in de code; dat doet BE-3 (KIT-19). Laat een tijdelijke tekst staan.

**Klaar als:** je met voorbeelddata alle vier de schermen kunt bekijken, en ze lijken op de ontwerpen.

---

### KIT-16 · Teksten in de schermen zetten

**Voor:** BE-1 (maatje: FS-A) · **Week:** 3 en 4 · **Moeite:** M · **Hangt af van:** KIT-11, KIT-15

**Story:** Als medewerker wil ik op elk scherm de teksten die het team heeft gekozen.

**Taken:**
- [ ] Vervang op Dashboard, Grootste bestanden en Per map de tijdelijke teksten door die uit `docs/teksten.md`.
- [ ] Dat doe je **alleen tussen de tags**, bijvoorbeeld `<Body1>hier je tekst</Body1>`. Verander niets anders. Twijfel je? Vraag je maatje.
- [ ] Kijk na elke wijziging in de browser of het er goed uitziet.

**Klaar als:** de teksten op de schermen gelijk zijn aan `docs/teksten.md` en build, test en lint slagen.

---

### KIT-17 · Voorbeelddata realistischer maken

**Voor:** BE-2 (maatje: FS-B) · **Week:** 3 · **Moeite:** S · **Hangt af van:** KIT-13

**Story:** Als opdrachtgever wil ik bij de demo voorbeelddata zien die lijkt op de OneDrive van een gemeentemedewerker, zodat de demo herkenbaar is.

**Taken:**
- [ ] Bedenk welke mappen en soorten bestanden een medewerker van de gemeente heeft (bijvoorbeeld "Raadsvoorstellen", "Projecten", "Foto's evenementen"). Geen echte namen van personen.
- [ ] Pas in `src/demo/voorbeeldData.ts` de lijst `SJABLONEN` aan. Elke regel is één soort bestand, bijvoorbeeld:

  ```ts
  { map: '/Projecten', naam: 'Projectplan {n}', extensie: 'docx', aantal: 20, minMB: 0.05, maxMB: 2, maxDagenOud: 700 },
  ```

  Je verandert alleen de tekst tussen de aanhalingstekens en de getallen. `{n}` wordt automatisch een volgnummer.
- [ ] Start de app, klik op "Bekijk met voorbeelddata" en kijk of het er herkenbaar uitziet.

**Klaar als:** de demo herkenbaar is voor de opdrachtgever en `npm test` nog slaagt.

---

### KIT-18 · Scherm "Zo rekenen we"

**Voor:** FS-B (de inhoud komt van BE-2) · **Week:** 3 · **Moeite:** S · **Hangt af van:** KIT-08, KIT-15

**Story:** Als medewerker wil ik zien hoe de tool rekent en waar de getallen vandaan komen, zodat ik de uitkomst kan vertrouwen.

**Taken:**
- [ ] De formule, een tabel met de factoren en bronnen uit `config.ts`, en een rekenvoorbeeld met de eigen opslag.
- [ ] De uitleg in gewone taal komt uit `docs/rekenmodel.md` (KIT-08).

**Klaar als:** BE-2 heeft gecontroleerd dat getallen en uitleg kloppen.

---

### KIT-19 · Welkom-scherm: teksten

**Voor:** BE-3 (maatje: FS-A) · **Week:** 3 · **Moeite:** S · **Hangt af van:** KIT-11, KIT-15

**Story:** Als medewerker wil ik op het eerste scherm in twee zinnen snappen wat de tool doet en waarom.

**Taken:**
- [ ] Zet de welkomstteksten uit `docs/teksten.md` in `src/pages/Welkom/Welkom.tsx`, alleen tussen de tags.
- [ ] Laat het lezen door iemand buiten het team: snapt die het meteen?

**Klaar als:** de teksten staan erin en de buitenstaander snapte het.

---

### KIT-20 · Vragen voor de opdrachtgever verzamelen

**Voor:** BE-3 · **Week:** 1 t/m 7 (doorlopend) · **Moeite:** S · **Hangt af van:** —

**Story:** Als team willen we op tijd antwoord op open vragen, zodat we niet stil komen te staan.

**Taken:**
- [ ] Houd in `Notulen/vragen-opdrachtgever.md` een lijst bij: vraag, wie vraagt, datum, antwoord.
- [ ] Begin met: definitieve rekenfactoren (KIT-08), bewaarregels-link en verwijderen (KIT-09), of we een testomgeving (tenant) krijgen, en wie mee wil doen aan de gebruikerstest (KIT-33).
- [ ] Neem de lijst mee naar elk overleg met de opdrachtgever.

**Klaar als:** de lijst bestaat en na elk overleg is bijgewerkt.

---

### KIT-22 · Inloggen met MSAL

**Voor:** FS-A · **Week:** 3 en 4 · **Moeite:** L · **Hangt af van:** KIT-21, KIT-15 · **Bouwhandleiding:** stap 13

**Story:** Als medewerker wil ik inloggen met mijn Microsoft-account, zodat de tool mijn eigen OneDrive kan bekijken.

**Taken:**
- [ ] `config/env.ts`, `redirect.html` met de redirect bridge, `auth/msal.ts`, `AuthProvider`, `useAuth`, `useToken`, `foutmelding.ts` (met tests).
- [ ] Privacy-scherm met de knop "Inloggen en mijn OneDrive berekenen". Kopbalk met naam en Uitloggen.
- [ ] Knop "Opnieuw proberen" als het inlogvenster gesloten is.

**Klaar als:** inloggen en uitloggen werken, en `localStorage` leeg blijft.

---

### KIT-23 · Praten met Microsoft Graph

**Voor:** FS-B · **Week:** 3 en 4 · **Moeite:** L · **Hangt af van:** KIT-04 · **Bouwhandleiding:** stap 14

**Story:** Als developer wil ik een betrouwbare manier om gegevens bij Microsoft op te halen, ook als Microsoft even druk is.

**Taken:**
- [ ] `graph/client.ts` (token, 429/503 met Retry-After, foutcodes, alleen `graph.microsoft.com`), `graph/drive.ts`, `graph/scan.ts`, `graph/foutmelding.ts`.
- [ ] Tests met een nep-fetch.

**Klaar als:** de tests voor 429, fouten en meerdere pagina's slagen.

---

### KIT-25 · Privacy-scherm controleren

**Voor:** BE-3 (maatje: FS-A) · **Week:** 4 · **Moeite:** S · **Hangt af van:** KIT-22

**Story:** Als medewerker wil ik vóór het inloggen eerlijk lezen wat de tool wel en niet met mijn gegevens doet.

**Taken:**
- [ ] Controleer of elke zin op het Privacy-scherm klopt met de harde regels in CLAUDE.md. Vraag een developer als je twijfelt.
- [ ] Laat de tekst lezen door de opdrachtgever, of door de privacy-adviseur als die er is.
- [ ] Pas de tekst aan in `src/pages/Privacy/Privacy.tsx`, alleen tussen de tags.

**Klaar als:** de opdrachtgever akkoord is met de privacytekst.

---

### KIT-26 · Testplan schrijven

**Voor:** BE-1 · **Week:** 3 en 4 · **Moeite:** M · **Hangt af van:** —

**Story:** Als team willen we vooraf weten wat we testen, zodat we niets vergeten voor de oplevering.

**Taken:**
- [ ] Maak `docs/testplan.md` met een tabel: nummer, wat je doet, wat je verwacht te zien.
- [ ] Neem in elk geval op:
  - voorbeelddata bekijken en door alle schermen klikken;
  - inloggen, en het inlogvenster sluiten zonder in te loggen;
  - pop-ups geblokkeerd in de browser;
  - een scan, en Annuleren tijdens de scan;
  - wifi uit tijdens de scan;
  - een account met een lege OneDrive;
  - de app op een telefoon of een smal venster (400 px breed);
  - alles bedienen met alleen het toetsenbord (Tab, Enter, spatiebalk).

**Klaar als:** het testplan minstens 15 testgevallen heeft en een developer het heeft nagelezen.

---

## Sprint 4 (week 5 t/m 7): echte scan, opruimen en oplevering

Doel: de eigen OneDrive scannen, oude bestanden bekijken, het resultaat zien, en een geteste tool opleveren met een demo.

### KIT-24 · De echte scan

**Voor:** FS-B · **Week:** 5 · **Moeite:** M · **Hangt af van:** KIT-22, KIT-23 · **Bouwhandleiding:** stap 15

**Story:** Als medewerker wil ik dat mijn OneDrive gescand wordt, met voortgang en een knop Annuleren.

**Taken:**
- [ ] `startScan()` en `annuleerScan()` in ScanContext.
- [ ] Scannen-scherm: opslag, voortgang, Annuleren, foutmeldingen, door naar Dashboard.
- [ ] Testen met minstens twee echte accounts (een persoonlijk account en een HvA-account).

**Klaar als:** een echte scan werkt en de foutmeldingen in gewone taal verschijnen (test: wifi uit tijdens de scan).

---

### KIT-27 · Foutmeldingen beoordelen

**Voor:** BE-2 · **Week:** 5 · **Moeite:** S · **Hangt af van:** KIT-22, KIT-23

**Story:** Als medewerker wil ik bij een fout lezen wat er mis is en wat ik kan doen, zonder technische termen.

**Taken:**
- [ ] Vraag een developer om alle foutmeldingen op een rij te zetten. Ze staan in `src/auth/foutmelding.ts` en `src/graph/foutmelding.ts`.
- [ ] Beoordeel elke melding: snap je wat er mis is? Staat erin wat je kunt doen?
- [ ] Schrijf verbeteringen op in het issue. De developer zet ze in de code.

**Klaar als:** alle meldingen zijn beoordeeld en de verbeteringen zijn doorgevoerd.

---

### KIT-28 · Oude bestanden bekijken en BevestigDialoog

**Voor:** FS-A · **Week:** 5 en 6 · **Moeite:** L · **Hangt af van:** KIT-24, KIT-09 · **Bouwhandleiding:** stap 16

**Story:** Als medewerker wil ik mijn bestanden zien die langer dan een half jaar niet zijn gewijzigd, er een paar kiezen en die openen in OneDrive, met een duidelijke verwijzing naar de bewaarregels.

**Taken:**
- [ ] `src/model/opruimen.ts` met tests.
- [ ] Selectie in ScanContext.
- [ ] Opruimen-scherm: melding bewaartermijnen met de link uit KIT-09, tabel met sorteren en vinkjes, 100 rijen per keer.
- [ ] BevestigDialoog: de tool verwijdert niets, links naar OneDrive, uitleg over de prullenbak.
- [ ] Is in KIT-09 besloten dat de tool wél mag verwijderen? Overleg dan eerst met het team; dat is een groter issue (zie de backlog).

**Klaar als:** kiezen, de dialoog en de besparing werken, en BE-3 de teksten heeft gecontroleerd.

---

### KIT-29 · Resultaat-scherm en ESLint-regels

**Voor:** FS-B · **Week:** 5 en 6 · **Moeite:** M · **Hangt af van:** KIT-28 · **Bouwhandleiding:** stap 16 en 17

**Story:** Als medewerker wil ik zien wat mijn keuze kan schelen, en als team willen we dat de harde regels automatisch bewaakt worden.

**Taken:**
- [ ] Resultaat-scherm met de besparing en de tips uit KIT-30.
- [ ] ESLint-regels voor de harde regels: geen opslag, geen `console`, `fetch` alleen in `src/graph/`, MSAL alleen in `src/auth/`, `src/model/` puur.

**Klaar als:** het scherm werkt en een proefbestand met overtredingen fouten geeft bij `npm run lint`.

---

### KIT-30 · Tips en de tekst over bewaartermijnen

**Voor:** BE-3 · **Week:** 4 en 5 · **Moeite:** S · **Hangt af van:** KIT-09

**Story:** Als medewerker wil ik praktische tips om minder op te slaan, en een duidelijke waarschuwing over bewaartermijnen.

**Taken:**
- [ ] Schrijf 4 tot 6 tips in gewone taal, bijvoorbeeld "Deel een link in plaats van een bijlage". Controleer dat geen tip in strijd is met de bewaarregels.
- [ ] Schrijf de waarschuwing over bewaartermijnen voor het Opruimen-scherm (maximaal 3 zinnen).
- [ ] Zet ze in `docs/teksten.md` en geef ze aan FS-A en FS-B.

**Klaar als:** tips en waarschuwing staan in de tool en de opdrachtgever is akkoord.

---

### KIT-31 · Testen volgens het testplan

**Voor:** BE-1 · **Week:** 6 en 7 · **Moeite:** M · **Hangt af van:** KIT-26, KIT-28, KIT-29

**Story:** Als team willen we weten of alles werkt voordat we opleveren.

**Taken:**
- [ ] Voer elk testgeval uit `docs/testplan.md` uit. Zet erachter: gelukt of niet gelukt.
- [ ] Maak voor elke fout een GitLab-issue met: wat je deed, wat je verwachtte, wat er gebeurde, en een screenshot.
- [ ] Test opnieuw zodra een developer zegt dat een fout is opgelost.

**Klaar als:** alle testgevallen zijn uitgevoerd en er geen open fouten met label `bug::ernstig` meer zijn.

---

### KIT-32 · Randgevallen en reviewpunten afwerken

**Voor:** FS-A en FS-B · **Week:** 7 · **Moeite:** M · **Hangt af van:** KIT-31, KIT-34

**Story:** Als medewerker wil ik dat de tool ook werkt bij een lege OneDrive, één bestand of heel veel bestanden.

**Taken:**
- [ ] Bugs uit KIT-31 en bevindingen uit KIT-34 oplossen.
- [ ] Tests voor een lege lijst, één bestand, een bestand zonder grootte en 100.000 bestanden.
- [ ] Privacycheck: geen opslag, geen externe verzoeken (Netwerk-tabblad in de browser, F12).

**Klaar als:** alle bugs zijn opgelost of als "later" gemarkeerd, met reden.

---

### KIT-33 · Gebruikerstest

**Voor:** BE-1 en BE-3 · **Week:** 6 · **Moeite:** M · **Hangt af van:** KIT-28, KIT-29

**Story:** Als team willen we weten of echte medewerkers de tool snappen, zodat we de belangrijkste verbeterpunten kennen.

**Taken:**
- [ ] Spreek via de opdrachtgever 3 tot 5 medewerkers af (30 minuten per persoon).
- [ ] Bereid 3 opdrachten voor, bijvoorbeeld: "Zoek uit hoeveel CO₂ je opslag kost" en "Zoek je drie oudste bestanden".
- [ ] Laat ze hardop denken en help niet. De een stelt vragen, de ander schrijft op.
- [ ] Gebruik voorbeelddata, of laat ze inloggen met hun eigen account als zij dat willen.
- [ ] Vat samen in `docs/gebruikerstest.md`: wat ging goed, wat was lastig, top-3 verbeterpunten.

**Klaar als:** de samenvatting met verbeterpunten klaar is en besproken in het team.

---

### KIT-34 · Toegankelijkheid en smal scherm

**Voor:** BE-2 · **Week:** 6 · **Moeite:** S · **Hangt af van:** KIT-28, KIT-29

**Story:** Als medewerker die geen muis gebruikt of slecht ziet, wil ik de tool ook kunnen gebruiken.

**Taken:**
- [ ] Ga door elk scherm met **alleen het toetsenbord**: Tab (verder), Shift+Tab (terug), Enter (klikken), spatiebalk (vinkje). Zie je steeds waar je bent?
- [ ] Maak het browservenster heel smal, of open de app op je telefoon. Moet je ergens opzij scrollen? Is er tekst die over iets anders heen valt?
- [ ] Zoom in tot 200% (Ctrl en +). Is alles nog te lezen?
- [ ] Optioneel: zet de schermlezer aan (Windows: Ctrl+Windows+Enter voor Verteller) en luister naar het Dashboard.
- [ ] Schrijf elk probleem op als issue, met een screenshot.

**Klaar als:** alle schermen zijn getest en de problemen als issues in GitLab staan.

---

### KIT-35 · README en demo

**Voor:** BE-2 (met hulp van FS-B voor het technische deel) · **Week:** 7 · **Moeite:** M · **Hangt af van:** KIT-32

**Story:** Als opdrachtgever wil ik bij de oplevering snappen wat de tool doet en hoe je hem start, en een demo zien.

**Taken:**
- [ ] `README.md`: wat de tool doet, hoe je hem start, hoe je `.env` invult. FS-B schrijft het technische deel.
- [ ] Maak een demoscript van 5 minuten: welke schermen, in welke volgorde, wat zeg je erbij.
- [ ] Oefen de demo één keer met het hele team.

**Klaar als:** de README klopt (een teamlid heeft hem gevolgd op een schone laptop) en de demo is geoefend.

---

## Als het krap wordt

Zeven weken is niet veel. Spreek nu af wat er kan schuiven, dan hoef je dat in week 6 niet onder druk te beslissen.

**Moet af** (zonder dit is er geen werkende tool):

- KIT-03 t/m KIT-06: projectopzet en rekenhart
- KIT-12, KIT-13, KIT-15: analyse, voorbeelddata en de schermen
- KIT-21, KIT-22, KIT-23, KIT-24: Entra, inloggen, Graph en de echte scan
- KIT-25: privacytekst goedgekeurd
- KIT-28: Oude bestanden bekijken (alleen lezen)
- KIT-31 en KIT-35: testen en de demo

**Kan kleiner** (doe een eenvoudige versie):

| Issue | Kleinere versie |
| --- | --- |
| KIT-14 Grafiek | Alleen de tabel met soorten, zonder grafiek |
| KIT-29 Resultaat en ESLint-regels | Het Resultaat-scherm wel; de ESLint-regels later |
| KIT-33 Gebruikerstest | 2 medewerkers in plaats van 5, met voorbeelddata |
| KIT-34 Toegankelijkheid | Alleen de toetsenbordtest en het smalle scherm |
| KIT-18 Zo rekenen we | Alleen de formule en de tabel met bronnen |

**Kan naar later** (als het echt niet past):

- KIT-17: voorbeelddata realistischer maken
- KIT-30: tips op het Resultaat-scherm (één standaardtip is genoeg)

Beslis dit samen in de stand-up, en zet het in de notulen.

---

## Later (backlog)

Niet in deze 7 weken, maar wel bekend:

| Issue | Wat | Wie (voorstel) |
| --- | --- | --- |
| KIT-36 | Publiceren op Azure Static Web Apps, met CI in GitLab (fase 8 in `bouw-prompts.md`) | FS-B, met BE-2 voor de portal |
| KIT-37 | De tool als tab in Microsoft Teams (fase 9). Eerst een testomgeving regelen. | FS-A, met BE-3 voor het contact |
| KIT-38 | Bestanden verwijderen vanuit de tool. Alleen als KIT-09 daartoe besluit. Vraagt `Files.ReadWrite`. | FS-A en FS-B |
| KIT-39 | Donker thema | FS-A, met BE-1 voor het ontwerp |

---

## Voor business engineers: je eerste wijziging in de code

Dit is het stappenplan voor elke kleine wijziging, zoals een tekst aanpassen. Doe het de eerste keer samen met je maatje.

**1. Haal de nieuwste versie op en maak een eigen branch.** Typ in de terminal van VS Code:

```powershell
git checkout main
git pull
git checkout -b kit-19-welkom-teksten
```

Een branch is jouw eigen kopie. Wat je daar doet, raakt de rest pas als het goedgekeurd is.

**2. Start de app:** `npm run dev` en open `http://localhost:5173`.

**3. Zoek de tekst.** Druk in VS Code op `Ctrl+Shift+F` en typ een stukje van de tekst die je wilt veranderen. Je ziet in welk bestand hij staat.

**4. Verander alleen de tekst tussen de tags.** Bijvoorbeeld:

```tsx
<Body1>Deze tool bekijkt hoeveel opslag jij gebruikt.</Body1>
```

Verander alleen `Deze tool bekijkt hoeveel opslag jij gebruikt.`. Laat `<Body1>`, `</Body1>`, haakjes `{ }` en aanhalingstekens staan. Een apostrof (`'`) of een accolade in je tekst kan problemen geven; vraag dan je maatje.

**5. Sla op (`Ctrl+S`) en kijk in de browser.** De wijziging verschijnt vanzelf. Zie je een rood scherm met een fout? Druk op `Ctrl+Z` tot het weer werkt, en vraag je maatje.

**6. Controleer:** typ `npm run build`, `npm test` en `npm run lint`. Geen rode foutmeldingen? Mooi.

**7. Sla je werk op in git en stuur het in:**

```powershell
git add -A
git commit -m "KIT-19: teksten Welkom-scherm"
git push -u origin kit-19-welkom-teksten
```

**8. Maak een merge request.** Na de push zie je in de terminal een link. Open die, of ga in GitLab naar Merge requests → New. Zet je maatje als reviewer en schrijf `Closes #19` in de beschrijving.

**Gouden regels:**
- Werk nooit direct op `main`.
- Weet je niet zeker wat iets doet? Laat het staan en vraag het.
- Fouten maken mag. Met git kun je altijd terug.

---

## Zo zet je dit in GitLab

1. **Milestones:** maak er drie: "Sprint 2 (rest)" voor week 1, "Sprint 3" voor week 2 t/m 4, en "Sprint 4" voor week 5 t/m 7. Zet de einddatum erbij.
2. **Labels:**
   - rol: `rol::FS`, `rol::BE`
   - moeite: `moeite::S`, `moeite::M`, `moeite::L`
   - soort: `soort::code`, `soort::onderzoek`, `soort::tekst`, `soort::test`
   - fouten: `bug::ernstig`, `bug::klein`
3. **Issues:** maak per KIT-nummer een issue. Kopieer de tekst van het issue (story, taken, klaar als). Zet de milestone, labels en de persoon bij "Assignee".
4. **Board:** maak een issue board met de kolommen **Te doen**, **Bezig**, **Review**, **Klaar**. Sleep je issue mee als je verder komt.
5. **Stand-up** (kort, bijvoorbeeld 3 keer per week): ieder zegt wat hij gedaan heeft, wat hij gaat doen, en of hij ergens op vastzit.
