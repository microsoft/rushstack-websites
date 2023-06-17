---
title: What's New in Heft 0.51
authors:
  - D4N14L
tags: [heft]
draft: false
hide_table_of_contents: false
---

"Multi-phase" Heft is a complete re-write of the `@rushstack/heft` project with the goal of integrating more closely with [Rush phased builds](@rushjs/pages/maintainer/phased_builds/). In addition, this update brings greater customizability and improved parallel process handling to Heft. This post explains the motivation and architecture behind these improvements.

<!--truncate-->

> For upgrade instructions, refer to the [Heft 0.51 Migration Guide](/blog/2023/06/16/heft-migration-guide) post.

Some key areas that were improved with the updated version of Heft include:

- Developer-defined order of execution for Heft plugins and Heft events
- Partial execution of Heft actions via scoping parameters like `--to` or `--only`
- A simplified plugin API for developers making Heft plugins
- Explicit definition of all Heft plugins via **heft-plugin.json**
- Native support for defining multiple plugins within a single plugin package
- Improved handling of plugin parameters
- Native support for incremental watch-mode in Heft actions
- Reduced overhead and performance improvements
- Much more!

## Heft tasks

Heft tasks are the smallest unit of work specified in **heft.json**. Heft tasks may take dependencies on other tasks within the same phase, and all task dependencies must complete execution before dependent tasks can execute.

In past releases, we distinguished built-in tasks (`copy-files-plugin`, `node-service-plugin`, etc)
versus third-party tasks loaded from plugin packages. As of Heft 0.53.0 both kinds of tasks
are now declared identically. Built-in plugins simply specify `@rushstack/heft` as for
their plugin `packageName`.

## Heft phases

Heft phases define a collection of tasks that will run when executing that phase. Phases act as a logical collection of tasks that would reasonably (but not necessarily) map to a [Rush phase](@rushjs/pages/maintainer/phased_builds/). Heft phases may take dependencies on other phases, and when executing multiple phases, all selected phases must complete execution before dependent phases can execute.

The **heft.json** file is where phases and tasks are defined for a given project or rig. Since this file contains the relationships between the phases and tasks, it defines the order of operations for the execution of a Heft action.

## Heft actions

Using similar expansion logic to Rush, execution of a selection of Heft phases can be done through the use of the `heft run` action. This action executes a set of selected phases in order of phase dependency. If the selected phases are not dependent upon each other, they will be executed in parallel. Selection parameters include:

- `--only` - Execute the specified phase
- `--to` - Execute the specified phase and all its dependencies

Additionally, task- and phase-specific parameters may be provided to the `heft run` action by appending `-- <parameters>` to the command. For example, `heft run --only build -- --clean` will run only the `build` phase and will run a clean before executing the phase.

In addition, Heft will generate actions for each phase specified in the **heft.json** configuration. These actions are executed by running `heft <phaseName>` and run Heft to the specified phase, including all phase dependencies. As such, these inferred Heft actions are equivalent to running `heft run --to <phaseName>`, and are intended as a CLI shorthand.

## Watch mode

Watch mode is now a first-class feature in Heft. Watch mode actions are created for all Heft actions. For example, to run `build` and `test` phases in watch mode, either of the commands `heft test-watch` or `heft run-watch --to test`. When running in watch mode, Heft prefers the `runIncremental` hook to the `run` hook (see [Heft Task Plugins](#heft-task-plugins)).

## heft.json structure

All phases are defined within the top-level `phasesByName` property. Each phase may specify `phaseDependencies` to define the order of phase execution when running a selection of Heft phases. Phases may also provide the `cleanFiles` option, which accepts an array of deletion operations to perform when running with the `--clean` flag.

Within the phase specification, `tasksByName` defines all tasks that run while executing a phase. Each task may specify `taskDependencies` to define the order of task execution. All tasks defined in `taskDependencies` must exist within the same phase. For CLI-availability reasons, phase names, task names, plugin names, and parameter scopes, must be `kebab-cased`.

The following is an example "heft.json" file defining both a `build` and a `test` phase:

**heft.json** example for defining phases and tasks

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "extends": "base-project/config/heft.json",

  // "phasesByName" defines all phases, and each phase defines tasks to be run
  "phasesByName": {
    // ("build" is a user-defined name, not a schema field)
    "build": {
      "phaseDescription": "Transpile and run a linter against build output",
      "cleanFiles": [
        {
          "sourcePath": "temp-build-output"
        }
      ],
      // "tasksByName" defines all tasks within a phase
      "tasksByName": {
        // ("typescript" is a user-defined name, not a schema field)
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "lint": {
          "taskDependencies": [ "typescript" ],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-lint-plugin",
            "pluginName": "eslint"
          }
        },
        "copy-assets": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft",
            "pluginName": "copy-files-plugin",
            "options": {
              "copyOperations": [
                {
                  // NOTE: THIS WAS CALLED "sourceFolder" IN PREVIOUS HEFT VERSIONS
                  "sourcePath": "src/assets",
                  "destinationFolders": [ "dist/assets" ]
                }
              ]
            }
          }
        }
      }
    },

    // ("test" is a user-defined name, not a schema field)
    "test": {
      "phaseDependencies": [ "build" ],
      "phaseDescription": "Run Jest tests, if provided.",
      "tasksByName": {
        // ("jest" is a user-defined name, not a schema field)
        "jest": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-jest-plugin"
          }
        }
      }
    }
  }
}
```

Lifecycle plugins are specified in the top-level `heftPlugins` array. Plugins can be referenced by providing a package name and a plugin name. Optionally, if a package contains only a single plugin, a plugin can be referenced by providing only the package name and Heft will resolve to the only exported plugin. Lifecycle plugins can also be provided options to modify the default behavior.

**heft.json** example for loading a lifecycle plugin

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "extends": "base-project/config/heft.json",

  "heftPlugins": [
    {
      "pluginPackage": "@rushstack/heft-metrics-reporter",
      "options": {
        "disableMetrics": true
      }
    },
    {
      "pluginPackage": "@rushstack/heft-initialization-plugin",
      "pluginName": "my-lifecycle-plugin"
    }
  ]

  // (the "phasesByName" section can also appear here)
}
```

