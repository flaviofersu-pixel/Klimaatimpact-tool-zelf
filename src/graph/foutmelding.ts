// Zet fouten tijdens de scan om in een melding in gewone taal.
import { GraphFout } from './client';

export const MELDING_GEANNULEERD = 'De scan is geannuleerd. Er is niets bewaard.';

export function vertaalScanFout(fout: unknown): string {
  if (fout instanceof DOMException && fout.name === 'AbortError') {
    return MELDING_GEANNULEERD;
  }
  if (!(fout instanceof GraphFout)) {
    return 'Er ging iets mis bij het lezen van je OneDrive. Probeer het opnieuw.';
  }
  if (fout.status === 0) {
    return 'De verbinding is weggevallen. Controleer je internetverbinding en probeer het opnieuw.';
  }
  if (fout.status === 401 || fout.status === 403) {
    return 'De tool heeft geen toestemming om je OneDrive te bekijken. Log uit, log opnieuw in en geef toestemming.';
  }
  // 404: bij werkaccounts bestaat de OneDrive pas nadat je hem één keer hebt geopend.
  if (fout.status === 404) {
    return 'We vinden geen OneDrive bij jouw account. Open OneDrive één keer via office.com en probeer het daarna opnieuw.';
  }
  if (fout.status === 429 || fout.status === 503) {
    return 'Microsoft is even te druk. Probeer het over een paar minuten opnieuw.';
  }
  return `Er ging iets mis bij het lezen van je OneDrive (code ${fout.status}). Probeer het opnieuw.`;
}

// Fouten bij het openen van mappen op het Verplaatsen-scherm.
export function vertaalMapFout(fout: unknown): string {
  if (!(fout instanceof GraphFout)) {
    return 'Deze map kon niet worden geopend. Probeer het opnieuw.';
  }
  if (fout.status === 0) {
    return 'De verbinding is weggevallen. Controleer je internetverbinding en probeer het opnieuw.';
  }
  if (fout.status === 401 || fout.status === 403) {
    return 'Je hebt geen toegang tot deze map, of de tool heeft nog geen toestemming voor SharePoint gekregen.';
  }
  if (fout.status === 404) {
    return 'Deze map bestaat niet (meer). Misschien heeft iemand hem net verplaatst of verwijderd.';
  }
  if (fout.status === 429 || fout.status === 503) {
    return 'Microsoft is even te druk. Probeer het over een paar minuten opnieuw.';
  }
  return `Deze map kon niet worden geopend (code ${fout.status}). Probeer het opnieuw.`;
}

// Fouten bij het verplaatsen van één bestand. Belangrijk: zeg altijd waar het bestand nu staat.
export function vertaalVerplaatsFout(fout: unknown): string {
  if (!(fout instanceof GraphFout)) {
    return 'Het verplaatsen is niet gelukt. Het bestand staat nog in je OneDrive.';
  }
  if (fout.code === 'origineelNietVerwijderd') {
    return 'Het bestand staat nu in SharePoint, maar het origineel kon niet uit je OneDrive worden gehaald. Het staat nu op twee plekken.';
  }
  if (fout.code === 'nameAlreadyExists') {
    return 'In de doelmap staat al een bestand met deze naam. Er is niets veranderd.';
  }
  if (fout.code === 'kopieDuurtTeLang') {
    return 'Het kopiëren duurt lang. Het origineel staat nog in je OneDrive. Kijk later in SharePoint of de kopie er staat.';
  }
  if (fout.status === 401 || fout.status === 403) {
    return 'Je mag in deze map van SharePoint geen bestanden zetten. Er is niets veranderd.';
  }
  if (fout.status === 423) {
    return 'Het bestand is nu geopend, door jou of door iemand anders. Sluit het en probeer het opnieuw.';
  }
  if (fout.status === 507) {
    return 'De SharePoint-site is vol. Er is niets veranderd.';
  }
  if (fout.status === 0) {
    return 'De verbinding is weggevallen. Controleer in OneDrive en SharePoint waar het bestand nu staat.';
  }
  return `Het verplaatsen is niet gelukt (code ${fout.status}). Het bestand staat nog in je OneDrive.`;
}
