---
title: typescript.json
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **File path:** | **&lt;project folder&gt;/config/typescript.json** |
| [**Riggable?**](../intro/rig_packages.md) | Yes |
| **Associated plugin:** | [TypeScript plugin](../plugins/typescript.md) |
<!-- prettier-ignore-end -->

## Template

```js
/**
 * Configures the TypeScript plugin for Heft.
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/typescript.schema.json",

  /**
   * Optionally specifies another JSON config file that this file extends from. This provides a way for standard
   * settings to be shared across multiple projects.
   * 
   * To delete an inherited setting, set it to `null` in this file.
   */
  // "extends": "base-project/config/typescript.json",

  /**
   * If provided, emit these module kinds in addition to the modules specified in the tsconfig.
   * Note that this option only applies to the main tsconfig.json configuration.
   */
  "additionalModuleKindsToEmit": [
    // {
    //   /**
    //    * (REQUIRED) Must be one of "commonjs", "amd", "umd", "system", "es2015", "esnext"
    //    */
    //  "moduleKind": "amd",
    //
    //   /**
    //    * (REQUIRED) The name of the folder where the output will be written.
    //    */
    //    "outFolderName": "lib-amd"
    // }
  ],

  /**
   * If true, emit CommonJS module output to the folder specified in the tsconfig "outDir"
   * compiler option with the .cjs extension alongside (or instead of, if tsconfig.json
   * specifies CommonJS) the default compilation output.
   */
  // "emitCjsExtensionForCommonJS": true,

  /**
   * If true, emit ESNext module output to the folder specified in the tsconfig "outDir"
   * compiler option with the .mjs extension alongside (or instead of, if tsconfig.js
   * specifies ESNext) the default compilation output.
   */
  // "emitMjsExtensionForESModule": true,

  /**
   * If true, enable behavior analogous to the "tsc --build" command. Will build projects
   * referenced by the main project. Note that this will effectively enable "noEmitOnError".
   */
  // "buildProjectReferences": true,

  /**
   * If true, and the tsconfig.json has "isolatedModules": true, then transpilation will happen
   * in parallel in a worker thread.
   */
  // "useTranspilerWorker": true,

  /**
   * Specifies the tsconfig.json file that will be used for compilation. Equivalent to
   * the "project" argument for the 'tsc' and 'tslint' command line tools.
   * The default value is "./tsconfig.json".
   */
  // "project": "tsconfig.special.json",

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
}
```

## See also

- [TypeScript plugin](../plugins/typescript.md)
- [Jest plugin](../plugins/jest.md)
