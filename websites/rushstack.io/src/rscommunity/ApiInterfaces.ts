export interface IApiEvent {
  dbEventId: number;
  eventTitle: string;
  startTime: Date | undefined;
  duration: number | undefined;
  durationUnits: string | undefined;
  hostedBy: string | undefined;
  hostedByUrl: string | undefined;
  agendaHtml: string;
  notesHtml: string | undefined;
  spotsLeftNotice: string | undefined;
  isCompleted: boolean;
  isArchived: boolean;

  userIsSignedUp: boolean;
}

export interface IApiHistory {
  dbHistoryId: number;
  timestamp: Date;
  dbUserId: number | undefined;
  username: string | undefined;
  dbEventId: number | undefined;
  operation: string | undefined;
  message: string | undefined;
}

export interface IApiUser {
  dbUserId: number;
  isAdministrator: boolean;

  oauthUserKey: string;

  gitHubUserId: number;
  gitHubUsername: string;
  gitHubDisplayName: string | undefined;

  companyName: string | undefined;
  twitterAlias: string | undefined;
}
