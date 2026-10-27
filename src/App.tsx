// De buitenste laag van de app: het Fluent-thema, het scanresultaat en de router.
import { FluentProvider } from '@fluentui/react-components';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ScanProvider } from './state/ScanContext';
import { thema } from './styles/theme';

export function App() {
  return (
    <FluentProvider theme={thema}>
      <ScanProvider>
        <RouterProvider router={router} />
      </ScanProvider>
    </FluentProvider>
  );
}
