---
title: Isolated transpile plugin (SWC)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-isolated-typescript-transpile-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-isolated-typescript-transpile-plugin) |
| **Plugin name:** | [swc-isolated-transpile-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-isolated-typescript-transpile-plugin/heft-plugin.json) implemented by [SwcIsolatedTranspilePlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-isolated-typescript-transpile-plugin/src/SwcIsolatedTranspilePlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [swc-isolated-transpile-plugin.schema.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-isolated-typescript-transpile-plugin/src/schemas/swc-isolated-transpile-plugin.schema.json) |
<!-- prettier-ignore-end -->

This plugin uses [SWC](https://swc.rs/) to transpile TypeScript source files into JavaScript, as an
alternative to the standard [TypeScript plugin](./typescript.md). SWC is a high-performance transpiler
written in Rust that can be significantly faster than the TypeScript compiler for the transpilation step.

## When to use it

The isolated transpile plugin is useful when you want to speed up the JavaScript emit step of your build.
In a typical TypeScript build, the TypeScript compiler both type-checks your code _and_ transpiles it to
JavaScript. These two tasks can be separated:

- **Type checking** remains handled by the standard [TypeScript plugin](./typescript.md) with
  `emitDeclarationOnly: true` in your **tsconfig.json**
- **Transpilation** is handled by this plugin using SWC, which processes each file independently
  (hence "isolated transpile")

Because SWC processes files in isolation, it cannot perform cross-file type checking or certain
TypeScript-specific emit transformations that require type information. However, for many projects
the performance benefit is substantial.

> **Note:** This plugin requires `@rushstack/heft-typescript-plugin` as a peer dependency, since it
> reuses the TypeScript plugin's tsconfig loading infrastructure.

## package.json dependencies

You'll need to add the plugin package to your project:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-isolated-typescript-transpile-plugin --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install @rushstack/heft-isolated-typescript-transpile-plugin --save-dev
```

  </TabItem>
</Tabs>

You must also have `@rushstack/heft-typescript-plugin` installed, since it is a peer dependency.

## Configuration

Your [heft.json config file](../configs/heft_json.md) should invoke both the TypeScript plugin
(for type checking and declaration emit) and this plugin (for JavaScript transpilation):

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    "build": {
      "cleanFiles": [
        { "sourcePath": "dist" },
        { "sourcePath": "lib" },
        { "sourcePath": "lib-commonjs" }
      ],
      "tasksByName": {
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "swc-transpile": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-isolated-typescript-transpile-plugin",
            "options": {
              "emitKinds": [
                {
                  "outDir": "lib-commonjs",
                  "formatOverride": "CommonJS",
                  "targetOverride": "ES2017"
                },
                {
                  "outDir": "lib",
                  "formatOverride": "ESNext",
                  "targetOverride": "ES2017"
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

When using this plugin, you should configure the TypeScript plugin to only emit declarations by setting
`"emitDeclarationOnly": true` in your **tsconfig.json**, since the JavaScript output will be produced
by SWC instead.

## heft.json plugin options

```js
// JSON Schema: swc-isolated-transpile-plugin.schema.json
"options": {
  /**
   * (Optional) The path to the tsconfig.json file. If not specified, the default
   * tsconfig.json resolution is used.
   */
  // "tsConfigPath": "./tsconfig.json",

  /**
   * (REQUIRED) An array of emit configurations. Each entry specifies an output
   * directory, module format, and target.
   */
  "emitKinds": [
    {
      /**
       * The output directory for the transpiled files, relative to the project folder.
       */
      "outDir": "lib-commonjs",

      /**
       * The module format for transpiled files. Uses TypeScript's ModuleKind names.
       * Supported values: "CommonJS", "ES2015", "ES2020", "ES2022", "ESNext",
       * "Node16", "NodeNext", "AMD", "UMD"
       */
      "formatOverride": "CommonJS",

      /**
       * The target ECMAScript version for transpiled files. Uses TypeScript's
       * ScriptTarget names.
       * Supported values: "ES3", "ES5", "ES2015", "ES2016", "ES2017", "ES2018",
       * "ES2019", "ES2020", "ES2021", "ES2022", "ES2023", "ES2024", "ESNext"
       */
      "targetOverride": "ES2017"
    }
  ]
}
```

## See also

- [TypeScript plugin](./typescript.md) - The standard TypeScript compiler plugin
- [SWC documentation](https://swc.rs/)
