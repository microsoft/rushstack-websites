---
title: Copy files plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft](https://github.com/microsoft/rushstack/tree/main/apps/heft) (built-in) |
| **Plugin name:** | [copy-files-plugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json) implemented by [CopyFilesPlugin.ts](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/CopyFilesPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [copy-files-options.schema.json](https://developer.microsoft.com/json-schemas/heft/v0/copy-files-options.schema.json) |
<!-- prettier-ignore-end -->

This plugin copies files or folders specified using various wildcards.

## When to use it

Typical usage scenarios:

- Copying asset files such as images or fonts into a "dist" folder
- Copying .d.ts files into a `temp/typings` folder before compiling
- Copying `node_modules` dependencies to be repackaged

Some caveats:

- It is NOT RECOMMENDED to use `copy-files-plugin` for copying assets into the TypeScript emit folder;
  use [staticAssetsToCopy](../plugins/typescript.md) instead, as it interoperates better with
  `additionalModuleKindsToEmit` and watch mode.
- Avoid using this task to read/write files outside the project folder. Doing so would violate Rush's
  [principle of project isolation](../tutorials/heft_and_rush.md).
- Where possible, avoid using inefficient glob operators such as `**` that recursively traverse a directory tree.
  These disk-intensive operations will slow down the build.
- Overly broad wildcards can sometimes include stray folders that are not tracked by Git.

## package.json dependencies

None - this feature is built-in to `@rushstack/heft`.

## Configuration

The `copy-files-plugin` is a built-in plugin loaded directly from `@rushstack/heft`.

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "extends": "@rushstack/heft-web-rig/profiles/library/config/heft.json",

  "phasesByName": {
    // ("build" is a user-defined name, not a schema field)
    "build": {
      "tasksByName": {
        // ("post-compile-copy" is a user-defined name, not a schema field)
        "post-compile-copy": {
          // The "post-compile-copy" task should not run until after "typescript" completes
          "taskDependencies": ["typescript"],

          "taskPlugin": {
            "pluginName": "copy-files-plugin",
            "pluginPackage": "@rushstack/heft",

            // --------------------------------------------------------------
            // EXAMPLE OPTIONS FOR copy-files-plugin
            "options": {
              "copyOperations": [
                {
                  "sourcePath": "assets/images",
                  "destinationFolders": ["dist"],
                  "fileExtensions": [ ".png", ".jpg" ]
                }
              ]
            }
            // --------------------------------------------------------------
          }
        }
      }
    }
  }
}
```

This commented template describes the available options. In the above example, it would get
pasted between the two horizontal bars

**heft.json "options" section**

```ts
// OPTIONS FOR copy-files-plugin
// JSON Schema: https://developer.microsoft.com/json-schemas/heft/v0/copy-files-options.schema.json
"options": {
  /**
   * An array of copy operations to be performed by this task.
   */
  "copyOperations": [
    /**
     * (REQUIRED) One or more folders that files and folders will be copied into,
     * relative to the project root.
     */
    "destinationFolders": [ "dist" ],

    /**
     * Absolute path to the source file or folder, relative to the project root.
     * If "fileExtensions", "excludeGlobs",  or "includeGlobs" are specified, then "sourcePath"
     * is assumed to be a folder; if it is not a folder, an error will be thrown.
     * Settings such as "includeGlobs" and "excludeGlobs" will be resolved relative to this path.
     * If no globs or file extensions are specified, the entire folder will be copied.
     * If this parameter is not provided, it defaults to the project root.
     */
    // "sourcePath": "assets/images",

    /**
     * If specified, this option recursively scans all folders under "sourcePath" and includes
     * any files that match the specified extensions.  If "fileExtensions" and "includeGlobs"
     * are both specified, their selections are added together.
     */
    // "fileExtensions": [ ".png" ],

    /**
     * A list of glob patterns that select files to be copied.  The paths are resolved relative
     * to "sourcePath", which must be a folder path.  If "fileExtensions" and "includeGlobs"
     * are both specified, their selections are added together.
     *
     * For glob syntax, refer to: https://www.npmjs.com/package/fast-glob
     */
    // "includeGlobs": [],

    /**
     * A list of glob patterns that exclude files or folders from being copied.  The paths are resolved
     * relative to "sourcePath", which must be a folder path.  These exclusions eliminate items that
     * were selected by the "includeGlobs" or "fileExtensions" setting.
     *
     * For glob syntax, refer to: https://www.npmjs.com/package/fast-glob
     */
    // "excludeGlobs": [ "**/temp" ],

    /**
     * Normally, copying will preserve the path relative to "sourcePath" under the destination folder.
     * (For example, if "sourcePath" is "src/test" and "destinationFolders" is ["out"], then
     * "src/test/a/b/c.txt" will be copied to "out/a/b/c.txt".)  Specify "flatten: true" to discard
     * path information and keep only the filename (for example, "out/c.txt").  If two files have
     * the same name, an error will be reported. The default value is false.
     */
    // "flatten": true,

    /**
     * If true, filesystem hard links will be created instead of copying the file.  Depending on the
     * operating system, this may be faster.  The default value is false.
     *
     * NOTE: This may cause unexpected behavior if a tool modifies the link. The contained directory
     * structure will be re-created and all files will be individually hardlinked.  This means that
     * folders will be new filesystem entities and will have separate folder metadata, while the
     * contained files will maintain normal hardlink behavior.  This is done since folders do not
     * have a cross-platform equivalent of a hardlink, and since file symlinks provide fundamentally
     * different functionality in comparison to hardlinks.
     */
    // "hardlink": true
  ]
}
```
