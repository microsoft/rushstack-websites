// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const { getSiteConfig } = require('site-config');
const siteConfig = getSiteConfig(require('./package.json').name);

const { plugin: remarkCanonicalLinkPlugin } = require('remark-canonical-link-plugin');
const { plugin: remarkCrossSiteLinkPlugin } = require('remark-cross-site-link-plugin');
const { plugin: rehypeHeaderlessTablePlugin } = require('rehype-headerless-table-plugin');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rush',
  // tagline: 'Dinosaurs are cool',
  url: 'https://rushjs.io',
  baseUrl: '/',

  trailingSlash: true,

  // TOOD: Discover and fix all broken links before we deploy.
  // TODO: Decide if we want broken links to actually fail deployment
  // (potentially long turn-around time?).
  onBrokenLinks: 'log', //'throw',
  onBrokenMarkdownLinks: 'log', //'warn',

  favicon: 'images/favicon.ico',
  organizationName: 'microsoft',
  projectName: 'rushjs.io-website',

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
          rehypePlugins: [rehypeHeaderlessTablePlugin]
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Rush',
          src: 'images/rush-horiz.svg'
        },
        items: [
          {
            to: 'pages/intro/welcome',
            position: 'right',
            label: 'Docs',
            activeBaseRegex: 'pages/(?!help)(?!news)(?!advanced/api)'
          },
          {
            type: 'doc',
            docId: 'news',
            position: 'right',
            label: 'News'
          },
          {
            to: 'pages/advanced/api',
            position: 'right',
            label: 'API',
            activeBasePath: 'pages/advanced/api'
          },
          {
            to: 'pages/contributing',
            position: 'right',
            label: 'GitHub',
            activeBasePath: 'pages/contributing'
          },
          {
            to: 'pages/help/support',
            position: 'right',
            label: 'Help',
            activeBaseRegex: 'pages/help/'
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
      algolia: {
        appId: 'W2G1E3U5T0',
        apiKey: 'a0ab6dfc3db0c301b0ca8e725af85641',
        indexName: 'rushjs.io',
        searchParameters: {
          exclusionPatterns: ['pages/api/*']
        }
      }
    })
};

module.exports = config;
