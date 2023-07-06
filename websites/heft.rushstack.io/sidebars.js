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
        'pages/intro/core_plugins',
        'pages/intro/rig_packages',
        'pages/intro/cli'
      ]
    },
    {
      type: 'category',
      label: 'Heft tutorials',
      collapsible: false,
      items: [
        'pages/tutorials/getting_started',
        'pages/tutorials/adding_tasks',
        'pages/tutorials/everyday_commands',
        'pages/tutorials/heft_and_rush'
      ]
    },
    {
      type: 'category',
      label: 'Heft tasks',
      collapsible: false,
      items: [
        {
          type: 'doc',
          label: 'api-extractor',
          id: 'pages/tasks/api-extractor'
        },
        {
          type: 'doc',
          label: 'copy-files',
          id: 'pages/tasks/copy-files'
        },
        {
          type: 'doc',
          label: 'copy-static-assets',
          id: 'pages/tasks/copy-static-assets'
        },
        {
          type: 'doc',
          label: 'delete-globs',
          id: 'pages/tasks/delete-globs'
        },
        {
          type: 'doc',
          label: 'eslint',
          id: 'pages/tasks/eslint'
        },
        {
          type: 'doc',
          label: 'jest',
          id: 'pages/tasks/jest'
        },
        {
          type: 'doc',
          label: 'node-service',
          id: 'pages/tasks/node-service'
        },
        {
          type: 'doc',
          label: 'sass-typings',
          id: 'pages/tasks/sass-typings'
        },
        {
          type: 'doc',
          label: 'tslint',
          id: 'pages/tasks/tslint'
        },
        {
          type: 'doc',
          label: 'typescript',
          id: 'pages/tasks/typescript'
        },
        {
          type: 'doc',
          label: 'webpack',
          id: 'pages/tasks/webpack'
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
