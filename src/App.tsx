// De buitenste laag van de app: het Fluent-thema en de router.
import { FluentProvider } from '@fluentui/react-components';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { thema } from './styles/theme';

export function App() {
  return (
    <FluentProvider theme={thema}>
      <RouterProvider router={router} />
    </FluentProvider>
  );
}
