// Hook voor schermen: is iemand ingelogd, hoe heet die, en functies om in en uit te loggen.
import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { isClientIdIngesteld, scopes } from '../config/env';

export function useAuth() {
  // Zonder MsalProvider (geen client-id) geeft useMsal een lege "nep"-versie: niemand is ingelogd.
  const { instance, accounts, inProgress } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0] ?? null;

  // opnieuw = true alleen na een klik op "Opnieuw proberen": dan breekt MSAL de vorige poging af.
  // MSAL v5 kan niet zien dat iemand de popup heeft gesloten (zie leerlog fase 4).
  async function login(opnieuw = false) {
    const resultaat = await instance.loginPopup({ scopes, overrideInteractionInProgress: opnieuw });
    instance.setActiveAccount(resultaat.account);
  }

  async function logout() {
    await instance.logoutPopup({ account });
  }

  return {
    kanInloggen: isClientIdIngesteld,
    isIngelogd: account !== null,
    naam: account?.name ?? account?.username ?? '',
    bezig: inProgress !== InteractionStatus.None,
    login,
    logout,
  };
}
