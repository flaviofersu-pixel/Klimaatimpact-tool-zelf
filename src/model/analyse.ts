// Maakt van een lijst bestanden een Analyse: totalen, groepen per leeftijd, soort en map, en de grootste.
import type { Quota } from '../graph/types';
import { berekenImpact } from './rekenmodel';
import type { Analyse, Bestand, Bestandssoort, Groep, RekenConfig } from './types';

export const LEEFTIJD_NIEUW = 'Minder dan 6 maanden';
export const LEEFTIJD_MIDDEL = '6 tot 12 maanden';
export const LEEFTIJD_OUD = 'Meer dan een jaar';

// Namen van de soorten zoals we ze op het scherm tonen.
export const SOORT_NAMEN: Record<Bestandssoort, string> = {
  word: 'Word',
  excel: 'Excel',
  powerpoint: 'PowerPoint',
  pdf: 'PDF',
  afbeelding: 'Afbeeldingen',
  video: "Video's",
  overig: 'Overig',
};

export const HOOFDMAP = 'Hoofdmap';

const AANTAL_GROOTSTE = 20;

// De datum die een aantal maanden vóór "nu" ligt.
export function maandenTerug(nu: Date, maanden: number): Date {
  const datum = new Date(nu);
  datum.setMonth(datum.getMonth() - maanden);
  return datum;
}

// Is het bestand langer dan dit aantal maanden niet gewijzigd?
export function isOuderDan(bestand: Bestand, maanden: number, nu: Date): boolean {
  return bestand.gewijzigdOp <= maandenTerug(nu, maanden);
}

export function bepaalLeeftijdsgroep(bestand: Bestand, nu: Date): string {
  if (isOuderDan(bestand, 12, nu)) {
    return LEEFTIJD_OUD;
  }
  if (isOuderDan(bestand, 6, nu)) {
    return LEEFTIJD_MIDDEL;
  }
  return LEEFTIJD_NIEUW;
}

// De bovenste map: "/Documenten/Projecten" wordt "Documenten". Bestanden in de hoofdmap zelf: "Hoofdmap".
export function bovensteMap(map: string): string {
  const delen = map.split('/').filter((deel) => deel !== '');
  return delen.length > 0 ? delen[0] : HOOFDMAP;
}

export function totaleGrootte(bestanden: Bestand[]): number {
  let totaal = 0;
  for (const bestand of bestanden) {
    totaal += bestand.grootte;
  }
  return totaal;
}

// Verdeel bestanden in groepen met een functie die per bestand de groepsnaam geeft.
function groepeer(
  bestanden: Bestand[],
  groepVan: (bestand: Bestand) => string,
  config: RekenConfig,
): Groep[] {
  const perNaam = new Map<string, Bestand[]>();
  for (const bestand of bestanden) {
    const naam = groepVan(bestand);
    const lijst = perNaam.get(naam) ?? [];
    lijst.push(bestand);
    perNaam.set(naam, lijst);
  }

  const groepen: Groep[] = [];
  for (const [naam, lijst] of perNaam) {
    groepen.push({
      naam,
      aantal: lijst.length,
      impact: berekenImpact(totaleGrootte(lijst), config),
    });
  }
  return groepen;
}

function grootsteEerst(a: Groep, b: Groep): number {
  return b.impact.bytes - a.impact.bytes;
}

// Leeftijdsgroepen altijd alle drie en altijd in dezelfde volgorde, ook als een groep leeg is.
function maakLeeftijdsgroepen(bestanden: Bestand[], config: RekenConfig, nu: Date): Groep[] {
  const groepen = groepeer(bestanden, (bestand) => bepaalLeeftijdsgroep(bestand, nu), config);
  return [LEEFTIJD_NIEUW, LEEFTIJD_MIDDEL, LEEFTIJD_OUD].map(
    (naam) => groepen.find((groep) => groep.naam === naam) ?? { naam, aantal: 0, impact: berekenImpact(0, config) },
  );
}

export function maakAnalyse(
  bestanden: Bestand[],
  quota: Quota | undefined,
  config: RekenConfig,
  nu: Date,
): Analyse {
  const grootste = [...bestanden].sort((a, b) => b.grootte - a.grootte).slice(0, AANTAL_GROOTSTE);

  return {
    totaal: berekenImpact(totaleGrootte(bestanden), config),
    prullenbak: berekenImpact(quota?.deleted ?? 0, config),
    perLeeftijd: maakLeeftijdsgroepen(bestanden, config, nu),
    perSoort: groepeer(bestanden, (bestand) => SOORT_NAMEN[bestand.soort], config).sort(grootsteEerst),
    perMap: groepeer(bestanden, (bestand) => bovensteMap(bestand.map), config).sort(grootsteEerst),
    grootste,
  };
}
