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
      items: [
        'index',
        'pages/intro/getting_started',
        'pages/intro/architecture',
        'pages/intro/rig_packages',
        'pages/intro/cli'
      ]
    },
    {
      type: 'category',
      label: 'Heft tutorials',
      collapsible: false,
      items: [
        'pages/tutorials/hello_world',
        'pages/tutorials/adding_tasks',
        'pages/tutorials/everyday_commands',
        'pages/tutorials/heft_and_rush'
      ]
    },
    {
      type: 'category',
      label: 'Advanced topics',
      collapsible: false,
      items: ['pages/advanced/heft-config-file', 'pages/advanced/authoring-plugins']
    },
    {
      type: 'category',
      label: 'Heft plugins',
      collapsible: false,
      items: [
        {
          type: 'doc',
          label: '(package index)',
          id: 'pages/plugins/package_index'
        },
        {
          type: 'doc',
          label: 'API Extractor',
          id: 'pages/plugins/api-extractor'
        },
        {
          type: 'doc',
          label: 'Copy files',
          id: 'pages/plugins/copy-files'
        },
        {
          type: 'doc',
          label: 'Delete files',
          id: 'pages/plugins/delete-files'
        },
        {
          type: 'doc',
          label: 'Dev certificate',
          id: 'pages/plugins/dev-cert'
        },
        {
          type: 'doc',
          label: 'Jest',
          id: 'pages/plugins/jest'
        },
        {
          type: 'doc',
          label: 'ESlint / TSLint',
          id: 'pages/plugins/lint'
        },
        {
          type: 'doc',
          label: 'Node.js service',
          id: 'pages/plugins/node-service'
        },
        {
          type: 'doc',
          label: 'Rspack',
          id: 'pages/plugins/rspack'
        },
        {
          type: 'doc',
          label: 'Run script',
          id: 'pages/plugins/run-script'
        },
        {
          type: 'doc',
          label: 'Sass',
          id: 'pages/plugins/sass'
        },
        {
          type: 'doc',
          label: 'Serverless Stack',
          id: 'pages/plugins/serverless-stack'
        },
        {
          type: 'doc',
          label: 'Storybook',
          id: 'pages/plugins/storybook'
        },
        {
          type: 'doc',
          label: 'TypeScript',
          id: 'pages/plugins/typescript'
        },
        {
          type: 'doc',
          label: 'Webpack',
          id: 'pages/plugins/webpack'
        }
      ]
    },
    {
      type: 'category',
      label: 'Heft config files',
      collapsible: false,
      items: [
        'pages/configs/environment_vars',
        'pages/configs/api-extractor-task_json',
        'pages/configs/heft_json',
        'pages/configs/node-service_json',
        'pages/configs/rig_json',
        'pages/configs/sass_json',
        'pages/configs/typescript_json',
        'pages/configs/other_files'
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
