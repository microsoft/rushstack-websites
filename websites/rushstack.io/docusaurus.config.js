// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const { SKIP_API_DOCS, SITE_PREFIXES } = require('./custom.config.js');

const { getSiteConfig } = require('site-config');
const siteConfig = getSiteConfig(require('./package.json').name);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rush Stack',
  // tagline: 'Dinosaurs are cool',
  url: 'https://rushstack.io',
  baseUrl: '/',

  // TOOD: Discover and fix all broken links before we deploy.
  // TODO: Decide if we want broken links to actually fail deployment
  // (potentially long turn-around time?).
  onBrokenLinks: 'log', //'throw',
  onBrokenMarkdownLinks: 'log', //'warn',

  favicon: 'images/favicon.ico',
  organizationName: 'microsoft',
  projectName: 'rushstack.io-website',

  // Deployment settings above can be overriden based on the TARGET determined at runtime
  ...siteConfig.configOverrides,

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'pages',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/microsoft/rushstack-websites/',
          remarkPlugins: [
            [
              require('./src/remark/remark-cross-site-link-plugin'),
              {
                prefixes: siteConfig.sitePrefixes
              }
            ],
            [
              require('./src/remark/remark-canonical-link-plugin'),
              {
                prefix: 'https://rushstack.io/'
              }
            ]
          ],
          rehypePlugins: [
            require('./src/rehype/rehype-headerless-table-plugin')
          ],
          ...(SKIP_API_DOCS ? { exclude: ['api/**/*.md'] } : {})
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Rush Stack',
          src: 'images/rushstack.svg',
        },
        items: [
          {
            to: 'pages/index',
            position: 'right',
            label: 'Docs',
            activeBaseRegex: 'pages/(?!help/support)(?!contributing/get_started)(?!news)(?!shop)'
          },
          ...(SKIP_API_DOCS ? [] : [
            {
              type: 'doc',
              docId: 'api/index',
              position: 'right',
              label: 'API',
            }
          ]),
          {
            type: 'doc',
            docId: 'shop',
            position: 'right',
            label: 'Shop',
          },
          {
            type: 'doc',
            docId: 'news',
            position: 'right',
            label: 'News',
          },
          {
            to: 'pages/contributing/get_started',
            position: 'right',
            label: 'GitHub',
            activeBasePath: 'pages/contributing/get_started'
          },
          {
            to: 'pages/help/support',
            position: 'right',
            label: 'Help',
            activeBasePath: 'pages/help/support'
          }
        ],
      },
      footer: {
        style: 'dark',

        links: [
          /*
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
          */
        ],
        copyright: `© ${new Date().getFullYear()} Microsoft`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'W2G1E3U5T0',
        apiKey: 'a0ab6dfc3db0c301b0ca8e725af85641',
        indexName: 'rushstack.io',
        searchParameters: {
          exclusionPatterns: [
            'pages/api/*'
          ]
        }
      }
    }),
};

module.exports = config;
