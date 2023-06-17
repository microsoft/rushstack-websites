---
title: Heft 0.51 Migration Guide
authors:
  - D4N14L
  - octogonz
tags: [heft]
draft: false
hide_table_of_contents: false
---

The Heft **0.51.0** release introduces a "multi-phase" feature that brings some significant architectural changes. If you've been using an older version, upgrading will require making some changes to your **Heft config files** and also any **custom plugins** that you may have authored. In this post, we'll summarized what changed and how to migrate your projects. This is probably the last major breaking change before the 1.0.0 release of Heft.

<!--truncate-->

> For a deeper dive into the multi-phase design and its underlying motivation, please see our other post [What's New in Heft 0.51](/blog/2023/06/15/heft-whats-new/).

## Version timeline

Although most of the breaking changes are in Heft **0.51.0**, other significant changes were made in several subsequent versions:

- Heft **0.51.0**: The big architecture change for multi-phase support, with breaking changes for config file schemas and plugin APIs
- Heft **0.52.0**: Restored support for the `heft start` alias (which had been removed in 0.51.0); added the ability to define custom aliases; `@rushstack/heft-node-rig` now launches its dev server using the same `heft start` alias as `@rushstack/heft-web-rig`
- Heft **0.53.0**: Removed the `taskEvents` config setting; built-in tasks like `copy-files-plugin` and `node-service-plugin` now use identical configuration as third-party plugins (simply specifying `@rushstack/heft` as their plugin package name)
- Heft **0.54.0**: Restored support for short parameter names such as `-u` in `heft test -u` (which had been removed in 0.51.0)
- Heft **0.55.0**: Removed `cacheFolderPath` from plugin API's session object, since the `.cache` folder is no longer used

To simplify these migration notes, in this article we'll assume you're upgrading to **0.55.0 or newer**, and that you're coming from **0.50.x or older**.

## Migrating heft.json files

### JSON Schema URL changes

In order to have correct VS Code IntelliSense when editing config files, update the `"$schema"` field in each Heft config file. Simply replace `json-schemas/heft/` with `json-schemas/heft/v0`.

For example:

- Old: `"$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json"`
- New: `"$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json"`

The full list of JSON schema names can be found [in this GitHub folder](https://github.com/microsoft/json-schemas/tree/main/heft/v0). These names are the last part of the URL shown above.

### Plugins must be explicitly loaded

In the old design, a number of plugins were built-in to `@rushstack/heft` and did not need to be explicitly loaded using **heft.json** settings. If their associated config file was not found, then their task would be silently skipped.

**OLD:** Plugins that were implicitly loaded:

- heft-typescript-plugin
- copy-static-assets-plugin
- copy-files-plugin
- delete-globs-plugin
- run-script-plugin
- api-extractor-plugin
- project-validator-plugin
- node-service-plugin

**NEW:** After migrating, every plugin must be explicitly loaded via the **heft.json** config file. Typically this is inherited from your rig. This new model eliminates magic and mysteries, since the full set of plugins and their dependencies is now represented in the config file.

If you are using our `@rushstack/heft-node-rig` and `@rushstack/heft-web-rig`, your project should only need minor changes, since the updated rigs now explicitly load all these plugins. If you created a custom rig, the migration work will be more involved, but you can copy from our examples:

- [heft-node-rig/profiles/default/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-node-rig/profiles/default/config/heft.json)
- [heft-web-rig/profiles/app/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/profiles/app/config/heft.json)

### Migrating package.json dependencies

Many of these plugins have been extracted into their own NPM packages. This reduces the startup time and installation footprint for projects that don't use certain plugins.

Here's the current inventory as of this writing:

- [@rushstack/heft](https://github.com/microsoft/rushstack/tree/main/apps/heft): Its [heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json) defines multiple plugins copy-files-plugin, delete-files-plugin, node-service-plugin, run-script-plugin
- [@rushstack/heft-api-extractor-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-api-extractor-plugin)
- [@rushstack/heft-dev-cert-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-dev-cert-plugin)
- [@rushstack/heft-jest-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-jest-plugin)
- [@rushstack/heft-lint-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-lint-plugin)
- [@rushstack/heft-sass-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-sass-plugin)
- [@rushstack/heft-serverless-stack-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-serverless-stack-plugin)
- [@rushstack/heft-storybook-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-storybook-plugin)
- [@rushstack/heft-typescript-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-typescript-plugin)
- [@rushstack/heft-webpack4-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-webpack4-plugin)
- [@rushstack/heft-webpack5-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-webpack5-plugin)

### Migrating a standalone heft.json

The old **heft.json** distinguished "event actions" (i.e. built-in tasks) versus "heftPlugins" (i.e. tasks from plugin packages).

**OLD:** **heft.json** excerpt from `heft-node-rig`

```ts
// ⚠️ OLD FORMAT EXAMPLE -- DO NOT USE! ⚠️
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  // "deleteGlobs" is specified to run with the "clean" event
  "eventActions": [
    {
      // 📌 [1] old way of cleaning
      "actionKind": "deleteGlobs",
      "heftEvent": "clean",
      "actionId": "defaultClean",
      "globsToDelete": ["dist", "lib", "lib-commonjs", "temp"]
    }
  ],

  // the Jest plugin is loaded using the "heftPlugins" section
  // and its event sequence was defined using program logic
  "heftPlugins": [
    // 📌 [2] old way of loading a plugin
    { "plugin": "@rushstack/heft-jest-plugin" }
  ]
}
```

**NEW:** **heft.json** excerpt from `heft-node-rig`

```ts
 {
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    // ("build" is a user-defined name, not a schema field)
    "build": {
      // 📌 [1] new way of cleaning
      "cleanFiles": [
        { "sourcePath": "dist" },
        { "sourcePath": "lib" },
        { "sourcePath": "lib-commonjs" }
      ],
      "tasksByName": {
        // ("typescript" is a user-defined name, not a schema field)
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "lint": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-lint-plugin"
          }
        },
        "api-extractor": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-api-extractor-plugin"
          }
        },
        "node-service": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            // This built-in plugin specifies "@rushstack/heft" as its package name
            "pluginPackage": "@rushstack/heft",
            "pluginName": "node-service-plugin"
          }
        }
      }
    },

    // ("test" is a user-defined name, not a schema field)
    "test": {
      "phaseDependencies": ["build"],
      "tasksByName": {
        // ("jest" is a user-defined name for this task)
        "jest": {
          // 📌 [2] new way of loading a plugin
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-jest-plugin"
          }
        }
      }
    }
  }
}
```

Looking at the above example, the major changes are:

- every task must be explicitly loaded from a `pluginPackage`, so the rig's **heft.json** is now more verbose (but more understandable!)
- built-in tasks (e.g. `node-service`) have identical specification as external plugins
- the old `"heftEvent"` lifecycle has been replaced by `phaseDependencies` and `taskDependencies` whose dependency graph determines the sequencing of tasks

The complete config file can be found here: [heft-node-rig/profiles/default/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-node-rig/profiles/default/config/heft.json)

### Migrating a rigged heft.json

Here's another example from the [TSDoc Playground](https://tsdoc.org/play/) project, whose [heft.json](https://github.com/microsoft/tsdoc/blob/main/playground/config/heft.json) inherits from our `heft-web-rig`:

**OLD:** **heft.json** excerpt from `playground/config/heft.json`

```ts
// ⚠️ OLD FORMAT EXAMPLE -- DO NOT USE! ⚠️
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/library/config/heft.json",

  "eventActions": [
    {
      "actionId": "copyLicenseToDistFolder",
      "actionKind": "copyFiles",
      // 📌 [3] old way to do a post-compile action
      "heftEvent": "compile",
      "copyOperations": [
        {
          "destinationFolders": ["./dist"],
          // 📌 [4] old way of specifying a source folder
          "sourceFolder": "..",
          "includeGlobs": ["LICENSE"]
        }
      ]
    }
  ]
}
```

**NEW:** **heft.json** excerpt from `playground/config/heft.json`

```ts
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/library/config/heft.json",

  "phasesByName": {
    // ("build" is a user-defined name, not a schema field)
    "build": {
      "tasksByName": {
        // ("post-compile-copy" is a user-defined name, not a schema field)
        "post-compile-copy": {
          // 📌 [3] new way to do a post-compile action, by depending on the relevant task(s)

          // The "post-compile-copy" task should not run until after "typescript" completes
          "taskDependencies": ["typescript"],

          "taskPlugin": {
            "pluginName": "copy-files-plugin",
            "pluginPackage": "@rushstack/heft",
            "options": {
              "copyOperations": [
                {
                  // 📌 [4] new way of specifying a source folder (or file path)
                  "sourcePath": "..",
                  "destinationFolders": ["./dist"],
                  "includeGlobs": ["LICENSE"]
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

Observations:

- The changes here are minimal, since the rig provides most of the build definition
- The latest `heft-web-rig` uses `heft-webpack5-plugin`, so we had to upgrade from Webpack 4 -> 5 as part of this conversion
- The `"heftEvent": "compile"` event no longer exists; instead it must be represented via an equivalent `"taskDependencies"` entry, which references the rig's `"typescript"` task definition

### Migrating a "pre-compile" action

In the above example, we migrated our config file by replacing `"heftEvent": "compile"`
with `"taskDependencies": ["typescript"]`, which accomplishes the same thing by expressing that the
action cannot be performed until after the `"typescript"` task has completed. But the `"taskDependencies"`
is a unidirectional relationship. In this new model, how can we represent an event such as `pre-compile`?

Consider this example:

**OLD:** **heft.json** excerpt

```ts
// ⚠️ OLD FORMAT EXAMPLE -- DO NOT USE! ⚠️
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/app/config/heft.json",

  "eventActions": [
    {
      "actionKind": "copyFiles",
      "actionId": "copyAssets",
      // 📌 [5] old way to do a "post-compile" action
      "heftEvent": "pre-compile",
      "copyOperations": [
        {
          "sourceFolder": "assets",
          "destinationFolders": ["dist"],
          "includeGlobs": ["images/*"]
        }
      ]
    }
  ]
}
```

**NEW:** **heft.json** excerpt from `playground/config/heft.json`

```ts
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/app/config/heft.json",

  "phasesByName": {
    // ("build" is a user-defined name, not a schema field)
    "build": {
      "tasksByName": {
        // ("pre-compile-copy" is a user-defined name, not a schema field)
        "pre-compile-copy": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft",
            "pluginName": "copy-files-plugin",
            "options": {
              "copyOperations": [
                {
                  "sourcePath": "assets",
                  "destinationFolders": ["dist"],
                  "includeGlobs": ["images/*", "demos/*.json"]
                }
              ]
            }
          }
        },

        // ("typescript" is a user-defined name, that is originally defined in the rig)
        "typescript": {
          // 📌 [5] new way to do a "post-compile" action
          // The "typescript" task should not run until after "pre-compile-copy" completes.
          "taskDependencies": ["pre-compile-copy"]
        }
      }
    }
  }
}
```

For reference, `@rushstack/heft-web-rig` defines the `"typescript"` task as follows:

[heft-web-rig/profiles/app/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/profiles/app/config/heft.json) excerpt

```js
  . . .
  "typescript": {
    "taskDependencies": ["sass"],
    "taskPlugin": {
      "pluginPackage": "@rushstack/heft-typescript-plugin"
    }
  },
  . . .
