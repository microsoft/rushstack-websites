import Cookies from 'js-cookie';

import { ApiDataService } from './ApiDataService';

export class AppSession {
  public readonly serviceUrl: string;
  public loggedInUser: string | undefined;

  public readonly apiDataService: ApiDataService;

  private static _instance: AppSession | undefined;

  public constructor() {
    this.loggedInUser = Cookies.get('rscommunity-logged-in-user');

    this.serviceUrl =
      document.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://service.rushstack.io';

    this.apiDataService = new ApiDataService(this);
  }

  public onNavigateToSignIn = (): void => {
    // After logging in, return to the current page
    Cookies.set('rscommunity-login-return-url', document.location.href, {
      sameSite: 'Strict',
      domain: document.location.hostname,
      path: '/'
    });

    document.location.href = this.serviceUrl + '/login-github';
  };

  public onNavigateToSignOut = (): void => {
    // The "Sign Out" command should return us to the site homepage
    const siteRootUrl: string = new URL('/', document.location.href).href;

    Cookies.set('rscommunity-login-return-url', siteRootUrl, {
      sameSite: 'Strict',
      domain: document.location.hostname,
      path: '/'
    });

    document.location.href = this.serviceUrl + '/logout';
  };

  public getEventDetailPageUrl(eventId: number): string {
    return `/community/event?id=${eventId}`;
  }

  public navigateToEventDetailPage(eventId: number): void {
    document.location.href = this.getEventDetailPageUrl(eventId);
  }

  public static get instance(): AppSession {
    if (AppSession._instance === undefined) {
      AppSession._instance = new AppSession();
    }
    return AppSession._instance;
  }
}
