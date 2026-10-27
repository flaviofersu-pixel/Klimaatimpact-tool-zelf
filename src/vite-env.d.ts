// Vertelt TypeScript welke instellingen uit .env bestaan (alles wat met VITE_ begint).
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