```

Observations:

- Recall that we implemented `"post-compile-copy"` by specifying `taskDependencies` for our own task (`"taskDependencies": ["typescript"]`)
- By contrast, `"pre-compile-copy"` is implemented by amending the `taskDependencies` for the rig's `"typescript"` task
  (`"taskDependencies": ["pre-compile-copy"]`)
- The rig already has `"taskDependencies": ["sass"]`. But we do NOT need to specify `"taskDependencies": ["typescript", "sass"]` because by default, Heft's config parser will merge arrays by appending rather than replacing entries
- This merge behavior is implemented by `@rushstack/heft-config-file` and can be customized using
  [property inheritance directives](/blog/2023/06/15/heft-whats-new/#heftjson-property-inheritance-directives)

## Migrating command line syntax

The old `--watch` command line parameter has been removed. Instead, watch mode is enabled by appending `-watch`
to the action name.

**OLD:**

```shell
heft build --watch --verbose
```

**NEW:**

```
heft build-watch --verbose
```

## Command aliases

In the old design, `heft start` was a special action for launching dev servers. In the new design, it is
a command alias defined in **heft.json**. The new aliasing system allows you to define your own custom aliases
to shorten common commands.

[heft-web-rig/profiles/app/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/profiles/app/config/heft.json) excerpt

```js
  // Define "heft start" to be an alias for "heft build-watch --serve".
  "aliasesByName": {
    "start": {
      "actionName": "build-watch",
      "defaultParameters": ["--serve"]
    }
  },
