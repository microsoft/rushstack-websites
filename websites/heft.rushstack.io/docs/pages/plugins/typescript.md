---
title: TypeScript plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-typescript-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-typescript-plugin) |
| **Plugin name:** | [typescript-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-typescript-plugin/heft-plugin.json) implemented by [TypeScriptPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-typescript-plugin/src/TypeScriptPlugin.ts) |
| **Plugin config file:** | [typescript.json](../configs/typescript_json.md) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This task invokes the compiler for the [TypeScript](https://www.typescriptlang.org/) programming language.

## When to use it

TypeScript is the standard programming language for Rush Stack. There are many benefits to having one "lingua franca" across all coding investments, rather than having to maintain different expertise and libraries for different languages.

We recommend TypeScript for:

- **Application development:** It's even a good choice for prototypes and small experiments.
- **Tooling infrastructure:** A great developer experience multiplies everyone's productivity, so build tools should be treated as first-class software projects with their own designs, documentation, and tests.
- **Device apps:** Where possible, TypeScript can also be used for native development via runtime hosts such as [React Native](https://reactnative.dev/).
- **Desktop apps:** There are also runtime hosts such as [Electron](https://www.electronjs.org/) for making desktop apps.

Obviously certain components may inevitably require Java, C++, Swift, etc. But ideally developers should not be required to install native SDKs unless they're working on those components. The [Expo client](https://expo.io/features) takes this concept to an extreme, enabling you to compile and run a phone app without installing native tools at all. This ideal isn't always feasible in practice, of course. It's a mentality, not a dogma. The main point is that there are significant benefits to normalizing the code base so that any engineer can easily contribute to any project, and any project can load any library.

## package.json dependencies

You will need to add the `typescript` package to your project:

```bash
rush add --package typescript --dev
```

Alternatively, you can avoid this dependency by loading it from a "rig package", as described in the [Interfacing with Rush](../tutorials/heft_and_rush.md) article.

If your **tsconfig.json** enables `"importHelpers": true` for more efficient transpiler output, you may also need a dependency on **tslib**:

```bash
rush add --package tslib
```

## Config files

The primary configuration comes from TypeScript's [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file.

For advanced scenarios, Heft also provides an optional [typescript.json](../configs/typescript_json.md) config file that can be used to configure toolchain features such as multiple emit targets for the TypeScript compiler.

---

## title: '"copy-static-assets" task'

This task supplements the TypeScript transpiler by copying asset files into the output folder, so that they can be imported by .js files.

## When to use it

The `copy-static-assets` task is used when source files need to reference asset files using `import` or `require()`. For example, a React project may have a file that loads an **src/styles.css** asset like this:

**src/index.tsx**

```ts
import './styles.css';

. . .
```

In Heft's standard configuration, the TypeScript compiler reads **src/\*\*/.ts** inputs and writes **lib/\*\*/.js** outputs. When Webpack is invoked on **lib/index.js**, it will process the resulting `require("./styles.css");` and expect to bundle the file path **lib/styles.css** (instead of **src/styles.css** as in the TypeScript code).

## package.json dependencies

None - this feature is implemented internally by Heft.

## Config files

Continuing the above example, we can copy the `styles.css` file using the `"staticAssetsToCopy"`setting in [typescript.json](../configs/typescript_json.md). For example:

**&lt;project folder&gt;/config/typescript.json**

```js
  . . .

  /**
   * Configures additional file types that should be copied into the TypeScript compiler's emit folders, for example
   * so that these files can be resolved by import statements.
   */
  "staticAssetsToCopy": {
    /**
     * File extensions that should be copied from the src folder to the destination folder(s).
     */
    // "fileExtensions": [
    //   ".json", ".css"
    // ],

    "fileExtensions": [
      ".css"
    ],

    /**
     * Glob patterns that should be explicitly included.
     */
    // "includeGlobs": [
    //   "some/path/*.js"
    // ],

    /**
     * Glob patterns that should be explicitly excluded. This takes precedence over globs listed
     * in "includeGlobs" and files that match the file extensions provided in "fileExtensions".
     */
    // "excludeGlobs": [
    //   "some/path/*.css"
    // ]
  }

. . .
```
