import Layout from "@theme/Layout";
import React from "react";
import Cookies from "js-cookie";

//const serviceUrl: string = 'https://service.rushstack.io';
const serviceUrl: string = "http://localhost:8000";

async function testAsync(): Promise<void> {
  console.log("Testing a REST request...");
  try {
    const data: Response = await fetch(serviceUrl + "/api/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!data.ok) {
      throw new Error("Server Error: " + data.statusText);
    }

    const json: unknown = await data.json();

    console.log("Request successful:");
    console.log(JSON.stringify(json));
  } catch (error) {
    console.error("REST request failed: " + error.toString());
  }
}

function testButton_onClick(event: React.MouseEvent<HTMLButtonElement>): void {
  console.log("Performing test");
  testAsync();
}

function signInWithGitHub_onClick(
  event: React.MouseEvent<HTMLButtonElement>
): void {
  console.log("Logging in");
  document.location.href = serviceUrl + "/login-github";
}

function LoginWithGitHubPage(): JSX.Element {
  const containerStyle: React.CSSProperties = {
    paddingTop: "100px",
    paddingLeft: "100px",
    paddingRight: "100px",
  };
  const boxStyle: React.CSSProperties = {
    marginLeft: "auto",
    marginRight: "auto",
    padding: "40px",
    backgroundColor: "#f0f0f0",
    borderRadius: "6px",
    maxWidth: "600px",
  };
  const buttonOuterStyle: React.CSSProperties = {
    display: "block",
    marginTop: "40px",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "3px",
    borderColor: "#c0c0c0",
    cursor: "pointer",
  };
  const buttonInnerStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    margin: "10px",
  };
  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Join the Rush Stack Community!</h2>
        Signing in enables you to:
        <ul>
          <li>Join our monthly "Rush Hour" meetings</li>
          <li>Sign up for technical breakout sessions and other events</li>
          <li>Request to add your company logo to our website</li>
          <li>Participate in occasional giveaways such as free T-shirts</li>
        </ul>
        <h2>This feature requires a GitHub account</h2>
        We use your existing GitHub account for authentication. <br />
        If you don't have an account, you will need to{" "}
        <a href="https://github.com/signup" target="_blank">
          create one
        </a>
        .
        <div>
          <button onClick={signInWithGitHub_onClick} style={buttonOuterStyle}>
            <div style={buttonInnerStyle}>
              <img src="/images/github-button.svg" width={"24px"}></img>
              <div style={{ paddingLeft: "10px" }}>Sign in with GitHub</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsPage(): JSX.Element {
  const loggedInUser: string | undefined = Cookies.get(
    "rscommunity-logged-in-user"
  );

  if (!loggedInUser) {
    console.log("Not logged in");
    Cookies.set("rscommunity-login-return-path", document.location.pathname, {
      sameSite: "Strict",
      domain: document.location.hostname,
      path: "/",
    });
    return (
      <Layout>
        <LoginWithGitHubPage />
      </Layout>
    );
  } else {
    console.log("Already logged in");
    Cookies.set("rscommunity-login-return-path", "/", {
      sameSite: "Strict",
      domain: document.location.hostname,
      path: "/",
    });

    return (
      <Layout>
        <div>You are logged in as {loggedInUser}</div>
        <div>
          <button onClick={testButton_onClick}>TEST</button>
          <a href={serviceUrl + "/logout"}>LOG OUT</a>
        </div>
      </Layout>
    );
  }
}

export default EventsPage;
