---
title: The "rush-lib" API
---

Rush provides an API for use by automation scripts. It is documented in the integrated API reference for all Rush Stack projects:

&nbsp;&nbsp;&nbsp;&nbsp; [API Reference: @microsoft/rush-lib package](https://rushstack.io/pages/api/rush-lib/)

Below are some usage examples.

> Although these code samples are presented as plain JavaScript, we strongly recommend to use TypeScript and model your scripts as regular Rush projects. It is more work to set up initially, but it generally saves time and simplifies maintenance in the long run.

## Reading the rush.json configuration

Rather than trying to load **rush.json** as a JSON file, it is recommended to use the [RushConfiguration](https://rushstack.io/pages/api/rush-lib.rushconfiguration/) class which provides a richer set of data views.

For example, this script will show all the Rush projects and their folders:

```ts
const rushLib = require('@microsoft/rush-lib');

// loadFromDefaultLocation() will search parent folders to find "rush.json" and then
// take care of parsing it and loading related config files.
const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
  startingFolder: process.cwd()
});

for (const project of rushConfiguration.projects) {
  console.log(project.packageName + ':');
  console.log('  ' + project.projectRelativeFolder);
}
```

## Modifying package.json files

If you want to modify a **package.json** file, the [PackageJsonEditor](https://rushstack.io/pages/api/rush-lib.packagejsoneditor/) class provides helpful validation and normalization:

```ts
const rushLib = require('@microsoft/rush-lib');

const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
  startingFolder: process.cwd()
});

// This will find "@rushstack/ts-command-line" in rush.json, without needing to specify the NPM scope
const project = rushConfiguration.findProjectByShorthandName('ts-command-line');

// Add lodash as an optional dependency
project.packageJsonEditor.addOrUpdateDependency('lodash', '4.17.15', 'optionalDependencies');

// Save the modified package.json file
project.packageJsonEditor.saveIfModified();
```

## Generating a README.md summary

For a more realistic example, the [repo-toolbox/src/ReadmeAction.ts](https://github.com/microsoft/rushstack/blob/master/repo-scripts/repo-toolbox/src/ReadmeAction.ts) tool uses these APIs to generate the [README.md](https://github.com/microsoft/rushstack/blob/master/README.md#published-packages) inventory for the Rush Stack monorepo.
