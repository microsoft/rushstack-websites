import React from 'react';
import Layout from '@theme/Layout';

export default function Page(): JSX.Element {
  return (
    <Layout>
      <iframe style={{ flexGrow: 1 }} src="https://microsoft.github.io/tsdoc/"></iframe>
    </Layout>
  );
}
