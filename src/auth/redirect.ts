// Script van redirect.html: geeft het inlogantwoord uit de URL door aan het hoofdvenster van de app.
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

broadcastResponseToMainFrame().catch(() => {
  const melding = document.getElementById('melding');
  if (melding) {
    melding.textContent = 'Inloggen is niet gelukt. Sluit dit venster en probeer het opnieuw.';
  }
});
