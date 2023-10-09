import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

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
  console.log(advocate);
  if (advocate.url) {
    const linkStyle = {
      color: 'inherit'
    };

    return (
      <div className={styles.advocateCard}>
        <Link to={advocate.url} style={linkStyle}>
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
                <Translate id="home.masthead.subtitle">
                  Rush: a scalable monorepo manager for the web
                </Translate>
              </h2>
            </div>
          </div>
          <div className="row" style={{ paddingTop: '2rem', justifyContent: 'center', gap: '2rem' }}>
            <div>
              <Link
                to="pages/intro/welcome"
                className={['button', 'button--secondary', styles.mastheadButton].join(' ')}
              >
                <Translate id="home.masthead.learnMore">Learn More</Translate>
              </Link>
            </div>
            <div>
              <Link
                to="pages/intro/get_started"
                className={['button', 'button--primary', styles.mastheadButton].join(' ')}
              >
                <Translate id="home.masthead.getStarted">Get Started!</Translate>
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
          <Translate id="home.content.intro.span1">
            Rush makes life easier for JavaScript developers who build and publish many packages from a common
            Git repo. If you're looking to break up your giant application into smaller pieces, and you
            already realized
          </Translate>{' '}
          <Link to="pages/intro/why_mono">
            <Translate id="home.content.intro.span2">why it doesn't work</Translate>
          </Link>{' '}
          <Translate id="home.content.intro.span3">
            to put each package in a separate repo... then Rush is for you!
          </Translate>
        </p>
        <div className={['container', styles.hideWhenNarrow].join(' ')} style={{ textAlign: 'center' }}>
          <img src="/images/home/mono-concept-h.svg" style={{ paddingRight: '2em' }} alt="monorepo diagram" />
        </div>

        <div className={['container', styles.showWhenNarrow].join(' ')} style={{ textAlign: 'center' }}>
          <img src="/images/home/mono-concept-v.svg" width="80%" alt="monorepo diagram" />
        </div>

        <h1 style={{ paddingTop: '5rem' }}>
          <Translate id="home.content.boxIntro.header">The Rush difference</Translate>
        </h1>
        <p>
          <Translate id="home.content.boxIntro.span1">
            These days many different tools can run "npm install" and "npm run build" in 20 different folders.
            What's so great about Rush?
          </Translate>
        </p>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-repo.svg" width="100%" height="100%" alt="Git repositories" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>
              <Translate id="home.content.box1.header">Ready for large repos</Translate>
            </h2>
            <p>
              <Translate id="home.content.box1.span1">
                Rush is built by professional engineers who maintain large production monorepos. Our job is to
                provide the best developer experience for our colleagues, not to convert you into a customer
                for a paid consulting or hosting service. The repositories we maintain contain hundreds of
                apps with many years of Git history. To manage this scale, Rush offers parallel builds, subset
                builds, incremental builds, and distributed builds.
              </Translate>
            </p>
          </div>
        </div>

        <div className={styles.cardContainerRight}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-people.svg" width="100%" height="100%" alt="large team" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>
              <Translate id="home.content.box2.header">Designed for large teams</Translate>
            </h2>
            <p>
              <Translate id="home.content.box2.span1">
                Rush provides many mechanisms for onboarding newcomers and coordinating collaboration between
                teams. Repo policies allow new package dependencies to be reviewed before they are accepted.
                Rush can enforce consistent dependency versions across your repo. Different subsets of
                projects can publish separately with lockstep or independent versioning strategies.
              </Translate>
            </p>
          </div>
        </div>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-phantom.svg" width="80%" height="80%" alt="NPM phantom dependency" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>
              <Translate id="home.content.box3.header">Reliable NPM installations</Translate>
            </h2>
            <p>
              <Translate id="home.content.box3.span1">
                Rush's installation model leverages the PNPM package manager to eliminate the
              </Translate>{' '}
              <Link to="pages/advanced/phantom_deps">
                <Translate id="home.content.box3.span2">phantom dependencies</Translate>
              </Link>{' '}
              <Translate id="home.content.box3.span3">and</Translate>{' '}
              <Link to="pages/advanced/npm_doppelgangers">
                <Translate id="home.content.box3.span4">NPM doppelgangers</Translate>
              </Link>{' '}
              <Translate id="home.content.box3.span5">
                that frustrate large scale installations. You can visualize and troubleshoot version conflicts
                using our
              </Translate>{' '}
              <Link to="https://lfx.rushstack.io">
                <Translate id="home.content.box3.span6">Lockfile Explorer</Translate>
              </Link>{' '}
              <Translate id="home.content.box3.span7">companion tool.</Translate>
            </p>
          </div>
        </div>

        <div className={styles.cardContainerRight}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-trike.svg" width="100%" height="100%" alt="motorbike and tricycle" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>
              <Translate id="home.content.box4.header">Easy to administer</Translate>
            </h2>
            <p>
              <Translate id="home.content.box4.span1">
                When you maintain a large repo, you don't want developers opening support tickets that can't
                be reproduced on any other computer. Rush helps to ensure that installs and builds are
                completely deterministic. Even the Rush engine version is automatically installed according to
                your Git branch. If you define custom commands or options, they are strictly validated and
                documented as part of Rush's command-line help.
              </Translate>
            </p>
          </div>
        </div>

        <div className={styles.cardContainerLeft}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-knife.svg" width="100%" height="100%" alt="army knife" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>
              <Translate id="home.content.box5.header">Turnkey solution</Translate>
            </h2>
            <p>
              <Translate id="home.content.box5.span1">
                Tired of cobbling together your developer experience from multiple tools that never seem to
                integrate properly? Rush is a unified orchestrator that can install, link, build, generate
                change logs, publish, and bump versions. These features are designed to integrate with the
                broader
              </Translate>{' '}
              <Link to="https://rushstack.io">
                <Translate id="home.content.box5.span2">Rush Stack</Translate>
              </Link>{' '}
              <Translate id="home.content.box5.span3">suite of tools and practices.</Translate>
            </p>
          </div>
        </div>

        <div className={styles.cardContainerRight}>
          <div className={styles.cardImageBox}>
            <img src="/images/home/card-free.svg" width="100%" height="100%" alt="free price tag" />
          </div>
          <div className={styles.cardContentBox}>
            <h2>
              <Translate id="home.content.box6.header">Open model</Translate>
            </h2>
            <p>
              <Translate id="home.content.box6.span1">
                The Rush software is free and open source. Community contributions are welcome! We're also
                open-minded about your toolchain: In a Rush repo, each project folder remains fully
                self-contained, individually installable, and easy to relocate if needed. Relatively little
                effort is required to enable/disable Rush for a given set of projects.
              </Translate>
            </p>
          </div>
        </div>

        <h1 style={{ paddingTop: '5rem' }}>
          <Translate id="home.whosUsingRush">Who's using Rush?</Translate>
        </h1>
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
