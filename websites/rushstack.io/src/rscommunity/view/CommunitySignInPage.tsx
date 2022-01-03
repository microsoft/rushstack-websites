import Layout from "@theme/Layout";
import React from "react";
import styles from "./CommunitySignInPage.module.css";

import { AppSession } from "../api/AppSession";
import { DecoratedButton } from "./DecoratedButton";

export interface ICommunitySigninPageProps {
  appSession: AppSession;
}
export function CommunitySignInPage(
  props: ICommunitySigninPageProps
): JSX.Element {
  return (
    <Layout>
      <div className={styles.dialogContainer}>
        <div className={styles.dialogBox}>
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
          <div
            style={{
              textAlign: "center",
              paddingTop: "40px",
            }}
          >
            <DecoratedButton
              onClick={props.appSession.onNavigateToSignIn}
              theme="white"
            >
              <img src="/images/github-button.svg" width={"24px"}></img>
              <div style={{ paddingLeft: "10px" }}>Sign in with GitHub</div>
            </DecoratedButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}
