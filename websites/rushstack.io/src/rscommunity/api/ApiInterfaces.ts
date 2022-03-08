// * * * DO NOT MODIFY THIS FILE * * *
//
// This file was copied from the https://github.com/microsoft/rushstack.io-service repository.
// It should be kept in sync with the original file.

/* eslint-disable @typescript-eslint/consistent-type-definitions */

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type AssertType<T1 extends { [P2 in keyof T2]: T2[P2] }, T2 extends { [P1 in keyof T1]: T2[P1] }> = T1;

export type ApiEventStatus = 'NEW' | 'CANCELLED' | 'RESCHEDULED' | 'DONE';

export type IApiTableEvent = {
  dbEventId: number;
  eventTitle: string;
  startTime: Date | undefined;
  duration: number | undefined;
  durationUnits: string;
  hostedBy: string;
  hostedByUrl: string;
  status: ApiEventStatus;
  isCompleted: boolean;
  isArchived: boolean;

  agendaHtml: string;
  notesHtml: string;
};

export type IApiTableHistory = {
  dbHistoryId: number;
  timestamp: Date;
  dbUserId: number | undefined;
  username: string;
  dbEventId: number | undefined;
  operation: string;
  message: string;
};

export type IApiTableRegistration = {
  dbEventId: number;
  dbUserId: number;
  signupTimestamp: Date;
  cancelTimestamp: Date | undefined;
};

export type IApiTableUser = {
  dbUserId: number;
  isAdministrator: boolean;

  oauthUserKey: string;
  verifiedEmail: string;

  gitHubUserId: number;
  gitHubUsername: string;
  gitHubDisplayName: string;

  fullName: string;
  nickName: string;
  pronouns: string;
  location: string;

  organizationName: string;
  organizationUrl: string;
  twitterAlias: string;

  gitHubVerifiedEmails: string;

  optOutOfAllEmails: boolean;
  notifyAboutNewEvents: boolean;
  discloseOrganization: boolean;
  allowUseOfLogo: boolean;
};

// --------------------------------------------------

export type IApiEvent = IApiTableEvent & {
  spotsLeftNotice: string;
  userIsSignedUp: boolean;
};

export type IApiUser = AssertType<
  {
    dbUserId: number;
    isAdministrator: boolean;

    oauthUserKey: string;
    verifiedEmail: string;

    gitHubUserId: number;
    gitHubUsername: string;
    gitHubDisplayName: string;

    fullName: string;
    nickName: string;
    pronouns: string;
    location: string;

    organizationName: string;
    organizationUrl: string;
    twitterAlias: string;

    verifiedEmailChoices: string[] | undefined;

    optOutOfAllEmails: boolean;
    notifyAboutNewEvents: boolean;
    discloseOrganization: boolean;
    allowUseOfLogo: boolean;
  },
  // IApiTableUser is IApiTableUserRaw, but replacing gitHubVerifiedEmails with verifiedEmailChoices
  OmitStrict<IApiTableUser, 'gitHubVerifiedEmails'> & {
    verifiedEmailChoices: string[] | undefined;
  }
>;

export interface IApiUserUpdate {
  dbUserId: number;

  verifiedEmail?: string;

  fullName?: string;
  nickName?: string;
  pronouns?: string;
  location?: string;

  organizationName?: string;
  organizationUrl?: string;
  twitterAlias?: string;

  optOutOfAllEmails?: boolean;
  notifyAboutNewEvents?: boolean;
  discloseOrganization?: boolean;
  allowUseOfLogo?: boolean;
}
