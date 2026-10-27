// Maakt de MSAL PublicClientApplication: de standaardversie voor de browser, of de nestable versie voor Teams.
import {
  BrowserCacheLocation,
  createNestablePublicClientApplication,
  createStandardPublicClientApplication,
  type Configuration,
  type IPublicClientApplication,
} from '@azure/msal-browser';
import { authority, clientId, redirectUri } from '../config/env';

// Eigen naam voor het MSAL-type, zodat code buiten src/auth/ MSAL niet zelf hoeft te importeren.
export type MsalInstantie = IPublicClientApplication;

const POPUP_WACHTTIJD_MS = 3 * 60 * 1000; // 3 minuten

function maakConfiguratie(): Configuration {
  return {
    auth: {
      clientId,
      authority,
      redirectUri,
      postLogoutRedirectUri: redirectUri, // ook uitloggen met een popup gaat via de bridge-pagina
    },
    cache: {
      // sessionStorage: het inloggen blijft bewaard tot je het tabblad sluit. Nooit localStorage.
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
    system: {
      // Zo lang wacht MSAL op het antwoord uit de popup. Standaard 60 seconden; met
      // tweestapsverificatie is dat soms te kort. Wie de popup sluit, kan altijd "Opnieuw proberen".
      popupBridgeTimeout: POPUP_WACHTTIJD_MS,
    },
  };
}

// Was je in dit tabblad al ingelogd, dan is dat account weer het actieve account.
function kiesActiefAccount(msal: IPublicClientApplication) {
  const accounts = msal.getAllAccounts();
  if (!msal.getActiveAccount() && accounts.length > 0) {
    msal.setActiveAccount(accounts[0]);
  }
}

export async function maakMsalVoorBrowser(): Promise<IPublicClientApplication> {
  const msal = await createStandardPublicClientApplication(maakConfiguratie());
  kiesActiefAccount(msal);
  return msal;
}

// Voor Teams (nested app authentication). Wordt pas in fase 9 gebruikt.
export async function maakMsalVoorTeams(): Promise<IPublicClientApplication> {
  const msal = await createNestablePublicClientApplication(maakConfiguratie());
  kiesActiefAccount(msal);
  return msal;
}
