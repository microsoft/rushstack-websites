import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

function CustomPage(props: {}): JSX.Element {
  let advocateKey: number = 1;

  return (
    <Layout>
      <header style={{ marginLeft: 'auto', marginRight: 'auto', paddingTop: '40px' }}>
        <img
          height="189px"
          alt="API Extractor Logo"
          width="533px"
          src="/images/site/api-extractor-title.png"
        />
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
        {
          // ----------------------------------------------------------------------------
          // Text below this line should stay in sync with api-extractor's README.md file
          // ----------------------------------------------------------------------------
        }

        <p>
          <strong>API Extractor</strong> helps you build better{' '}
          <a href="https://www.typescriptlang.org/">TypeScript</a> library packages. Suppose for example that
          your company has published an NPM package called “<strong>awesome-widgets</strong>” that exports
          many classes and interfaces. As developers start to depend on your library, you may encounter issues
          such as…
        </p>

        <ul>
          <li>
            <p>
              <strong>Accidental breaks:</strong> People keep reporting that their code won&rsquo;t compile
              after a supposedly “minor” update. To address this, you boldly propose that every{' '}
              <strong>awesome-widgets</strong> pull request must be approved by an experienced developer from
              your team. But that proves unrealistic -- nobody has time to look at every single PR! What you
              really need is a way to detect PRs that change API contracts, and flag them for review. That
              would focus attention in the right place… but how to do that?
            </p>
          </li>
          <li>
            <p>
              <strong>Missing exports:</strong> Suppose the <strong>awesome-widgets</strong> package exports
              an API function <code className="highlighter-rouge">AwesomeButton.draw()</code> that requires a
              parameter of type <code className="highlighter-rouge">DrawStyle</code>, but you forgot to export
              this enum. Things seem fine at first, but when a developer tries to call that function, they
              discover that there&rsquo;s no way to specify the{' '}
              <code className="highlighter-rouge">DrawStyle</code>. How to avoid these oversights?
            </p>
          </li>
          <li>
            <p>
              <strong>Accidental exports:</strong> You meant for your{' '}
              <code className="highlighter-rouge">DrawHelper</code> class to be kept internal, but one day you
              realize it&rsquo;s being exported. When you try to remove it, consumers complain that
              they&rsquo;re using it. How do we avoid this in the future?
            </p>
          </li>
          <li>
            <p>
              <strong>Alpha/Beta graduation:</strong> You want to release previews of new APIs that are not
              ready for prime time yet. But if you did a major SemVer bump every time these definitions
              evolve, the villagers would be after you with torches and pitchforks! A better approach is to
              designate certain classes/members as <strong>alpha</strong> quality, then promote them to{' '}
              <strong>beta</strong> and finally to <strong>public</strong> as they mature. But how to indicate
              this to your consumers? (And how to detect scoping mistakes? A <strong>public</strong> function
              should never return a <strong>beta</strong> result.)
            </p>
          </li>
          <li>
            <p>
              <strong>*.d.ts rollup:</strong> You webpacked your library into a nice <strong>*.js</strong>{' '}
              bundle file &ndash; so why ship your typings as a messy tree of <strong>lib/*.d.ts</strong>{' '}
              files full of private definitions? Can&rsquo;t we consolidate them into a tidy{' '}
              <strong>*.d.ts</strong> rollup file? And if you publish internal/beta/public releases, each
              release type should get its own <strong>*.d.ts</strong> file with appropriate trimming.
              Developers building a production project don&rsquo;t want to see a bunch of{' '}
              <strong>internal</strong> and <strong>beta</strong> members in their VS Code IntelliSense!
            </p>
          </li>
          <li>
            <p>
              <strong>Online documentation:</strong> You have faithfully annotated each TypeScript member with
              nice <a href="https://github.com/microsoft/tsdoc">TSDoc</a> descriptions. Now that your library
              has shipped, it&rsquo;s time to set up{' '}
              <a href="https://docs.microsoft.com/en-us/javascript/api/sp-http">a nicely formatted</a> API
              reference. What tool to use?
            </p>
          </li>
        </ul>

        <p>
          <strong>API Extractor</strong> provides an integrated, professional-quality solution for all these
          problems. It is invoked at build time by your toolchain and leverages the TypeScript compiler engine
          to:
        </p>

        <ul>
          <li>Detect a project&rsquo;s exported API surface</li>
          <li>Capture the contracts in a concise report designed to facilitate review</li>
          <li>Warn about common mistakes (e.g. missing exports, inconsistent visibility, etc.)</li>
          <li>Generate *.d.ts rollups with trimming according to release type</li>
          <li>
            Output API documentation in a portable format that&rsquo;s easy to integrate with your content
            pipeline
          </li>
        </ul>

        <p>
          Best of all, <strong>API Extractor</strong> is free and open source. Join the community and create a
          pull request!
        </p>
        {
          // ----------------------------------------------------------------------------
          // Text above this line should stay in sync with api-extractor's README.md file
          // ----------------------------------------------------------------------------
        }

        <div
          className="row"
          style={{
            paddingTop: '1rem',
            paddingBottom: '4rem'
          }}
        >
          <Link
            className="button button--secondary"
            to="pages/overview/intro"
            style={{
              paddingLeft: '3rem',
              paddingRight: '3rem',
              fontSize: '20px',
              fontWeight: 'normal',
              color: '#ffffff',

              marginLeft: 'auto',
              marginRight: '5px'
            }}
          >
            Learn More
          </Link>
          <Link
            className="button button--primary"
            to="pages/setup/invoking"
            style={{
              paddingLeft: '3rem',
              paddingRight: '3rem',
              fontSize: '20px',
              fontWeight: 'normal',
              color: '#ffffff',

              marginRight: 'auto',
              marginLeft: '5px'
            }}
          >
            Get Started!
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default CustomPage;
