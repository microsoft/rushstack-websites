import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";

// Allow Docusaurus to prerender the <Layout> statically, but the rest of the web application must be
// rendered dynamically.
export function BrowserOnlyLayout(
  props: React.PropsWithChildren<{}>
): JSX.Element {
  return (
    <Layout>
      <BrowserOnly>{() => <>{props.children}</>}</BrowserOnly>
    </Layout>
  );
}
