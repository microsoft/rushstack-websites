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
      label: 'Overview',
      collapsible: false,
      items: ['index', 'pages/overview/people']
    },
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      items: ['pages/contributing/get_started']
    },
    {
      type: 'category',
      label: 'Help',
      collapsible: false,
      items: ['pages/help/support']
    }
  ]
};

module.exports = sidebars;
