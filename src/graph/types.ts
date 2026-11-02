// Vormen van de gegevens die Microsoft Graph teruggeeft. Alleen de velden die we met $select ophalen.

export interface DriveItem {
  id: string;
  name: string;
  size?: number; // bytes
  lastModifiedDateTime: string;
  fileSystemInfo?: { createdDateTime?: string; lastModifiedDateTime?: string };
  parentReference?: { path?: string; driveId?: string }; // driveId alleen bij het verplaatsen (fase 10)
  file?: { mimeType?: string };
  folder?: { childCount?: number };
  webUrl?: string;
  deleted?: { state?: string }; // delta kan verwijderde items teruggeven: overslaan
}

// Een team uit GET /me/joinedTeams (fase 10).
export interface GraphTeam {
  id: string;
  displayName: string;
}

export interface Quota {
  used: number; // bytes
  deleted: number; // bytes in de prullenbak
  total: number;
}
