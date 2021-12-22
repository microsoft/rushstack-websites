import Layout from "@theme/Layout";
import React from "react";
import Cookies from "js-cookie";
import { CommunityContext } from "./CommunityContext";

export interface ICommunitySigninPageProps {
  context: CommunityContext;
}
export function CommunitySignInPage(
  props: ICommunitySigninPageProps
): JSX.Element | undefined {
  // After logging in, return to the current page
  Cookies.set("rscommunity-login-return-path", document.location.pathname, {
    sameSite: "Strict",
    domain: document.location.hostname,
    path: "/",
  });

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

  const signInWithGitHub_onClick = React.useCallback(() => {
    console.log("Logging in");
    document.location.href = props.context.serviceUrl + "/login-github";
  }, [props.context.serviceUrl]);

  return (
    <Layout>
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
    </Layout>
  );
}
