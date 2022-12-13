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
  title: 'Lockfile Explorer',
  // tagline: 'Dinosaurs are cool',
  url: 'https://lfx.rushstack.io',
  baseUrl: '/',
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  favicon: 'images/site/favicon.ico',
  organizationName: 'microsoft',
  projectName: 'lfx.rushstack.io-website',

  // Deployment settings above can be overriden based on the TARGET determined at runtime
  ...siteConfig.configOverrides,

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic',
      type: 'text/css'
    }
  ],

  themes: ['docusaurus-theme-search-typesense', 'theme-rushstack-suite-nav'],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: false,
          // Please change this to your repo.
          editUrl: 'https://github.com/microsoft/rushstack-websites/tree/main/websites/lfx.rushstack.io/',
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
                prefix: 'https://lfx.rushstack.io/'
              }
            ]
          ],
          rehypePlugins: [rehypeHeaderlessTablePlugin]
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/microsoft/rushstack-websites/tree/main/websites/lfx.rushstack.io/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: 'images/site/lfx-ograph.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'Lockfile Explorer',
          src: 'images/site/lockfile-explorer.svg'
        },
        items: [
          {
            type: 'localeDropdown',
            position: 'left'
          },
          {
            to: 'pages/basics/getting_started',
            position: 'right',
            label: 'Docs',
            activeBaseRegex: 'pages/(?!support)'
          },
          {
            to: 'pages/support/news',
            position: 'right',
            label: 'News',
            activeBasePath: 'pages/support/news'
          },
          {
            to: 'pages/support/contributing',
            position: 'right',
            label: 'GitHub',
            activeBasePath: 'pages/support/contributing'
          },
          {
            to: 'pages/support/help',
            position: 'right',
            label: 'Help',
            activeBasePath: 'pages/support/help'
          }
        ]
      },
      footer: {
        style: 'dark',

        links: [],
        copyright: `© ${new Date().getFullYear()} Microsoft`
      },
      colorMode: {
        // TODO: Implement dark mode color theme
        defaultMode: 'light',
        disableSwitch: true
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['batch', 'json5', 'powershell']
      },
      typesense: {
        // Replace with your own doc site's name. Should match the collection name in the scraper settings.
        typesenseCollectionName: 'lfx.rushstack.io',

        typesenseServerConfig: {
          nodes: [
            {
              host: 'search.rushstack.io',
              port: 443,
              protocol: 'https'
            }
          ],
          apiKey: 'sT4V46j9PmFlJ5MP7IAofccKSpJlOxfF'
        },

        // Optional: Typesense search parameters: https://typesense.org/docs/0.21.0/api/documents.html#arguments
        typesenseSearchParameters: {},

        contextualSearch: true
      }
    }
};

module.exports = config;
