---
title: Authoring plugins
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Heft is designed to be extensible. If the [official plugins](../plugins/package_index.md) don't cover your
needs, you can create your own Heft plugin package. This page explains how to create a task plugin, which
is the most common kind of plugin.

> For quick prototyping, you may want to start with the [Run script plugin](../plugins/run-script.md) instead.
> That approach lets you run an arbitrary script as a Heft task without creating a full plugin package. However,
> for production use, a proper plugin package is recommended because it provides TypeScript type safety, proper
> ESLint validation, and a better developer experience.

## Plugin concepts

Before you begin, make sure you're familiar with the key concepts from the
[Heft architecture](../intro/architecture.md) page:

- A **task plugin** implements `IHeftTaskPlugin` and provides its behavior via the task session hooks
- A **lifecycle plugin** implements `IHeftLifecyclePlugin` and provides general functionality not specific to any task
- A **plugin manifest** (`heft-plugin.json`) describes available plugins, their options, and CLI parameters
- Plugin packages use the NPM naming pattern `heft-____-plugin` or `heft-____-plugins`

## Step 1: Create the package

Create a new NPM package for your plugin. The key requirements are:

- Add `@rushstack/heft` as a `peerDependency` (not a regular dependency)
- Export a `heft-plugin.json` manifest file from the package root

**package.json**

```json
{
  "name": "heft-my-plugin",
  "version": "1.0.0",
  "description": "A Heft plugin for ...",
  "main": "./lib-commonjs/index.js",
  "peerDependencies": {
    "@rushstack/heft": "^1.2.2"
  },
  "devDependencies": {
    "@rushstack/heft": "^1.2.2"
  },
  "exports": {
    "./lib/*": {
      "types": "./lib-dts/*.d.ts",
      "node": "./lib-commonjs/*.js",
      "import": "./lib-esm/*.js",
      "require": "./lib-commonjs/*.js"
    },
    "./heft-plugin.json": "./heft-plugin.json",
    "./package.json": "./package.json"
  }
}
```

> **Important:** It is essential that `"./heft-plugin.json": "./heft-plugin.json"` is included in
> the `"exports"` field so that Heft can locate the plugin manifest.

## Step 2: Create the plugin manifest

Create a **heft-plugin.json** file in your package root. This manifest tells Heft about the plugins
provided by your package. The file must conform to the
[heft-plugin.schema.json](https://developer.microsoft.com/json-schemas/heft/v0/heft-plugin.schema.json) schema.

**heft-plugin.json**

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-plugin.schema.json",

  "taskPlugins": [
    {
      "pluginName": "my-plugin",
      "entryPoint": "./lib-commonjs/MyPlugin"
    }
  ]
}
```

### Manifest fields

The plugin manifest supports these fields for each plugin:

| Field            | Required | Description                                                                                                                                                             |
| :--------------- | :------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pluginName`     |   yes    | A unique kebab-case name for the plugin (e.g. `"my-plugin"`)                                                                                                            |
| `entryPoint`     |   yes    | Path to the compiled JS module that exports the plugin class (resolved relative to the package folder)                                                                  |
| `optionsSchema`  |    no    | Path to a JSON Schema file that validates `options` provided in **heft.json**                                                                                           |
| `parameterScope` |    no    | A scope prefix for CLI parameters (defaults to the plugin name). If multiple plugins define a `--verbose` parameter, they can be disambiguated as `--my-scope:verbose`. |
| `parameters`     |    no    | An array of CLI parameter definitions (see [Defining CLI parameters](#defining-cli-parameters) below)                                                                   |

## Step 3: Implement the plugin class

Create a TypeScript file that exports a class implementing `IHeftTaskPlugin`. The class must have an
`apply()` method that receives the task session and Heft configuration.

**src/MyPlugin.ts**

```ts
import type {
  HeftConfiguration,
  IHeftTaskSession,
  IHeftTaskPlugin,
  IHeftTaskRunHookOptions
} from '@rushstack/heft';

const PLUGIN_NAME: 'my-plugin' = 'my-plugin';

export default class MyPlugin implements IHeftTaskPlugin {
  public apply(taskSession: IHeftTaskSession, heftConfiguration: HeftConfiguration): void {
    taskSession.hooks.run.tapPromise(PLUGIN_NAME, async (runOptions: IHeftTaskRunHookOptions) => {
      const { logger } = taskSession;

      logger.terminal.writeLine('My plugin is running!');

      // Your plugin logic here...
    });
  }
}
```

The `apply()` method is called once when the plugin is loaded. Inside it, you "tap" into one or more
hooks to register your callbacks.

### Available task hooks

The `taskSession.hooks` object provides these hooks:

| Hook                     | Description                                                                                              |
| :----------------------- | :------------------------------------------------------------------------------------------------------- |
| `run`                    | Called when the task executes during a normal build. Use `run.tapPromise(name, callback)` to register.   |
| `runIncremental`         | Called instead of `run` during watch mode, if provided. Receives additional APIs for incremental builds. |
| `registerFileOperations` | Called once before the first `run` or `runIncremental` to register dynamic file copy/delete operations.  |

### Using the task session

The `IHeftTaskSession` provides access to several useful properties:

| Property            | Description                                                    |
| :------------------ | :------------------------------------------------------------- |
| `taskName`          | The name of the task as defined in **heft.json**               |
| `hooks`             | The hooks available for the plugin to tap (described above)    |
| `parameters`        | CLI parameters (including custom ones defined in the manifest) |
| `parsedCommandLine` | The command line used to invoke Heft                           |
| `tempFolderPath`    | A unique temp folder for the task, cleaned with `--clean`      |
| `logger`            | A scoped logger prefixed with `[<phaseName>:<taskName>]`       |

### Watch mode support

To support Heft's watch mode, tap the `runIncremental` hook. This hook provides additional APIs
for efficient incremental builds:

```ts
taskSession.hooks.runIncremental.tapPromise(
  PLUGIN_NAME,
  async (options: IHeftTaskRunIncrementalHookOptions) => {
    // Watch for changes to specific files
    const changedFiles = await options.watchGlobAsync('src/**/*.json');

    // Process only changed files
    for (const [filePath, changeInfo] of changedFiles) {
      logger.terminal.writeLine(`Processing changed file: ${filePath}`);
    }
  }
);
```

## Step 4: Use the plugin

Once your plugin is published (or linked locally), consumers can load it in their **heft.json** config file:

**config/heft.json**

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    "build": {
      "tasksByName": {
        "my-task": {
          "taskPlugin": {
            "pluginPackage": "heft-my-plugin",
            "pluginName": "my-plugin"
          }
        }
      }
    }
  }
}
```

If the package only provides a single task plugin, the `"pluginName"` can be omitted.

## Accepting plugin options

Plugins can accept user-defined options via **heft.json**. To enable this:

1. Create a JSON Schema file for your options:

   **src/schemas/my-plugin-options.schema.json**

   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "object",
     "additionalProperties": false,
     "properties": {
       "outputFolder": {
         "type": "string",
         "description": "The output folder for generated files."
       }
     },
     "required": ["outputFolder"]
   }
   ```

