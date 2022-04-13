import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

interface IAdvocate {
  image: string;
  title: string;
  url?: string;
}

const advocates: IAdvocate[] = [
  { image: 'azure.png', title: 'Azure SDK', url: 'https://github.com/azure/azure-sdk-for-js' },
  { image: 'hbomax.png', title: 'HBO Max', url: 'https://www.hbomax.com/' },
  { image: 'onedrive.png', title: 'OneDrive' },
  { image: 'sharepoint.png', title: 'SharePoint' },
  { image: 'o365.png', title: 'Office 365 Small Business' },
  { image: 'windows_store.png', title: 'Windows Store' },
  { image: 'o365.png', title: 'Office Web Apps' },
  { image: 'simplrjs.png', title: 'SimplrJS react-forms', url: 'https://github.com/SimplrJS/react-forms' },
  { image: 'telia.png', title: 'Telia Company', url: 'https://www.telia.se/' },
  { image: 'welbi.png', title: 'Welbi', url: 'https://www.welbi.co/' },
  { image: 'wix.png', title: 'Wix', url: 'https://www.wix.com/' }
];

function AdvocateCard(props: { advocate: IAdvocate }): JSX.Element {
  const advocate: IAdvocate = props.advocate;

  if (advocate.url) {
    return (
      <div className={styles.advocateCard}>
        <Link to={advocate.url}>
          <img src={`/images/3rdparty/${advocate.image}`} alt={`${advocate.title} logo`} />
          <div>{advocate.title}</div>
        </Link>
      </div>
    );
  } else {
    return (
      <div className={styles.advocateCard}>
        <img src={`/images/3rdparty/${advocate.image}`} alt={`${advocate.title} logo`} />
        <div>{advocate.title}</div>
      </div>
    );
  }
}

function CustomPage(props: {}): JSX.Element {
  let advocateKey: number = 1;

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
              <Link
                to="pages/intro/welcome"
                className={['button', 'button--secondary', styles.mastheadButton].join(' ')}
              >
                Learn More
              </Link>
            </div>
            <div style={{ marginRight: 'auto', marginLeft: '1rem' }}>
              <Link
                to="pages/intro/get_started"
                className={['button', 'button--primary', styles.mastheadButton].join(' ')}
              >
                Get Started!
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: '50rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '15px',
          paddingRight: '15px'
        }}
      >
        <p style={{ fontSize: '1.25rem', fontWeight: 300 }}>
          Rush makes life easier for JavaScript developers who build and publish many packages from a common
          Git repo. If you're looking to break up your giant application into smaller pieces, and you already
          realized <Link to="pages/intro/why_mono"> why it doesn't work</Link> to put each package in a
          separate repo... then Rush is for you!
        </p>
        <div className={['container', styles.hideWhenNarrow].join(' ')} style={{ textAlign: 'center' }}>
          <img src="/images/home/mono-concept-h.svg" style={{ paddingRight: '2em' }} alt="monorepo diagram" />
        </div>

        <div className={['container', styles.showWhenNarrow].join(' ')} style={{ textAlign: 'center' }}>
          <img src="/images/home/mono-concept-v.svg" width="80%" alt="monorepo diagram" />
        </div>

        <h1 style={{ paddingTop: '5rem' }}>The Rush difference</h1>
        <p>
          These days many different tools can run "npm install" and "npm run build" in 20 different folders.
          What's so great about <b>Rush</b>?
        </p>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-repo.svg" width="100%" height="100%" alt="Git repositories" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>Ready for large repos</h2>
            <p>
              At Microsoft, we build monorepos with hundreds of projects. Rush's unique installation strategy
              produces a single shrinkwrap/lock file for all your projects that installs extremely fast. Rush
              supports parallel builds, subset builds, and incremental builds. Distributed multi-machine
              builds are coming soon!
            </p>
          </div>
        </div>

        <div className={styles.cardContainerRight}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-people.svg" width="100%" height="100%" alt="large team" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>Designed for large teams</h2>
            <p>
              Rush provides many mechanisms for onboarding newcomers and coordinating collaboration between
              teams. Repo policies allow new package dependencies to be reviewed before they are accepted.
              Rush can enforce consistent dependency versions across your repo. Different subsets of projects
              can publish separately with lockstep or independent versioning strategies, private releases, and
              so forth.
            </p>
          </div>
        </div>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-phantom.svg" width="80%" height="80%" alt="NPM phantom dependency" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>No phantom dependencies!</h2>
            <p>
              Tired of broken imports or mismatched versions when someone else installs your package? Rush's
              isolated symlinking model eliminates these NPM{' '}
              <Link to="pages/advanced/phantom_deps">phantom dependencies</Link>, ensuring you'll never again
              accidentally import a library that was missing from package.json.
            </p>
            <p>
              This algorithm is compatible with <b>PNPM</b>, <b>NPM</b>, and <b>Yarn</b> package managers.
            </p>
          </div>
        </div>

        <div className={styles.cardContainerRight}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-doppel.svg" width="80%" height="80%" alt="NPM doppelganger" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>No NPM doppelgangers!</h2>
            <p>
              Rush's installation model now supports the <b>PNPM</b> package manager, which eliminates{' '}
              <Link to="pages/advanced/npm_doppelgangers">NPM doppelgangers</Link>. You'll never again find 5
              copies of the same version of the same library in your node_modules folder!
            </p>
          </div>
        </div>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-trike.svg" width="100%" height="100%" alt="motorbike and tricycle" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>Easy to administer</h2>
            <p>
              When you maintain a large repo, you don't want developers opening support tickets that can't be
              reproduced on any other computer. Rush helps to ensure that installs and builds are completely
              deterministic. Even the Rush engine version is automatically installed according to your Git
              branch. If you define custom commands or options, they are strictly validated and documented as
              part of Rush's command-line help.
            </p>
          </div>
        </div>

        <div className={styles.cardContainerRight}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-knife.svg" width="100%" height="100%" alt="army knife" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>Turnkey solution</h2>
            <p>
              Tired of cobbling together your developer experience from multiple tools that never seem to
              integrate properly? Rush is a unified orchestrator that can install, link, build, generate
              change logs, publish, and bump versions.
            </p>
          </div>
        </div>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-free.svg" width="100%" height="100%" alt="free price tag" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>Open model</h2>
            <p>
              The Rush software is free and open source. Community contributions are welcome! We're also
              open-minded about your toolchain: In a Rush repo, each project folder remains fully
              self-contained, individually installable, and easy to relocate if needed. Relatively little
              effort is required to enable/disable Rush for a given set of projects.
            </p>
          </div>
        </div>

        <h1 style={{ paddingTop: '5rem' }}>Who's using Rush?</h1>

        <div className="row" style={{ paddingBottom: '8rem', justifyContent: 'center' }}>
          {advocates.map((x) => (
            <AdvocateCard key={`item-${++advocateKey}`} advocate={x} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default CustomPage;
