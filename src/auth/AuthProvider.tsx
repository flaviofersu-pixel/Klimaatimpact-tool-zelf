// Zet MsalProvider om de app, zodat useAuth() en useToken() overal werken. Zonder MSAL (geen client-id): niets.
import type { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import type { ReactNode } from 'react';

interface Props {
  msal: IPublicClientApplication | null;
  children: ReactNode;
}

export function AuthProvider({ msal, children }: Props) {
  if (!msal) {
    return children;
  }
  return <MsalProvider instance={msal}>{children}</MsalProvider>;
}
