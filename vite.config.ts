// Instellingen voor Vite (dev-server en build) en voor Vitest (tests).
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // de redirect-URI in de app-registratie gebruikt precies deze poort
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
