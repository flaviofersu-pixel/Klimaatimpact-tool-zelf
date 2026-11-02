// Hook die een toegangstoken voor Microsoft Graph ophaalt: eerst stil, en alleen als dat niet kan met een popup.
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useCallback } from 'react';
import { scopes } from '../config/env';

export type HaalToken = () => Promise<string>;

// gevraagdeScopes: standaard de leesrechten. Het Verplaatsen-scherm geeft scopesVerplaatsen mee.
// Heeft de gebruiker daar nog geen toestemming voor gegeven, dan vraagt de popup erom (incremental consent).
// Geef altijd een vaste lijst uit config/env.ts mee, geen nieuwe array: anders maakt useCallback elke keer een nieuwe functie.
export function useToken(gevraagdeScopes: string[] = scopes): HaalToken {
  const { instance } = useMsal();

  // useCallback: dezelfde functie zolang de MSAL-instantie en de scopes hetzelfde blijven
  return useCallback(async () => {
    const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
    if (!account) {
      throw new Error('Je bent niet ingelogd.');
    }

    try {
      // Stil: uit de cache, of vernieuwd op de achtergrond. De gebruiker merkt niets.
      const resultaat = await instance.acquireTokenSilent({ scopes: gevraagdeScopes, account });
      return resultaat.accessToken;
    } catch (fout) {
      // Alleen als Microsoft zegt dat de gebruiker iets moet doen (opnieuw inloggen, toestemming), een popup.
      if (fout instanceof InteractionRequiredAuthError) {
        const resultaat = await instance.acquireTokenPopup({ scopes: gevraagdeScopes, account });
        return resultaat.accessToken;
      }
      throw fout;
    }
  }, [instance, gevraagdeScopes]);
}
