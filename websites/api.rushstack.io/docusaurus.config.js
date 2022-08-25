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
  title: 'Rush Stack',
  // tagline: 'Dinosaurs are cool',
  url: 'https://api.rushstack.io',
  baseUrl: '/',

  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  favicon: 'images/favicon.ico',
  organizationName: 'microsoft',
  projectName: 'api.rushstack.io-website',

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
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),

          // TODO: We should replace API Extractor's breadcrumb links with the native
          // Docusaurus breadcrumbs.  This work involves updating the API Documenter template
          // and swizzling @theme/IconHome to remove the house art that clashes with our theme.
          breadcrumbs: false,

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
                prefix: 'https://api.rushstack.io/'
              }
            ]
          ],
          rehypePlugins: [rehypeHeaderlessTablePlugin]
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
            href: 'https://rushstack.io' + '/',
            position: 'right',
            label: 'Docs'
          },
          {
            type: 'doc',
            docId: 'pages/index',
            position: 'right',
            label: 'API'
          },
          {
            href: 'https://rushstack.io' + '/pages/shop',
            position: 'right',
            label: 'Shop'
          },
          {
            href: 'https://rushstack.io' + '/pages/news',
            position: 'right',
            label: 'News'
          },
          {
            href: 'https://rushstack.io' + '/community/events',
            position: 'right',
            label: 'Events'
          },
          {
            href: 'https://rushstack.io' + '/pages/contributing/get_started',
            position: 'right',
            label: 'GitHub'
          },
          {
            href: 'https://rushstack.io' + '/pages/help/support',
            position: 'right',
            label: 'Help'
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
        typesenseCollectionName: 'api.rushstack.io',

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
