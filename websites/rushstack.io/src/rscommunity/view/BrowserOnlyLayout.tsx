import { History } from 'history';
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useHistory } from '@docusaurus/router';
import Layout from '@theme/Layout';
import { AppSession } from '../api/AppSession';

// Allow Docusaurus to prerender the <Layout> statically, but the rest of the web application must be
// rendered dynamically.
export function BrowserOnlyLayout(props: React.PropsWithChildren<{}>): JSX.Element {
  return (
    <Layout>
      <BrowserOnly>
        {() => {
          const history: History<unknown> = useHistory();
          AppSession.instance.registerHistory(history);

          return <>{props.children}</>;
        }}
      </BrowserOnly>
    </Layout>
  );
}
