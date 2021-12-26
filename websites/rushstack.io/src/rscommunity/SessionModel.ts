import Cookies from "js-cookie";

export class SessionModel {
  public serviceUrl: string;
  public loggedInUser: string | undefined;

  public constructor() {
    this.loggedInUser = Cookies.get("rscommunity-logged-in-user");

    this.serviceUrl =
      document.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://service.rushstack.io";
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
}
