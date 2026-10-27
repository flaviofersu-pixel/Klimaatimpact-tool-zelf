// Startpunt: zet de app in de pagina. Later komen hier Teams-herkenning en het starten van MSAL bij.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
