import Layout from "@theme/Layout";
import React from "react";
import { CommunityContext } from "./CommunityContext";

export interface ICommunitySidebarLayoutProps {
  context: CommunityContext;
}

export function CommunitySidebarLayout(
  props: React.PropsWithChildren<ICommunitySidebarLayoutProps>
): JSX.Element {
  return (
    <Layout>
      <div>
        <div>LEFT NAV</div>
        <div>{props.children}</div>
      </div>
    </Layout>
  );
}
