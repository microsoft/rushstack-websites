---
title: API Extractor plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-api-extractor-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-api-extractor-plugin) |
| **Plugin name:** | [api-extractor-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-api-extractor-plugin/heft-plugin.json) implemented by [ApiExtractorPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-api-extractor-plugin/src/ApiExtractorPlugin.ts) |
| **Plugin config file:** | [api-extractor-task.json](../configs/api-extractor-task_json.md) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This plugin invokes the [API Extractor](@api-extractor/) tool which reads TypeScript declarations (.d.ts files)
as inputs and produces three types of outputs:

**1. API Report** - API Extractor can trace all exports from your project's main entry point and generate
a report to be used as the basis for an API review workflow.

**2. .d.ts Rollups** - Similar to how **Webpack** can "roll up" all your JavaScript files into a single .js file
for distribution, API Extractor can roll up your TypeScript declarations into a single .d.ts file.

**3. API Documentation** - API Extractor can generate a "doc model" JSON file for each of your projects. This
JSON file contains the extracted type signatures and doc comments. The **api-documenter** companion tool
can use these files to generate an API reference website, or you can use them as inputs for a custom documentation
pipeline.

See the [API Extractor documentation](@api-extractor/pages/overview/intro/) for details about how it works.

## When to use it

We recommend to use API Extractor for every TypeScript library project, especially if it is published as an NPM package.

## package.json dependencies

If you are using a standard rig such as [@rushstack/heft-node-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-node-rig)
or [@rushstack/heft-web-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig), then API Extractor
will already be loaded and configured.

Otherwise, you'll need to add these packages to your project:

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-api-extractor-plugin --dev
rush add --package @microsoft/api-extractor --dev

# Or if you are using plain NPM, run this shell command:
npm install @rushstack/heft-api-extractor-plugin --save-dev
npm install @microsoft/api-extractor --save-dev
```

## Configuration

If API Extractor is not already being provided by a rig, your [heft.json config file](../configs/heft_json.md) could invoke it
like in this example:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  . . .
  "phasesByName": {
    "build": {
      "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }, { "sourcePath": "lib-commonjs" }],
      "tasksByName": {
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "api-extractor": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-api-extractor-plugin"
          }
        },
        . . .
      }
    }
    . . .
  }
}
```

Heft looks for API Extractor's config file [config/api-extractor.json](@api-extractor/pages/configs/api-extractor_json/). This file can be created by invoking the [api-extractor init](@api-extractor/pages/commands/api-extractor_init/) command. This file is [riggable](../intro/rig_packages.md).

For advanced scenarios, the optional [api-extractor-task.json](../configs/api-extractor-task_json.md) config file provides some additional Heft-specific settings.
