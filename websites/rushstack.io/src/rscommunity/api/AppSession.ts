import Cookies from "js-cookie";
import { ApiDataService } from "./ApiDataService";

export class AppSession {
  public serviceUrl: string;
  public loggedInUser: string | undefined;

  public apiDataService: ApiDataService;

  private static _instance: AppSession | undefined;

  public constructor() {
    this.loggedInUser = Cookies.get("rscommunity-logged-in-user");

    this.serviceUrl =
      document.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://service.rushstack.io";

    this.apiDataService = new ApiDataService(this);
  }

  public onNavigateToSignIn = (): void => {
    console.log("Signing in");

    // After logging in, return to the current page
    Cookies.set("rscommunity-login-return-path", document.location.pathname, {
      sameSite: "Strict",
      domain: document.location.hostname,
      path: "/",
    });

    document.location.href = this.serviceUrl + "/login-github";
  };

  public onNavigateToSignOut = (): void => {
    console.log("Signing out");

    // The "Sign Out" command should return us to the site homepage
    Cookies.set("rscommunity-login-return-path", "/", {
      sameSite: "Strict",
      domain: document.location.hostname,
      path: "/",
    });

    document.location.href = this.serviceUrl + "/logout";
  };

  public navigateToEventDetailPage(eventId: number): void {
    document.location.href = `/community/event?id=${eventId}`;
  }

  public static get instance(): AppSession {
    if (AppSession._instance === undefined) {
      AppSession._instance = new AppSession();
    }
    return AppSession._instance;
  }
}
