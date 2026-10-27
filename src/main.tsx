// Startpunt: eerst MSAL starten (als er een client-id is), daarna de app tonen.
// In fase 9 komt hier de keuze tussen browser en Teams bij.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { maakMsalVoorBrowser, type MsalInstantie } from './auth/msal';
import { isClientIdIngesteld } from './config/env';

async function start() {
  let msal: MsalInstantie | null = null;
  if (isClientIdIngesteld) {
    msal = await maakMsalVoorBrowser();
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App msal={msal} />
    </StrictMode>,
  );
}

void start();
