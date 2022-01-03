// * * * DO NOT MODIFY THIS FILE * * *
//
// This file was copied from the https://github.com/microsoft/rushstack.io-service repository.
// It should be kept in sync with the original file.

export interface IApiEvent {
  dbEventId: number;
  eventTitle: string;
  startTime: Date | undefined;
  duration: number | undefined;
  durationUnits: string;
  hostedBy: string;
  hostedByUrl: string;
  isCompleted: boolean;
  isArchived: boolean;

  agendaHtml: string;
  notesHtml: string;

  spotsLeftNotice: string;
  userIsSignedUp: boolean;
}

export interface IApiHistory {
  dbHistoryId: number;
  timestamp: Date;
  dbUserId: number | undefined;
  username: string;
  dbEventId: number | undefined;
  operation: string;
  message: string;
}

export interface IApiUser {
  dbUserId: number;
  isAdministrator: boolean;

  oauthUserKey: string;
  verifiedEmail: string;

  gitHubUserId: number;
  gitHubUsername: string;
  gitHubDisplayName: string;

  fullName: string;
  nickName: string;

  companyName: string;
  companyUrl: string;
  twitterAlias: string;

  verifiedEmailChoices: string[] | undefined;
}

export interface IApiUserUpdate {
  dbUserId: number;

  verifiedEmail: string;

  fullName: string;
  nickName: string;

  companyName: string;
  companyUrl: string;
  twitterAlias: string;
}
