// Instellingen voor het inloggen: client-id uit .env, authority, redirect-URI en scopes.

// Het Application (client) ID van de app-registratie. Niet geheim, maar wel per omgeving anders.
export const clientId = (import.meta.env.VITE_CLIENT_ID ?? '').trim();

// Zonder client-id kan niemand inloggen. De app werkt dan alleen met voorbeelddata.
export const isClientIdIngesteld = clientId !== '';

// "common": werk- en schoolaccounts van elke organisatie, en persoonlijke Microsoft-accounts.
export const authority = 'https://login.microsoftonline.com/common';

// MSAL v5 stuurt de popup na het inloggen naar deze "redirect bridge"-pagina (zie redirect.html).
// Deze URL moet precies zo in de app-registratie staan, bijvoorbeeld http://localhost:5173/redirect.html.
export const redirectUri = `${window.location.origin}/redirect.html`;

// Alleen lezen. Nooit Files.Read.All of Sites.* (zie CLAUDE.md).
export const scopes = ['User.Read', 'Files.Read'];