```

The `--serve` CLI parameter is our standard convention for launching a `localhost` dev server. It is supported by both `heft-webpack5-plugin` and the built-in `node-service-plugin`.

## Migrating custom plugins

In updating to the new version of Heft, plugins will also need to be updated for compatibility. Some of the more notable API changes include:

- "heft.json" format completely changed. See above for more information on "heft.json"
- "heft-plugin.json" manifest file must accompany any plugin package. If no "heft-plugin.json" file is found, Heft will throw an error. See above for more information on "heft-plugin.json"
- Plugin classes must have parameterless constructors, and must be the default export of the file pointed to by the `entryPoint` property in "heft-plugin.json"
- Schema files for options provided in "heft.json" can now be specified using the `optionsSchema` property in "heft-plugin.json" and they will be validated by Heft
- Parameters are now defined in "heft-plugin.json" and are consumed in the plugin via the `IHeftTaskSession.parameters` or `IHeftLifecycleSession.parameters` property. _NOTE: Other than the default Heft-included parameters, only parameters defined by the calling plugin are accessible_
- Plugins can no longer define their own actions. If a plugin deserves its own action, a dedicated phase should be added to the consumers "heft.json"
- The `runScript` Heft event has been modified to only accept a `runAsync` method, and the properties have been updated to reflect what is available to normal Heft task plugins
- Path-related variables have been renamed to clarify they are paths (ex. `HeftConfiguration.buildFolder` is now `HeftConfiguration.buildFolderPath`)
- The `runIncremental` hook can now be utilized to ensure that watch mode rebuilds occur in proper dependency order
- The `clean` hook was removed in favor of the `cleanFiles` option in "heft.json" in order to make it obvious what files are being cleaned and when
- The `folderNameForTests` and `extensionForTests` properties have been removed and should instead be addressed via the `testMatch` property in `jest.config.json`