2. Reference the schema from your plugin manifest:

   **heft-plugin.json**

   ```json
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-plugin.schema.json",
     "taskPlugins": [
       {
         "pluginName": "my-plugin",
         "entryPoint": "./lib-commonjs/MyPlugin",
         "optionsSchema": "./lib-commonjs/schemas/my-plugin-options.schema.json"
       }
     ]
   }
   ```

3. Consumers specify the options in **heft.json**:

   ```json
   {
     "tasksByName": {
       "my-task": {
         "taskPlugin": {
           "pluginPackage": "heft-my-plugin",
           "options": {
             "outputFolder": "dist/generated"
           }
         }
       }
     }
   }
   ```

The options are validated against your schema at load time, providing clear error messages for
invalid configurations.

## Defining CLI parameters

Plugins can define CLI parameters by adding a `parameters` array to the plugin manifest.
These parameters are automatically added to Heft's command line when the plugin is loaded.

**heft-plugin.json**

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-plugin.schema.json",
  "taskPlugins": [
    {
      "pluginName": "my-plugin",
      "entryPoint": "./lib-commonjs/MyPlugin",
      "parameterScope": "my-plugin",
      "parameters": [
        {
          "longName": "--output-format",
          "parameterKind": "choice",
          "description": "Specifies the output format.",
          "alternatives": [
            { "name": "json", "description": "Output as JSON" },
            { "name": "yaml", "description": "Output as YAML" }
          ],
          "defaultValue": "json"
        },
        {
          "longName": "--verbose",
          "parameterKind": "flag",
          "description": "Enable verbose logging."
        }
      ]
    }
  ]
}
```

The supported parameter kinds are: `flag`, `string`, `stringList`, `integer`, `integerList`,
`choice`, and `choiceList`.

To read the parameter values in your plugin, use `taskSession.parameters`:

```ts
public apply(taskSession: IHeftTaskSession, heftConfiguration: HeftConfiguration): void {
  taskSession.hooks.run.tapPromise(PLUGIN_NAME, async () => {
    const verbose = taskSession.parameters.getFlagParameter('--verbose');
    if (verbose.value) {
      taskSession.logger.terminal.writeLine('Verbose mode enabled');
    }
  });
}
```

## Interacting with other plugins

A plugin can request access to another plugin within the same phase using the
`requestAccessToPluginByName()` API. This enables plugins to share data via custom accessor hooks.

```ts
taskSession.requestAccessToPluginByName(
  '@rushstack/heft-typescript-plugin', // the package containing the plugin
  'typescript-plugin', // the plugin name
  (accessor) => {
    // Access hooks or data exposed by the TypeScript plugin
  }
);
```

## Reference examples

The best way to learn plugin development is to study the official plugin implementations:

- [heft-dev-cert-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-dev-cert-plugin) — A simple task plugin example
- [heft-jest-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-jest-plugin) — A complex plugin with many CLI parameters
- [heft-typescript-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-typescript-plugin) — The TypeScript compiler plugin
- [heft-rspack-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-rspack-plugin) — A plugin with watch mode support

## See also

- [Heft architecture](../intro/architecture.md) — Key concepts and terminology
- [heft.json](../configs/heft_json.md) — Config file reference for loading plugins
- [Run script plugin](../plugins/run-script.md) — A simpler alternative for quick prototyping
- [Plugin package index](../plugins/package_index.md) — List of official plugins
- [API Reference](https://api.rushstack.io/pages/heft/) — Complete Heft API documentation
