---
title: Delete files plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft](https://github.com/microsoft/rushstack/tree/main/apps/heft) (built-in) |
| **Plugin name:** | [delete-files-plugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json) implemented by [DeleteFilesPlugin.ts](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/DeleteFilesPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [delete-files-options.schema.json](https://developer.microsoft.com/json-schemas/heft/v0/delete-files-options.schema.json) |
<!-- prettier-ignore-end -->

This plugin deletes files or folders specified using various wildcards.

## When to use it

**NOT GENERALLY NEEDED:** It is recommended to delete build output files using the `cleanFiles` setting for
Heft phases, since this ensures proper interoperation with other features such as `--clean`.
The `delete-files-plugin` is generally only used for mid-phase situations, for example deleting to refine the
result of a `copy-files-plugin` operation.

Some caveats:

- Avoid using this task to delete files outside the project folder. Doing so would violate Rush's
  [principle of project isolation](../tutorials/heft_and_rush.md).
- Where possible, avoid using inefficient glob operators such as `**` that recursively traverse a directory tree.
  These disk-intensive operations will slow down the build.

## package.json dependencies

None - this feature is built-in to `@rushstack/heft`.

## Configuration

The `delete-files-plugin` is a built-in plugin loaded directly from `@rushstack/heft`.
Here's a code sample for a task that loads this plugin:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "extends": "@rushstack/heft-web-rig/profiles/library/config/heft.json",

  "phasesByName": {
    // ("build" is a user-defined name, not a schema field)
    "build": {
      "tasksByName": {
        // ("post-compile" is a user-defined name, not a schema field)
        "post-compile": {
          // The "post-compile" task should not run until after "typescript" completes
          "taskDependencies": ["typescript"],

          "taskPlugin": {
            "pluginName": "delete-files-plugin",
            "pluginPackage": "@rushstack/heft",

            // --------------------------------------------------------------
            // EXAMPLE OPTIONS FOR delete-files-plugin
            "options": {
              "deleteOperations": [
                {
                  "sourcePath": ["temp/typings"],
                  "fileExtensions": [ ".d.ts" ]
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

## heft.json plugin options

This commented template documents the available options. In the above example, it would get
pasted between the `------` bars.

```ts
// OPTIONS FOR delete-files-plugin
// JSON Schema: https://developer.microsoft.com/json-schemas/heft/v0/delete-files-options.schema.json
"options": {
  /**
   * An array of delete operations to be performed by this task.
   */
  "deleteOperations": [
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
  ]
}
```
