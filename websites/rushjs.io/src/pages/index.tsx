import React from 'react';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function CustomPage(props: {}): JSX.Element {
  return (
    <Layout>
      <header className={styles.masthead}>
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700 }}>
                Rush: a scalable monorepo manager for the web
              </h2>
            </div>
          </div>
          <div className="row" style={{ paddingTop: '2rem' }}>
            <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              <a
                href="/pages/intro/welcome"
                className={['button', 'button--secondary', styles.mastheadButton].join(' ')}
              >
                Learn More
              </a>
            </div>
            <div style={{ marginRight: 'auto', marginLeft: '1rem' }}>
              <a
                href="/pages/intro/get_started"
                className={['button', 'button--primary', styles.mastheadButton].join(' ')}
              >
                Get Started!
              </a>
            </div>
          </div>
        </div>
      </header>
      <div>(content goes here)</div>
    </Layout>
  );
}

export default CustomPage;
