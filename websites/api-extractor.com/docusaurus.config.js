// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

const { getSiteConfig } = require('site-config');
const siteConfig = getSiteConfig(require('./package.json').name);

const { plugin: remarkCanonicalLinkPlugin } = require('remark-canonical-link-plugin');
const { plugin: remarkCrossSiteLinkPlugin } = require('remark-cross-site-link-plugin');
const { plugin: rehypeHeaderlessTablePlugin } = require('rehype-headerless-table-plugin');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'API Extractor',
  // tagline: 'Dinosaurs are cool',
  url: 'https://api-extractor.com',
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
  projectName: 'api-extractor.com-website',

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
          editUrl: 'https://github.com/microsoft/rushstack-websites/tree/main/websites/api-extractor.com/',
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
                prefix: 'https://api-extractor.com/'
              }
            ]
          ],
          rehypePlugins: [rehypeHeaderlessTablePlugin]
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/microsoft/rushstack-websites/tree/main/websites/api-extractor.com/blog/'
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
      image: 'images/site/ae-ograph.png',
      navbar: {
        title: 'API Extractor',
        logo: {
          alt: 'API Extractor',
          src: 'images/site/api-extractor.svg'
        },
        items: [
          /*
          {
            type: 'localeDropdown',
            position: 'left'
          },
          */
          {
            to: 'pages/overview/intro',
            position: 'right',
            label: 'Docs',
            activeBaseRegex: 'pages/(?!news)'
          },
          {
            to: 'pages/news',
            position: 'right',
            label: 'News'
          },
          {
            to: 'pages/developer/api',
            position: 'right',
            label: 'API',
            activeBasePath: 'DO_NOT_HIGHLIGHT'
          },
          {
            to: 'pages/contributing/building',
            position: 'right',
            label: 'GitHub',
            activeBasePath: 'DO_NOT_HIGHLIGHT'
          },
          {
            to: 'pages/setup/help',
            position: 'right',
            label: 'Help',
            activeBasePath: 'DO_NOT_HIGHLIGHT'
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
        typesenseCollectionName: 'api-extractor.com',

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
