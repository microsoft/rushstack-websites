import React from 'react';

import styles from './index.module.css';

// Default implementation, that you can customize
function Root(props: { children: unknown }) {
  return (
    <>
      <div className={styles.suiteNavBar}>
        <div role="button" className={styles.hamburger}>
          <img src={'/images/rs-hamburger.svg'} />
        </div>
        <div className={styles.hamburgerDivider} />

        <a href="https://rushstack.io/pages/overview/roadmap/" className={styles.suitNavItem}>
          Roadmap
        </a>
        <a href="https://rushstack.io/pages/shop/" className={styles.suitNavItem}>
          Shop
        </a>
        <a href="https://rushstack.io/community/events/" className={styles.suitNavItem}>
          Events
        </a>
      </div>

      {props.children}
    </>
  );
}

export default Root;
