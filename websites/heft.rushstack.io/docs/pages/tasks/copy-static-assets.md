---
title: '"copy-static-assets" task'
---

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