## heft.json property inheritance directives

Previously, common properties between a **heft.json** file its extended base file would merge arrays and overwrite objects. Now, both arrays and objects will merge, allowing for simplified use of the **heft.json** file when customizing extended base configurations.

Additionally, the config file parsers now supports **property inheritance directives** for customizing how JSON properties get merged when using `"extends"` inheritance. This system is implemented by the [@rushstack/heft-config-file](https://www.npmjs.com/package/@rushstack/heft-config-file) library, and applies to all config files that are loaded using that parser. Overrides are specified by using directives that define inheritance behavior.

For example, assume that we are extending a file with a previously defined `exampleObject` value that is a keyed object, and a `exampleArray` value that is an array object:

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/example-config-file.schema.json",
  "extends": "base-project/config/example-config-file.json",

  "$exampleObject.inheritanceType": "merge", // valid choices are: "merge", "replace"
  "exampleObject": {
    "$exampleObjectMember.inheritanceType": "merge", // valid choices are: "merge", "replace"
    "exampleObjectMember": { ... },

    "$exampleArrayMember.inheritanceType": "append", // valid choices are: "append", "replace"
    "exampleArrayMember": [ ... ]
  },

  "$exampleArray.inheritanceType": "replace", // valid choices are: "append", "replace"
  "exampleArray": [ ... ]
}
```

Once an object is set to a `inheritanceType` of override, all sub-property `inheritanceType` values will be ignored, since the top-most object already overrides all sub-properties.

One thing to note is that different `mergeBehavior` verbs are used for the merging of keyed objects and arrays. This is to make it explicit that arrays will be appended as-is, and no additional processing (eg. deduplicating if the array is intended to be a set) is done during merge. If such behavior is required, it can be done on the implementation side. Deduplicating arrays within the `@rushstack/heft-config-file` package doesn't quite make sense, since deduplicating arrays of non-primitive objects is not easily defined.

## Associated NPM packages

Many tasks that were previously built-in to have Heft have been split out into separate NPM packages. The full list:

- `@rushstack/heft`
- `@rushstack/heft-typescript-plugin`
- `@rushstack/heft-lint-plugin`
- `@rushstack/heft-api-extractor-plugin`
- `@rushstack/heft-jest-plugin`
- `@rushstack/heft-sass-plugin`
- `@rushstack/heft-storybook-plugin`
- `@rushstack/heft-webpack4-plugin`
- `@rushstack/heft-webpack5-plugin`
- `@rushstack/heft-dev-cert-plugin`

Additionally, Rushstack-provided rigs have been updated to be compatible with the new version of Heft:

- `@rushstack/heft-node-rig`
- `@rushstack/heft-web-rig`

## Authoring Heft plugins

### Lifecycle plugins

Heft lifecycle plugins provide the implementation for certain lifecycle-related hooks. These plugins will be used across all Heft phases, and as such should be rarely used outside of a few specific cases (such as for metrics reporting). Heft lifecycle plugins provide an `apply` method, and here plugins can hook into the following Tapable hooks:

- `toolStart` - Used to provide plugin-related functionality at the start of Heft execution
- `toolFinish` - Used to provide plugin-related functionality at the end of Heft execution, after all tasks are finished
- `recordMetrics` - Used to provide metrics information about the Heft run to the plugin after all tasks are finished

### Task plugins

Heft task plugins provide the implementation for Heft tasks. Heft plugins provide an `apply` method, and here plugins can hook into the following Tapable hooks:

- `registerFileOperations` - Invoked exactly once before the first time a plugin runs. Allows a plugin to register copy or delete operations using the same options as the `copyFiles` and `deleteFiles` Heft events (this hook is how those events are implemented).
- `run` - Used to provide plugin-related task functionality
- `runIncremental` - Used to provide plugin-related task functionality when in watch mode. If no `runIncremental` implementation is provided for a task, Heft will fall back to using the `run` hook as usual. The options structure includes two functions used to support watch operations:
  - `requestRun()` - This function asks the Heft runtime to schedule a new run of the plugin's owning task, potentially cancelling the current build.
  - `watchGlobAsync(patterns, options)` - This function is provided for convenience for the common case of monitoring a glob for changes. It returns a `Map<string, IWatchedFileState>` that enumerates the list of files (or folders) selected by the glob and whether or not they have changed since the previous invocation. It will automatically invoke the `requestRun()` callback if it detects changes to files or directory listings that might impact the output of the glob.

### heft-plugin.json

The **heft-plugin.json** config file is a new, required manifest file that must be present in the package folder of all Heft plugin packages. This file is used for multiple purposes, including the definition of all contained lifecycle or task plugins, the definition of all plugin-specific CLI parameters, and providing an optional schema file to validate plugin options that can be passed via **heft.json**.

The following is an example **heft-plugin.json** file defining a lifecycle plugin and a task plugin:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-plugin.schema.json",

  "lifecyclePlugins": [
    {
      "pluginName": "my-lifecycle-plugin",
      "entryPoint": "./lib/MyLifecyclePlugin.js",
      "optionsSchema": "./lib/schemas/mylifecycleplugin.schema.json",
      "parameterScope": "my-lifecycle",
      "parameters": [
        {
          "parameterKind": "string",
          "longName": "--my-string",
          "description": "…",
          "argumentName": "ARG_NAME",
          "required": false
        }
      ]
    }
  ],

  "taskPlugins": [
    {
      "pluginName": "my-task-plugin",
      "entryPoint": "./lib/MyTaskPlugin.js",
      "optionsSchema": "./lib/schemas/mytaskplugin.schema.json",
      "parameterScope": "my-task",
      "parameters": [
        {
          "parameterKind": "string",
          "longName": "--my-other-string",
          "description": "…",
          "argumentName": "ARG_NAME",
          "required": false
        }
      ]
    }
  ]
}
```

