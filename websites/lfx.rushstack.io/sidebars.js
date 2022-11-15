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
      items: ['index', 'pages/basics/getting_started']
    },
    {
      type: 'category',
      label: 'Versioning Concepts',
      collapsible: false,
      items: [
        'pages/concepts/version_conflicts',
        'pages/concepts/semver',
        'pages/concepts/install_models',
        'pages/concepts/tracing_resolution',
        //        'pages/concepts/pnpm_lockfile',
        'pages/concepts/strict_settings'
      ]
    },
    /*
    {
      type: 'category',
      label: 'App Features',
      collapsible: false,
      items: [
        'pages/features/entries',
        'pages/features/package_spec',
        'pages/features/the_graph',
        'pages/features/influencers',
        'pages/features/other_features'
      ]
    },
    */
    {
      type: 'category',
      label: 'Scenarios',
      collapsible: false,
      items: [
        'pages/scenarios/demos_repo',
        'pages/scenarios/side-by-side_versions',
        'pages/scenarios/peer_dependencies',
        'pages/scenarios/npm_doppelgangers'
        //        'pages/scenarios/phantom_dependencies'
      ]
    },
    {
      type: 'category',
      label: 'Support',
      collapsible: false,
      items: ['pages/support/help', 'pages/support/news', 'pages/support/contributing']
    }
  ]
};

module.exports = sidebars;
