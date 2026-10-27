// De buitenste laag van de app: het Fluent-thema, inloggen, het scanresultaat en de router.
import { FluentProvider } from '@fluentui/react-components';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './auth/AuthProvider';
import type { MsalInstantie } from './auth/msal';
import { router } from './routes';
import { ScanProvider } from './state/ScanContext';
import { thema } from './styles/theme';

interface Props {
  msal: MsalInstantie | null; // null als er geen client-id is ingesteld
}

export function App({ msal }: Props) {
  return (
    <FluentProvider theme={thema}>
      <AuthProvider msal={msal}>
        <ScanProvider>
          <RouterProvider router={router} />
        </ScanProvider>
      </AuthProvider>
    </FluentProvider>
  );
}
