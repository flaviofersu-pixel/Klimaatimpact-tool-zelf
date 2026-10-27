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
