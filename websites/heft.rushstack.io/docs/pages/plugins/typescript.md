---
title: TypeScript plugin
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-typescript-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-typescript-plugin) |
| **Plugin name:** | [typescript-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-typescript-plugin/heft-plugin.json) implemented by [TypeScriptPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-typescript-plugin/src/TypeScriptPlugin.ts) |
| **Plugin config file:** | [typescript.json](../configs/typescript_json.md) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This plugin invokes the compiler for the [TypeScript](https://www.typescriptlang.org/) programming language.

## When to use it

TypeScript is the standard programming language for Rush Stack. There are many benefits to having one "lingua franca" across all coding investments, rather than having to maintain different expertise and libraries for different languages.

We recommend TypeScript for:

- **Application development:** It's even a good choice for prototypes and small experiments.
- **Tooling infrastructure:** A great developer experience multiplies everyone's productivity, so build tools should be treated as first-class software projects with their own designs, documentation, and tests.
- **Device apps:** Where possible, TypeScript can also be used for native development via runtime hosts such as [React Native](https://reactnative.dev/).
- **Desktop apps:** There are also runtime hosts such as [Electron](https://www.electronjs.org/) for making desktop apps.

Obviously certain components may inevitably require Java, C++, Swift, etc. But ideally developers should not be required to install native SDKs unless they're working on those components. The [Expo client](https://expo.io/features) takes this concept to an extreme, enabling you to compile and run a phone app without installing native tools at all. This ideal isn't always feasible in practice, of course. It's a mentality, not a dogma. The main point is that there are significant benefits to normalizing the code base so that any engineer can easily contribute to any project, and any project can load any library.

## package.json dependencies

If you are using a standard rig such as [@rushstack/heft-node-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-node-rig)
or [@rushstack/heft-web-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig), then TypeScript
will already be loaded and configured.

Otherwise, you'll need to add the plugin package to your project:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-typescript-plugin --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install @rushstack/heft-typescript-plugin --save-dev
```

  </TabItem>
</Tabs>

You will also need to add the `typescript` package to your project:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package typescript --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install typescript --save-dev
```

  </TabItem>
</Tabs>

If your **tsconfig.json** enables `"importHelpers": true` for more efficient transpiler output, you may also need a dependency on **tslib**:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package tslib --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# Or if you are using vanilla NPM, run this shell command in your project folder:
npm install tslib --save-dev
```

  </TabItem>
</Tabs>

## Configuration

If TypeScript is not already being provided by a rig, your [heft.json config file](../configs/heft_json.md) could
invoke it like in this example:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  . . .
  "phasesByName": {
    "build": {
      "cleanFiles": [
        { "sourcePath": "dist" },
        { "sourcePath": "lib" },
        { "sourcePath": "lib-amd" },
        { "sourcePath": "lib-commonjs" },
        { "sourcePath": "lib-es6" }
      ],
      "tasksByName": {
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        }
      }
    }
  }
}
```

The primary configuration comes from TypeScript's [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file.

For advanced scenarios, Heft also supports an optional [config/typescript.json](../configs/typescript_json.md)
config file that can be used to configure toolchain features such as multiple emit targets for the TypeScript
compiler. It also supports a `staticAssetsToCopy` feature for copying files such as `.css` and `.json`
into the emit target folder.

## See also

- [config/typescript.json](../configs/typescript_json.md) config file for Heft
- [tsconfig.json](https://www.typescriptlang.org/tsconfig) reference
