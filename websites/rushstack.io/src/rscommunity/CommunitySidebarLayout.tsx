import Layout from "@theme/Layout";
import React from "react";
import { CommunityContext } from "./CommunityContext";

interface IMenuItemProps {
  title: string;
  focused?: boolean;
  linkUrl?: string;
  linkOnClick?: () => void;
}

function MenuItem(props: IMenuItemProps): JSX.Element {
  let result: JSX.Element;

  if (props.focused) {
    result = (
      <div style={{ paddingTop: "10px", textDecoration: "underline" }}>
        {props.title}
      </div>
    );
  } else {
    result = <div style={{ paddingTop: "10px" }}>{props.title}</div>;

    if (props.linkUrl) {
      result = <a href={props.linkUrl}>{result}</a>;
    } else if (props.linkOnClick) {
      result = (
        <a href="#" onClick={props.linkOnClick}>
          {result}
        </a>
      );
    }
  }
  return result;
}

export interface ICommunitySidebarLayoutProps {
  context: CommunityContext;
  currentPage?: "events" | "past-events" | "profile";
}

export function CommunitySidebarLayout(
  props: React.PropsWithChildren<ICommunitySidebarLayoutProps>
): JSX.Element {
  const signOut_onClick = React.useCallback(() => {
    props.context.navigateToSignOut();
  }, [props.context.serviceUrl]);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            paddingTop: "70px",
            paddingLeft: "50px",
            paddingRight: "30px",
            flexGrow: 0,
          }}
        >
          <div style={{ fontWeight: "bold" }}>Member Actions</div>
          <MenuItem
            title="Upcoming events"
            focused={props.currentPage === "events"}
            linkUrl="/community/events"
          />
          <MenuItem
            title="Past events"
            focused={props.currentPage === "past-events"}
            linkUrl="/community/past-events"
          />
          <MenuItem
            title="Your profile"
            focused={props.currentPage === "profile"}
            linkUrl="/community/profile"
          />
          <MenuItem title="Sign out" linkOnClick={signOut_onClick} />
        </div>
        <div style={{ flexGrow: 1 }}>{props.children}</div>
      </div>
    </Layout>
  );
}