// Hash-routes: één route per scherm. Met # in de URL werkt de app ook als statische site en in Teams.
import { createHashRouter } from 'react-router';
import { Welkom } from './pages/Welkom/Welkom';
import { Privacy } from './pages/Privacy/Privacy';
import { Scannen } from './pages/Scannen/Scannen';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ZoRekenenWe } from './pages/ZoRekenenWe/ZoRekenenWe';
import { GrootsteBestanden } from './pages/GrootsteBestanden/GrootsteBestanden';
import { PerMap } from './pages/PerMap/PerMap';
import { Opruimen } from './pages/Opruimen/Opruimen';
import { Resultaat } from './pages/Resultaat/Resultaat';

export const router = createHashRouter([
  { path: '/', element: <Welkom /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/scannen', element: <Scannen /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/zo-rekenen-we', element: <ZoRekenenWe /> },
  { path: '/grootste-bestanden', element: <GrootsteBestanden /> },
  { path: '/per-map', element: <PerMap /> },
  { path: '/opruimen', element: <Opruimen /> },
  { path: '/resultaat', element: <Resultaat /> },
]);
