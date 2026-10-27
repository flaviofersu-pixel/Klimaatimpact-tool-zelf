// Hook die een toegangstoken voor Microsoft Graph ophaalt: eerst stil, en alleen als dat niet kan met een popup.
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useCallback } from 'react';
import { scopes } from '../config/env';

export type HaalToken = () => Promise<string>;

export function useToken(): HaalToken {
  const { instance } = useMsal();

  // useCallback: dezelfde functie zolang de MSAL-instantie hetzelfde blijft
  return useCallback(async () => {
    const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
    if (!account) {
      throw new Error('Je bent niet ingelogd.');
    }

    try {
      // Stil: uit de cache, of vernieuwd op de achtergrond. De gebruiker merkt niets.
      const resultaat = await instance.acquireTokenSilent({ scopes, account });
      return resultaat.accessToken;
    } catch (fout) {
      // Alleen als Microsoft zegt dat de gebruiker iets moet doen (opnieuw inloggen, toestemming), een popup.
      if (fout instanceof InteractionRequiredAuthError) {
        const resultaat = await instance.acquireTokenPopup({ scopes, account });
        return resultaat.accessToken;
      }
      throw fout;
    }
  }, [instance]);
}
