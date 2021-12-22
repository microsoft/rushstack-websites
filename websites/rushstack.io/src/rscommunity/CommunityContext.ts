import Cookies from "js-cookie";

export class CommunityContext {
  public serviceUrl: string;
  public loggedInUser: string | undefined;

  public constructor() {
    this.loggedInUser = Cookies.get("rscommunity-logged-in-user");

    if (this.loggedInUser === undefined) {
      // The "Sign Out" command should return us to the site homepage
      Cookies.set("rscommunity-login-return-path", "/", {
        sameSite: "Strict",
        domain: document.location.hostname,
        path: "/",
      });
    }

    this.serviceUrl =
      document.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://service.rushstack.io";
  }
}
