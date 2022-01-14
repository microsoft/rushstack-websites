// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const { SKIP_API_DOCS, SITE_PREFIXES } = require('./custom.config.js');

const { getSiteConfig } = require('site-config');
const siteConfig = getSiteConfig(require('./package.json').name);

const { plugin: remarkCanonicalLinkPlugin } = require('remark-canonical-link-plugin');
const { plugin: remarkCrossSiteLinkPlugin } = require('remark-cross-site-link-plugin');
const { plugin: rehypeHeaderlessTablePlugin } = require('rehype-headerless-table-plugin');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rush Stack',
  // tagline: 'Dinosaurs are cool',
  url: 'https://rushstack.io',
  baseUrl: '/',

  trailingSlash: true,

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

  themes: ['docusaurus-theme-search-typesense'],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/microsoft/rushstack-websites/tree/main/websites/rushstack.io/',
          remarkPlugins: [
            [
              remarkCrossSiteLinkPlugin,
              {
                prefixes: siteConfig.sitePrefixes
              }
            ],
            [
              remarkCanonicalLinkPlugin,
              {
                prefix: 'https://rushstack.io/'
              }
            ]
          ],
          rehypePlugins: [rehypeHeaderlessTablePlugin],
          ...(SKIP_API_DOCS ? { exclude: ['api/**/*.md'] } : {})
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/microsoft/rushstack-websites/tree/main/websites/rushstack.io/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      navbar: {
        title: '',
        logo: {
          alt: 'Rush Stack',
          src: 'images/rushstack.svg'
        },
        items: [
          {
            to: '/',
            position: 'right',
            label: 'Docs',
            activeBaseRegex: 'pages/(?!help/support)(?!contributing/get_started)(?!news)(?!shop)(?!api)'
          },
          ...(SKIP_API_DOCS
            ? []
            : [
                {
                  type: 'doc',
                  docId: 'pages/api/index',
                  position: 'right',
                  label: 'API'
                }
              ]),
          {
            type: 'doc',
            docId: 'pages/shop',
            position: 'right',
            label: 'Shop'
          },
          {
            type: 'doc',
            docId: 'pages/news',
            position: 'right',
            label: 'News'
          },
          {
            to: '/community/events',
            position: 'right',
            label: 'Events'
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
        ]
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
        darkTheme: darkCodeTheme
      },
      typesense: {
        // Replace with your own doc site's name. Should match the collection name in the scraper settings.
        typesenseCollectionName: 'rushstack.io',

        typesenseServerConfig: {
          nodes: [
            {
              host: 'rscommunity.octogonz.com',
              port: 443,
              protocol: 'https'
            }
          ],
          apiKey: 'sT4V46j9PmFlJ5MP7IAofccKSpJlOxfF'
        },

        // Optional: Typesense search parameters: https://typesense.org/docs/0.21.0/api/documents.html#arguments
        typesenseSearchParameters: {}

        // TODO: This feature is temporarily disabled as a workaround for this problem:
        // https://github.com/typesense/docusaurus-theme-search-typesense/pull/7
        //contextualSearch: true
      }
    }
};

module.exports = config;