### Cross-plugin interaction

Heft plugins can use the `requestAccessToPluginByName` API to access the requested plugin accessors. Accessors are objects provided by plugins for external use and are the ideal place to share plugin-specific information or hooks used to provide additional plugin functionality.

Access requests are fulfilled at the beginning of phase execution, prior to `clean` hook execution. If the requested plugin does not provide an accessor, an error will be thrown noting the plugin with the missing accessor. However, if the plugin requested is not present at all, the access request will silently fail. This is done to allow for non-required integrations with external plugins. For this reason, it is important to implement cross-plugin interaction in such a way as to expect this case and to handle it gracefully, or to throw a helpful error.

Plugins available for access are restricted based on scope. For lifecycle plugins, you may request access to any other lifecycle plugin added to the Heft configuration. For task plugins, you may request access to any other task plugin residing within the same phase in the Heft configuration.

### Custom CLI parameters

Defining CLI parameters is now only possible via **heft-plugin.json**, and defined parameters can be consumed in plugins via the `HeftTaskSession.parameters` API. Additionally, all plugin parameters for the selected Heft phases are now discoverable on the CLI when using the `--help` argument (ex. `heft test --help` or `heft run --to test -- --help`).

These parameters can be automatically "de-duped" on the CLI using an optionally-provided `parameterScope`. By default, parameters defined in **heft-plugin.json** will be available on the CLI using `--<parameterName>` and `--<parameterScope>:<parameterName>`. When multiple plugins provide the same parameter, only the latter parameter will be available on the CLI in order to "de-dupe" conflicting parameters. For example, if PluginA with parameter scope "PluginA" defines `--parameter`, and PluginB with parameter scope "PluginB" also defines `--parameter`, the parameters will _only_ be available as `--PluginA:parameter` and `--PluginB:parameter`.

If you have any questions or feedback regarding these changes to Heft, please [ask in the chatroom](https://rushstack.zulipchat.com/#narrow/stream/262522-heft) or [file an issue](https://github.com/microsoft/rushstack/issues/new?assignees=&labels=&template=heft.md&title=%5Bheft%2Frc%2f0%5D+).
