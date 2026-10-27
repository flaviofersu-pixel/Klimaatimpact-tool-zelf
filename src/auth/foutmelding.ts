// Vertaalt fouten van MSAL naar een melding in gewone taal.
// MSAL v5 zet in error.message alleen een link; we kijken daarom naar errorCode (zie migratiegids v5).

interface MogelijkeAuthFout {
  errorCode?: string;
  errorMessage?: string;
  subError?: string;
}

function isOnline(): boolean {
  // navigator.onLine is false als de browser zeker weet dat er geen verbinding is
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

// Deze fout krijgt de vorige poging als iemand op "Opnieuw proberen" klikt. Dat is geen echte fout.
export function isAfgebrokenPoging(fout: unknown): boolean {
  return (fout as MogelijkeAuthFout | undefined)?.errorCode === 'interaction_in_progress_cancelled';
}

export function vertaalAuthFout(fout: unknown, online: boolean = isOnline()): string {
  const { errorCode = '', errorMessage = '', subError = '' } = (fout ?? {}) as MogelijkeAuthFout;

  if (!online || errorCode === 'no_network_connectivity' || errorCode === 'network_error') {
    return 'Er is geen internetverbinding. Controleer je verbinding en probeer het opnieuw.';
  }
  if (errorCode === 'popup_window_error' || errorCode === 'empty_window_error') {
    return 'Je browser heeft het inlogvenster tegengehouden. Sta pop-ups toe voor deze site en probeer het opnieuw.';
  }
  if (errorCode === 'user_cancelled' || subError === 'cancel') {
    return 'Je hebt het inlogvenster gesloten voordat het inloggen klaar was. Probeer het opnieuw als je wilt doorgaan.';
  }
  // AADSTS65004: gebruiker weigert toestemming. AADSTS90094 en AADSTS65001: beheerder moet toestemming geven.
  if (errorMessage.includes('AADSTS90094') || errorMessage.includes('AADSTS65001')) {
    return 'Je organisatie moet deze tool eerst goedkeuren. Vraag je IT-beheerder om toestemming te geven.';
  }
  if (errorCode === 'access_denied' || errorCode === 'consent_required' || errorMessage.includes('AADSTS65004')) {
    return 'Je hebt geen toestemming gegeven. Zonder toestemming kan de tool je OneDrive niet bekijken.';
  }
  if (errorCode === 'interaction_in_progress') {
    return 'Er staat al een inlogvenster open. Maak dat eerst af of sluit het.';
  }
  if (errorCode === 'timed_out' || errorCode === 'redirect_bridge_empty_response') {
    return 'Het inlogvenster is gesloten, of het inloggen duurde te lang. Probeer het opnieuw.';
  }
  return errorCode
    ? `Inloggen is niet gelukt. Probeer het opnieuw. (foutcode: ${errorCode})`
    : 'Inloggen is niet gelukt. Probeer het opnieuw.';
}
