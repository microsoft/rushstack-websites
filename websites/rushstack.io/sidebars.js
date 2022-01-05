/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

const { SKIP_API_DOCS } = require('./custom.config.js');

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsible: false,
      items: [
        'index',
        'pages/overview/people',
        'pages/overview/roadmap'
      ]
    },
    {
      type: 'category',
      label: 'Heft',
      collapsible: false,
      items: [
        {
          type: 'doc',
          label: 'Introduction',
          id: 'pages/heft/overview'
        },
        {
          type: 'doc',
          label: 'Architecture',
          id: 'pages/heft/architecture'
        },
        'pages/heft/core_plugins',
        'pages/heft/rig_packages',
        'pages/heft/cli'
      ]
    },
    {
      type: 'category',
      label: 'Heft tutorials',
      collapsible: false,
      items: [
        'pages/heft_tutorials/getting_started',
        'pages/heft_tutorials/adding_tasks',
        'pages/heft_tutorials/everyday_commands',
        'pages/heft_tutorials/heft_and_rush'
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
          id: 'pages/heft_tasks/api-extractor',
        },
        {
          type: 'doc',
          label: 'copy-files',
          id: 'pages/heft_tasks/copy-files'
        },
        {
          type: 'doc',
          label: 'copy-static-assets',
          id: 'pages/heft_tasks/copy-static-assets'
        },
        {
          type: 'doc',
          label: 'delete-globs',
          id: 'pages/heft_tasks/delete-globs'
        },
        {
          type: 'doc',
          label: 'eslint',
          id: 'pages/heft_tasks/eslint'
        },
        {
          type: 'doc',
          label: 'jest',
          id: 'pages/heft_tasks/jest'
        },
        {
          type: 'doc',
          label: 'node-service',
          id: 'pages/heft_tasks/node-service'
        },
        {
          type: 'doc',
          label: 'sass-typings',
          id: 'pages/heft_tasks/sass-typings'
        },
        {
          type: 'doc',
          label: 'tslint',
          id: 'pages/heft_tasks/tslint'
        },
        {
          type: 'doc',
          label: 'typescript',
          id: 'pages/heft_tasks/typescript'
        },
        {
          type: 'doc',
          label: 'webpack',
          id: 'pages/heft_tasks/webpack'
        },
      ]
    },
    {
      type: 'category',
      label: 'Heft config files',
      collapsible: false,
      items: [
        'pages/heft_configs/api-extractor-task_json',
        'pages/heft_configs/heft_json',
        'pages/heft_configs/node-service_json',
        'pages/heft_configs/rig_json',
        'pages/heft_configs/sass_json',
        'pages/heft_configs/typescript_json',
        'pages/heft_configs/other_files'
      ]
    },
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      items: [
        'pages/contributing/get_started'
      ]
    },
    {
      type: 'category',
      label: 'Help',
      collapsible: false,
      items: [
        'pages/help/support'
      ]
    }
  ],
  apiSidebar: SKIP_API_DOCS ? [] : [require('./data/api_nav.json')]
};

module.exports = sidebars;
