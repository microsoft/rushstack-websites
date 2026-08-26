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
      items: [
        'pages/overview/intro',
        'pages/overview/demo_project',
        'pages/overview/demo_api_report',
        'pages/overview/demo_rollup',
        'pages/overview/demo_docs'
      ]
    },
    {
      type: 'category',
      label: 'Setting up your project',
      collapsible: false,
      items: [
        'pages/setup/invoking',
        'pages/setup/configure_api_report',
        'pages/setup/configure_rollup',
        'pages/setup/generating_docs',
        'pages/setup/custom_docs',
        'pages/setup/help'
      ]
    },
    {
      type: 'category',
      label: 'Doc comment syntax',
      collapsible: false,
      items: [
        'pages/tsdoc/doc_comment_syntax',
        'pages/tsdoc/declaration_references',
        'pages/tsdoc/tag_alpha',
        'pages/tsdoc/tag_beta',
        'pages/tsdoc/tag_defaultvalue',
        'pages/tsdoc/tag_deprecated',
        'pages/tsdoc/tag_eventproperty',
        'pages/tsdoc/tag_example',
        'pages/tsdoc/tag_inheritdoc',
        'pages/tsdoc/tag_internal',
        'pages/tsdoc/tag_link',
        'pages/tsdoc/tag_override',
        'pages/tsdoc/tag_packagedocumentation',
        'pages/tsdoc/tag_param',
        'pages/tsdoc/tag_preapproved',
        'pages/tsdoc/tag_privateremarks',
        'pages/tsdoc/tag_public',
        'pages/tsdoc/tag_readonly',
        'pages/tsdoc/tag_remarks',
        'pages/tsdoc/tag_returns',
        'pages/tsdoc/tag_sealed',
        'pages/tsdoc/tag_typeparam',
        'pages/tsdoc/tag_virtual'
      ]
    },
    {
      type: 'category',
      label: 'Message reference',
      collapsible: false,
      items: [
        'pages/messages/ae-cyclic-inherit-doc',
        'pages/messages/ae-different-release-tags',
        'pages/messages/ae-extra-release-tag',
        'pages/messages/ae-forgotten-export',
        'pages/messages/ae-incompatible-release-tags',
        'pages/messages/ae-internal-missing-underscore',
        'pages/messages/ae-internal-mixed-release-tag',
        'pages/messages/ae-misplaced-package-tag',
        'pages/messages/ae-missing-getter',
        'pages/messages/ae-missing-release-tag',
        'pages/messages/ae-preapproved-bad-release-tag',
        'pages/messages/ae-preapproved-unsupported-type',
        'pages/messages/ae-setter-with-docs',
        'pages/messages/ae-undocumented',
        'pages/messages/ae-unresolved-inheritdoc-base',
        'pages/messages/ae-unresolved-inheritdoc-reference',
        'pages/messages/ae-unresolved-link',
        'pages/messages/ae-wrong-input-file-type'
      ]
    },
    {
      type: 'category',
      label: 'Command line',
      collapsible: false,
      items: [
        'pages/commands/api-extractor_init',
        'pages/commands/api-extractor_run',
        'pages/commands/api-documenter_markdown',
        'pages/commands/api-documenter_yaml'
      ]
    },
    {
      type: 'category',
      label: 'Config files',
      collapsible: false,
      items: ['pages/configs/api-extractor_json', 'pages/configs/tsdoc_json']
    },
    {
      type: 'category',
      label: 'Developer scenarios',
      collapsible: false,
      items: ['pages/developer/api']
    },
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      items: [
        'pages/contributing/building',
        'pages/contributing/debugging',
        'pages/contributing/architecture'
      ]
    }
  ]
};

module.exports = sidebars;
