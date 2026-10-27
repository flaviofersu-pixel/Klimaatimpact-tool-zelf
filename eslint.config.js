// ESLint-instellingen: controleert de code op fouten en op de harde regels uit CLAUDE.md (npm run lint).
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Harde regel 3: niets opslaan in de browser.
const OPSLAG_VERBODEN = 'Harde regel 3: we bewaren niets in de browser. Houd gegevens in React-state.'
const opslagGlobals = [
  { name: 'localStorage', message: OPSLAG_VERBODEN },
  { name: 'sessionStorage', message: OPSLAG_VERBODEN },
  { name: 'indexedDB', message: OPSLAG_VERBODEN },
]
const opslagEigenschappen = [
  { object: 'document', property: 'cookie', message: OPSLAG_VERBODEN },
  { object: 'window', property: 'localStorage', message: OPSLAG_VERBODEN },
  { object: 'window', property: 'sessionStorage', message: OPSLAG_VERBODEN },
  { object: 'window', property: 'indexedDB', message: OPSLAG_VERBODEN },
]

// Harde regel 5: alleen src/graph/ praat met het netwerk.
const FETCH_VERBODEN = 'Harde regel 5: alleen src/graph/ gebruikt fetch.'

// Harde regel 5: alleen src/auth/ gebruikt MSAL.js en TeamsJS.
const authImports = {
  group: ['@azure/msal-*', '@azure/msal-*/*', '@microsoft/teams-js'],
  message: 'Harde regel 5: alleen src/auth/ gebruikt MSAL en TeamsJS.',
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  {
    // Regels voor alle broncode
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error', // geen gegevens in de console
      'no-restricted-globals': ['error', ...opslagGlobals, { name: 'fetch', message: FETCH_VERBODEN }],
      'no-restricted-properties': [
        'error',
        ...opslagEigenschappen,
        { object: 'window', property: 'fetch', message: FETCH_VERBODEN },
      ],
      'no-restricted-imports': ['error', { patterns: [authImports] }],
    },
  },
  {
    // src/graph/ mag fetch gebruiken
    files: ['src/graph/**/*.ts'],
    rules: {
      'no-restricted-globals': ['error', ...opslagGlobals],
      'no-restricted-properties': ['error', ...opslagEigenschappen],
    },
  },
  {
    // src/auth/ mag MSAL en TeamsJS gebruiken
    files: ['src/auth/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // src/model/ bevat alleen pure functies: geen React, geen UI, geen netwerk (alleen types uit graph/)
    files: ['src/model/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            authImports,
            {
              group: ['react', 'react-*', '@fluentui/*', 'recharts', '../graph/*', '!../graph/types', '../auth/*', '../state/*'],
              message: 'src/model/ bevat alleen pure functies: geen React, geen netwerk (harde regel 5).',
            },
          ],
        },
      ],
    },
  },
])
