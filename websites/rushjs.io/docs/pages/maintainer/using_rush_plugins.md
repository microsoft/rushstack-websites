---
title: Using Rush plugins
---

Rush plugins enable you to:

- Share common Rush configuration across multiple monorepos
- Extend Rush's base functionality with custom features
- Prototype new feature ideas before officially contributing them to Rush

Plugins are distributed via an NPM package, which we call a **plugin package**. A single
package may define one or more Rush plugins. (If you are interested in creating your plugin package,
see the article [Creating rush plugins](../extensibility/creating_plugins.md).)

## Enabling a Rush plugin

There are three steps for enabling a Rush plugin in your monorepo. For this tutorial,
let's configure a hypothetical plugin called `"example"` that is provided by the NPM package
`@your-company/rush-example-plugin`.

### Step 1: Configure an autoinstaller

Plugins rely on Rush's [autoinstaller](../maintainer/autoinstallers.md) feature for on-demand
installation of their NPM package.

Here's how to create a new autoinstaller called `rush-plugins`:

```bash
rush init-autoinstaller --name rush-plugins
```

This will create an autoinstaller **package.json** file. Add your plugin's NPM package as a dependency:

**common/autoinstallers/rush-plugins/package.json**

```js
{
  "name": "rush-plugins",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@your-company/rush-example-plugin": "^1.0.0"  👈 👈 👈
  }
}
```

Next, generate the shrinkwrap file:

```bash
# Creates the shrinkwrap file common/autoinstallers/rush-plugins/pnpm-lock.yaml
rush update-autoinstaller --name rush-plugins
```

Commit these files to Git.

### Step 2: Update rush-plugins.json

In order for the plugin to be loaded, we need to register it in **rush-plugins.json**.
Continuing our example:

**common/config/rush/rush-plugins.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-plugins.schema.json",
  "plugins": [
    /**
     * Each item defines a plugin to be loaded by Rush.
     */
    {
      /**
       * The name of the NPM package that provides the plugin.
       */
      "packageName": "@your-company/rush-example-plugin",

      /**
       * The name of the plugin.  This can be found in the "pluginName"
       * field of the "rush-plugin-manifest.json" file in the NPM package folder.
       */
      "pluginName": "example",

      /**
       * The name of a Rush autoinstaller that will be used for installation, which
       * can be created using "rush init-autoinstaller".  Add the plugin's NPM package
       * to the package.json "dependencies" of your autoinstaller, then run
       * "rush update-autoinstaller".
       */
      "autoinstallerName": "rush-plugins"
    }
  ]
}
```

The `pluginName` field can be found in the
[rush-plugin-manifest.json](../configs/rush-plugin-manifest_json.md)
of the plugin package.

### Step 3: Optional config file

Some plugins can be customized via their own config file; if so, their
**rush-plugin-manifest.json** will specify the `optionsSchema` field.

The config filename will have the same as the `pluginName`, for example:

**common/config/rush-plugins/example.json**

## First-party plugins

| NPM Package                                                                                                                                             | Description                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------- |
| [@rushstack/rush-amazon-s3-build-cache-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-amazon-s3-build-cache-plugin)         | Cloud build cache provider for Amazon S3 (ships built-in)                                                         |
| [@rushstack/rush-azure-storage-build-cache-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-azure-storage-build-cache-plugin) | Cloud build cache provider for Azure Storage (ships built-in); also provides `rush-azure-interactive-auth-plugin`  |
| [@rushstack/rush-bridge-cache-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-bridge-cache-plugin)                           | Bypasses command execution to populate or restore the build cache from an external orchestrator                    |
| [@rushstack/rush-buildxl-graph-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-buildxl-graph-plugin)                         | Provides access to the Rush build graph for BuildXL integration                                                   |
| [@rushstack/rush-http-build-cache-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-http-build-cache-plugin)                   | Cloud build cache provider using a generic HTTP endpoint (ships built-in)                                         |
| [@rushstack/rush-redis-cobuild-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-redis-cobuild-plugin)                         | Cobuild lock provider using Redis for distributed builds                                                          |
| [@rushstack/rush-resolver-cache-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-resolver-cache-plugin)                       | Generates a resolver cache file to optimize Node.js module resolution                                             |
| [@rushstack/rush-serve-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-serve-plugin)                                         | Hooks into action execution and runs an Express server to serve project outputs in watch mode                      |

> **NOTE:** The `@rushstack/rush-amazon-s3-build-cache-plugin`, `@rushstack/rush-azure-storage-build-cache-plugin`,
> and `@rushstack/rush-http-build-cache-plugin` packages currently ship built-in to Rush and are enabled
> automatically. For now, you should NOT register them in **rush-plugins.json**.
>
> This is a temporary accommodation while the plugin framework is still experimental.
> In the next major release of Rush, the build cache packages will need to be configured in standard way.

## Third-party plugins

Here's a gallery of some community contributed plugins.

| NPM Package                                                                                                                    | Description                                                                             |
| :----------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [rush-archive-project-plugin](https://github.com/tiktok/rush-plugins/tree/main/rush-plugins/rush-archive-project-plugin)       | Archive Rush projects that are no longer maintained                                     |
| [rush-github-action-build-cache-plugin](https://github.com/gigara/rush-github-action-build-cache-plugin)                       | Save and restore the build cache in Github actions                                      |
| [rush-init-project-plugin](https://github.com/tiktok/rush-plugins/tree/main/rush-plugins/rush-init-project-plugin)             | Initialize new Rush projects                                                            |
| [rush-lint-staged-plugin](https://github.com/tiktok/rush-plugins/tree/main/rush-plugins/rush-lint-staged-plugin)               | Integrate [lint-staged](https://www.npmjs.com/package/lint-staged) with a Rush monorepo |
| [rush-print-log-if-error-plugin](https://github.com/tiktok/rush-plugins/tree/main/rush-plugins/rush-print-log-if-error-plugin) | Print a project's entire log file when an error occurs                                  |
| [rush-sort-package-json](https://github.com/tiktok/rush-plugins/tree/main/rush-plugins/rush-sort-package-json)                 | Sort the package.json file entries for Rush projects                                    |
| [rush-upgrade-self-plugin](https://github.com/tiktok/rush-plugins/tree/main/rush-plugins/rush-upgrade-self-plugin)             | A helper for upgrading to the latest release of Rush                                    |

If you created an interesting plugin for Rush, let us know in a GitHub issue. Thanks!

## See also

- [rush init-autoinstaller](../commands/rush_init-autoinstaller.md)
- [rush update-autoinstaller](../commands/rush_update-autoinstaller.md)
- [Creating a Rush plugin](../extensibility/creating_plugins.md)
