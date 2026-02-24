// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { getSiteConfig, lightCodeTheme, darkCodeTheme } = require('site-config');
const siteConfig = getSiteConfig(require('./package.json').name);

const { plugin: remarkCanonicalLinkPlugin } = require('remark-canonical-link-plugin');
const { plugin: remarkCrossSiteLinkPlugin } = require('remark-cross-site-link-plugin');
const { plugin: rehypeHeaderlessTablePlugin } = require('rehype-headerless-table-plugin');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Heft',
  // tagline: 'Dinosaurs are cool',
  url: 'https://heft.rushstack.io',
  baseUrl: '/',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn']
  },

  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  favicon: 'images/site/favicon.ico',
  organizationName: 'microsoft',
  projectName: 'heft.rushstack.io-website',

  // Deployment settings above can be overridden based on the TARGET determined at runtime
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
          editUrl: 'https://github.com/microsoft/rushstack-websites/tree/main/websites/heft.rushstack.io/',
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
                prefix: 'https://heft.rushstack.io/'
              }
            ]
          ],
          rehypePlugins: [rehypeHeaderlessTablePlugin],
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Current Release',
              badge: false
            }
          }
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/microsoft/rushstack-websites/tree/main/websites/heft.rushstack.io/blog/'
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
      image: 'images/site/heft-ograph.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'Heft',
          src: 'images/site/heft-logo.svg'
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownActiveClassDisabled: true
          },
          {
            type: 'localeDropdown',
            position: 'left'
          },
          {
            to: 'pages/intro/getting_started',
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
        style: 'light', // Use --ifm-footer-background-color always

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
        typesenseCollectionName: 'heft.rushstack.io',

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
