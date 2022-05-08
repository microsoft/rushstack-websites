import { History } from 'history';
import Cookies from 'js-cookie';

import { ApiDataService } from './ApiDataService';

export class AppSession {
  public readonly serviceUrl: string;
  public loggedInUser: string | undefined;

  public readonly apiDataService: ApiDataService;

  private _history: History<unknown> | undefined = undefined;

  private static _instance: AppSession | undefined;

  public constructor() {
    this.loggedInUser = Cookies.get('rscommunity-logged-in-user');

    this.serviceUrl =
      document.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://service.rushstack.io';

    this.apiDataService = new ApiDataService(this);
  }

  public registerHistory(history: History<unknown>): void {
    this._history = history;
  }

  public onNavigateToSignIn = (): void => {
    // After logging in, return to the current page
    Cookies.set('rscommunity-login-return-url', document.location.href, {
      sameSite: 'Strict',
      domain: document.location.hostname,
      path: '/'
    });

    this.navigateToPage(this.serviceUrl + '/login-github');
  };

  public onNavigateToSignOut = (): void => {
    // The "Sign Out" command should return us to the site homepage
    const siteRootUrl: string = new URL('/', document.location.href).href;

    Cookies.set('rscommunity-login-return-url', siteRootUrl, {
      sameSite: 'Strict',
      domain: document.location.hostname,
      path: '/'
    });

    this.navigateToPage(this.serviceUrl + '/logout');
  };

  public getEventDetailPageUrl(eventId: number): string {
    return `/community/event?id=${eventId}`;
  }

  public navigateToEventDetailPage(eventId: number): void {
    const url: string = this.getEventDetailPageUrl(eventId);
    this.navigateToPage(url);
  }

  public navigateToPage(url: string): void {
    // The react-router seems to break internal navigation that uses the window.location APIs.
    // For example manually invoking "window.location.href = '/community/event?id=14';" in the
    // Chrome developer console may take you to the page '/community/event?id=15'.
    // It seems we must navigate using the react-router history API.

    console.log('navigateToPage(): ' + url);

    const currentUrl: URL = new URL(window.location.href);
    const newUrl: URL = new URL(url, currentUrl);

    if (newUrl.protocol === currentUrl.protocol && newUrl.host === currentUrl.host) {
      if (!this._history) {
        throw new Error('registerHistory() was not called');
      }

      this._history.push(url);
    } else {
      window.location.assign(url);
    }
  }

  public static get instance(): AppSession {
    if (AppSession._instance === undefined) {
      AppSession._instance = new AppSession();
    }
    return AppSession._instance;
  }
}
