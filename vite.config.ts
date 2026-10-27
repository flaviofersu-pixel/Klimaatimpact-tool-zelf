// Instellingen voor Vite (dev-server en build) en voor Vitest (tests).
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // de redirect-URI in de app-registratie gebruikt precies deze poort
  },
  build: {
    rolldownOptions: {
      // Twee pagina's: de app zelf en de redirect bridge waar de inlogpopup op terugkomt
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        redirect: fileURLToPath(new URL('./redirect.html', import.meta.url)),
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
