---
title: The "rush-lib" API
---

Rush provides an API for use by automation scripts. It is documented in the integrated API reference for all Rush Stack projects:

&nbsp;&nbsp;&nbsp;&nbsp; [API Reference: @microsoft/rush-lib package](https://api.rushstack.io/pages/rush-lib/)

Below are some usage examples.

> Although these code samples are presented as plain JavaScript, we strongly recommend to use TypeScript and model your scripts as regular Rush projects. It is more work to set up initially, but it generally saves time and simplifies maintenance in the long run.

## rush-lib vs rush-sdk

You may notice that the NPM packages `@microsoft/rush-lib` and `rushstack/rush-sdk` export the same APIs. What is the difference?

- `@microsoft/rush-lib` is the _**engine**_ of Rush that implements all the core features. It is relatively large package that also includes some built-in Rush plugins, with many NPM dependencies.

- `@microsoft/rush` is the **CLI** (command-line interface) that provides the `rush` and `rushx` commands that you can invoke from your shell. `@microsoft/rush` depends on `@microsoft/rush-lib`, however if your repository's **rush.json** file requests a different `rushVersion`, the [Rush "version selector"](../contributing.md) will automatically install the requested version of the `@microsoft/rush-lib` engine and use that instead. This ensures that CLI commands always have deterministic behavior, regardless of what version of `@microsoft/rush` is installed globally.

- `@microsoft/rush-sdk` is the _**API**_ interface, which has very few NPM dependencies itself, and mainly acts as a proxy for accessing the `@microsoft/rush-lib` engine. It provides two main benefits: (1) If your tool imports from `@microsoft/rush-sdk`, then it will load the appropriate version of the engine based on `rushVersion` from **rush.json**. This is important, for example because config file formats change between Rush versions, so your tool might fail to parse a config file if the wrong engine version is used. (2) `@microsoft/rush-sdk` also allows you to import internal API's from `@microsoft/rush-lib`, which are normally difficult to access because that package is distributed as a Webpack bundle. See the [@rushstack/rush-sdk](https://www.npmjs.com/package/@rushstack/rush-sdk) documentation for more details.

## Example 1: Reading the rush.json configuration

Rather than trying to load **rush.json** as a JSON file, it is recommended to use the [RushConfiguration](https://api.rushstack.io/pages/rush-lib.rushconfiguration/) class which provides a richer set of data views.

For example, this script will show all the Rush projects and their folders:

```ts
const rushSdk = require('@rushstack/rush-sdk');

// loadFromDefaultLocation() will search parent folders to find "rush.json" and then
// take care of parsing it and loading related config files.
const rushConfiguration = rushSdk.RushConfiguration.loadFromDefaultLocation({
  startingFolder: process.cwd()
});

for (const project of rushConfiguration.projects) {
  console.log(project.packageName + ':');
  console.log('  ' + project.projectRelativeFolder);
}
```

## Example 2: Modifying package.json files

If you want to modify a **package.json** file, the [PackageJsonEditor](https://api.rushstack.io/pages/rush-lib.packagejsoneditor/) class provides helpful validation and normalization:

```ts
const rushSdk = require('@rushstack/rush-sdk');

const rushConfiguration = rushSdk.RushConfiguration.loadFromDefaultLocation({
  startingFolder: process.cwd()
});

// This will find "@rushstack/ts-command-line" in rush.json, without needing to specify the NPM scope
const project = rushConfiguration.findProjectByShorthandName('ts-command-line');

// Add lodash as an optional dependency
project.packageJsonEditor.addOrUpdateDependency('lodash', '4.17.15', 'optionalDependencies');

// Save the modified package.json file
project.packageJsonEditor.saveIfModified();
```

## Example 3: Generating a README.md summary

For a more realistic example, the [repo-toolbox/src/ReadmeAction.ts](https://github.com/microsoft/rushstack/blob/main/repo-scripts/repo-toolbox/src/ReadmeAction.ts) tool uses these APIs to generate the [README.md](https://github.com/microsoft/rushstack/blob/main/README.md#published-packages) inventory for the Rush Stack monorepo.
