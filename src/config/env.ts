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

// Alleen voor het Verplaatsen-scherm (fase 10, oefenfeature). Een uitzondering op de regel hierboven,
// zie CLAUDE.md. De tool vraagt deze rechten pas als iemand op "Verbinden met SharePoint" klikt.
//   Team.ReadBasic.All: de teams waar je lid van bent
//   Files.ReadWrite.All: mappen van die teams lezen, kopiëren naar SharePoint, het origineel in OneDrive verwijderen
export const scopesVerplaatsen = ['User.Read', 'Team.ReadBasic.All', 'Files.ReadWrite.All'];
