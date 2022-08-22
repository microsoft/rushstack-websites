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
      items: ['pages/intro/welcome', 'pages/intro/why_mono', 'pages/intro/get_started']
    },
    {
      type: 'category',
      label: 'Developer tutorials',
      collapsible: false,
      items: [
        'pages/developer/new_developer',
        'pages/developer/everyday_commands',
        'pages/developer/modifying_package_json',
        'pages/developer/other_commands',
        'pages/developer/tab_completion',
        'pages/developer/selecting_subsets',
        'pages/developer/project_tags'
      ]
    },
    {
      type: 'category',
      label: 'Maintainer tutorials',
      collapsible: false,
      items: [
        'pages/maintainer/setup_new_repo',
        'pages/maintainer/add_to_repo',
        'pages/maintainer/enabling_ci_builds',
        'pages/maintainer/recommended_settings',
        'pages/maintainer/package_managers',
        'pages/maintainer/setup_policies',
        'pages/maintainer/git_hooks',
        'pages/maintainer/enabling_prettier',
        'pages/maintainer/custom_commands',
        'pages/maintainer/autoinstallers',
        'pages/maintainer/publishing',
        'pages/maintainer/deploying',
        'pages/maintainer/build_cache',
        'pages/maintainer/phased_builds',
        'pages/maintainer/npm_registry_auth'
      ]
    },
    {
      type: 'category',
      label: 'Best practices',
      collapsible: false,
      items: ['pages/best_practices/change_logs']
    },
    {
      type: 'category',
      label: 'Advanced topics',
      collapsible: false,
      items: [
        'pages/advanced/config_files',
        'pages/advanced/phantom_deps',
        'pages/advanced/npm_doppelgangers',
        'pages/advanced/compatibility_db',
        'pages/advanced/preferred_versions',
        'pages/advanced/incremental_builds',
        'pages/advanced/watch_mode',
        'pages/advanced/installation_variants'
      ]
    },
    {
      type: 'category',
      label: 'Extensibility',
      collapsible: false,
      items: ['pages/extensibility/creating_plugins', 'pages/extensibility/api']
    },
    {
      type: 'category',
      label: 'Command reference',
      collapsible: false,
      items: [
        'pages/commands/rush_add',
        'pages/commands/rush_build',
        'pages/commands/rush_change',
        'pages/commands/rush_check',
        'pages/commands/rush_deploy',
        'pages/commands/rush_init',
        'pages/commands/rush_init-autoinstaller',
        'pages/commands/rush_init-deploy',
        'pages/commands/rush_install',
        'pages/commands/rush_link',
        'pages/commands/rush_list',
        'pages/commands/rush_publish',
        'pages/commands/rush_purge',
        'pages/commands/rush_rebuild',
        'pages/commands/rush_scan',
        'pages/commands/rush_setup',
        'pages/commands/rush_tab-complete',
        'pages/commands/rush_unlink',
        'pages/commands/rush_update',
        'pages/commands/rush_update-autoinstaller',
        'pages/commands/rush_update-cloud-credentials',
        'pages/commands/rush_version',
        'pages/commands/rush_write-build-cache'
      ]
    },
    {
      type: 'category',
      label: 'Config reference',
      collapsible: false,
      items: [
        'pages/configs/environment_vars',
        'pages/configs/npmrc',
        'pages/configs/npmrc-publish',
        'pages/configs/pnpmfile_cjs',
        'pages/configs/artifactory_json',
        'pages/configs/build-cache_json',
        'pages/configs/command-line_json',
        'pages/configs/common-versions_json',
        'pages/configs/deploy_json',
        'pages/configs/experiments_json',
        'pages/configs/rush_json',
        'pages/configs/rush-plugin-manifest_json',
        'pages/configs/rush-project_json',
        'pages/configs/version-policies_json'
      ]
    },
    {
      type: 'category',
      label: 'Help',
      collapsible: false,
      items: ['pages/help/support', 'pages/help/faq']
    }
  ]
};

module.exports = sidebars;
