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
        'overview/people',
        'overview/roadmap'
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
          id: 'heft/overview'
        },
        {
          type: 'doc',
          label: 'Architecture',
          id: 'heft/architecture'
        },
        'heft/core_plugins',
        'heft/rig_packages',
        'heft/cli'
      ]
    },
    {
      type: 'category',
      label: 'Heft tutorials',
      collapsible: false,
      items: [
        'heft_tutorials/getting_started',
        'heft_tutorials/adding_tasks',
        'heft_tutorials/everyday_commands',
        'heft_tutorials/heft_and_rush'
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
          id: 'heft_tasks/api-extractor',
        },
        {
          type: 'doc',
          label: 'copy-files',
          id: 'heft_tasks/copy-files'
        },
        {
          type: 'doc',
          label: 'copy-static-assets',
          id: 'heft_tasks/copy-static-assets'
        },
        {
          type: 'doc',
          label: 'delete-globs',
          id: 'heft_tasks/delete-globs'
        },
        {
          type: 'doc',
          label: 'eslint',
          id: 'heft_tasks/eslint'
        },
        {
          type: 'doc',
          label: 'jest',
          id: 'heft_tasks/jest'
        },
        {
          type: 'doc',
          label: 'node-service',
          id: 'heft_tasks/node-service'
        },
        {
          type: 'doc',
          label: 'sass-typings',
          id: 'heft_tasks/sass-typings'
        },
        {
          type: 'doc',
          label: 'tslint',
          id: 'heft_tasks/tslint'
        },
        {
          type: 'doc',
          label: 'typescript',
          id: 'heft_tasks/typescript'
        },
        {
          type: 'doc',
          label: 'webpack',
          id: 'heft_tasks/webpack'
        },
      ]
    },
    {
      type: 'category',
      label: 'Heft config files',
      collapsible: false,
      items: [
        'heft_configs/api-extractor-task_json',
        'heft_configs/heft_json',
        'heft_configs/node-service_json',
        'heft_configs/rig_json',
        'heft_configs/sass_json',
        'heft_configs/typescript_json',
        'heft_configs/other_files'
      ]
    },
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      items: [
        'contributing/get_started'
      ]
    },
    {
      type: 'category',
      label: 'Help',
      collapsible: false,
      items: [
        'help/support'
      ]
    }
  ],
  apiSidebar: SKIP_API_DOCS ? [] : [require('./data/api_nav.json')]
};

module.exports = sidebars;
