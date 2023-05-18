/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsible: false,
      items: ['index', 'pages/intro/approach', 'pages/intro/using_tsdoc', 'pages/intro/roadmap']
    },
    {
      type: 'category',
      label: 'NPM packages',
      collapsible: false,
      items: ['pages/packages/tsdoc', 'pages/packages/tsdoc-config', 'pages/packages/eslint-plugin-tsdoc']
    },
    {
      type: 'category',
      label: 'TSDoc spec',
      collapsible: false,
      items: ['pages/spec/overview', 'pages/spec/tag_kinds', 'pages/spec/standardization_groups']
    },
    {
      type: 'category',
      label: 'Tag reference',
      collapsible: false,
      items: [
        'pages/tags/alpha',
        'pages/tags/beta',
        'pages/tags/decorator',
        'pages/tags/deprecated',
        'pages/tags/defaultvalue',
        'pages/tags/eventproperty',
        'pages/tags/example',
        'pages/tags/experimental',
        'pages/tags/inheritdoc',
        'pages/tags/internal',
        'pages/tags/label',
        'pages/tags/link',
        'pages/tags/override',
        'pages/tags/packagedocumentation',
        'pages/tags/param',
        'pages/tags/privateremarks',
        'pages/tags/public',
        'pages/tags/readonly',
        'pages/tags/remarks',
        'pages/tags/returns',
        'pages/tags/sealed',
        'pages/tags/see',
        'pages/tags/throws',
        'pages/tags/typeparam',
        'pages/tags/virtual'
      ]
    },
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      items: ['pages/contributing/github', 'pages/contributing/building', 'pages/contributing/pr_checklist']
    },
    {
      type: 'category',
      label: 'Resources',
      collapsible: false,
      items: [
        'pages/resources/help',
        {
          type: 'link',
          label: 'TSDoc Playground',
          href: '/play'
        }
      ]
    }
  ]
};

module.exports = sidebars;
