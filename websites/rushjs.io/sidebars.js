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
      items: ['intro/welcome', 'intro/why_mono', 'intro/get_started']
    },
    {
      type: 'category',
      label: 'Developer tutorials',
      collapsible: false,
      items: [
        'developer/new_developer',
        'developer/everyday_commands',
        'developer/modifying_package_json',
        'developer/other_commands',
        'developer/tab_completion',
        'developer/selecting_subsets'
      ]
    },
    {
      type: 'category',
      label: 'Maintainer tutorials',
      collapsible: false,
      items: [
        'maintainer/setup_new_repo',
        'maintainer/add_to_repo',
        'maintainer/enabling_ci_builds',
        'maintainer/recommended_settings',
        'maintainer/package_managers',
        'maintainer/setup_policies',
        'maintainer/git_hooks',
        'maintainer/enabling_prettier',
        'maintainer/custom_commands',
        'maintainer/publishing',
        'maintainer/deploying',
        'maintainer/build_cache',
        'maintainer/npm_registry_auth'
      ]
    },
    {
      type: 'category',
      label: 'Best practices',
      collapsible: false,
      items: ['best_practices/change_logs']
    },
    {
      type: 'category',
      label: 'Advanced topics',
      collapsible: false,
      items: [
        'advanced/config_files',
        'advanced/phantom_deps',
        'advanced/npm_doppelgangers',
        'advanced/preferred_versions',
        'advanced/incremental_builds',
        'advanced/watch_mode',
        'advanced/installation_variants',
        'advanced/api'
      ]
    },
    {
      type: 'category',
      label: 'Command reference',
      collapsible: false,
      items: [
        'commands/rush_add',
        'commands/rush_build',
        'commands/rush_change',
        'commands/rush_check',
        'commands/rush_deploy',
        'commands/rush_init',
        'commands/rush_init-autoinstaller',
        'commands/rush_init-deploy',
        'commands/rush_install',
        'commands/rush_link',
        'commands/rush_list',
        'commands/rush_publish',
        'commands/rush_purge',
        'commands/rush_rebuild',
        'commands/rush_scan',
        'commands/rush_setup',
        'commands/rush_tab-complete',
        'commands/rush_unlink',
        'commands/rush_update',
        'commands/rush_update-autoinstaller',
        'commands/rush_update-cloud-credentials',
        'commands/rush_version',
        'commands/rush_write-build-cache'
      ]
    },
    {
      type: 'category',
      label: 'Config reference',
      collapsible: false,
      items: [
        'configs/environment_vars',
        'configs/npmrc',
        'configs/npmrc-publish',
        'configs/artifactory_json',
        'configs/build-cache_json',
        'configs/command-line_json',
        'configs/common-versions_json',
        'configs/deploy_json',
        'configs/experiments_json',
        /*
          TODO - 404 on existing site
          'configs/pnpmfile_js',
        */
        'configs/rush_json',
        'configs/rush-project_json',
        'configs/version-policies_json'
      ]
    },
    {
      type: 'category',
      label: 'Help',
      collapsible: false,
      items: ['help/support', 'help/faq']
    }
  ]
};

module.exports = sidebars;
