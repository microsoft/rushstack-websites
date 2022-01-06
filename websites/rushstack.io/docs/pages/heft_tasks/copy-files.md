---
title: '"copy-files" task'
---

This task implements the `"actionKind": "copyFiles"` action kind that is used when specifying
`"eventActions"` in the [heft.json](../heft_configs/heft_json.md) config file.


## When to use it

This task is most commonly used to copy asset files such as fonts or images into the build output folder.

Some general notes:
- Avoid using this task to read/write files outside the project folder.  Doing so would violate Rush's
  [principle of project isolation](../heft_tutorials/heft_and_rush.md).
- Where possible, avoid using inefficient glob operators such as `**` that recursively traverse a directory tree.
  These disk-intensive operations will slow down the build.
- Overly broad wildcards can sometimes include stray folders that are not tracked by Git.


## package.json dependencies

None - this feature is implemented internally by Heft.


## Config files

Event actions are registered in the [heft.json](../heft_configs/heft_json.md) config file.  For example:

**&lt;project folder&gt;/config/heft.json**
```js
{
  . . .

  "eventActions": [
    {
      /**
       * (Required) The kind of built-in operation that should be performed.
       * The "copyFiles" action copies files that match the specified patterns.
       */
      "actionKind": "copyFiles",

      /**
       * (Required) The Heft stage when this action should be performed.  Note that heft.json event actions
       * are scheduled after any plugin tasks have processed the event.  For example, a "compile" event action
       * will be performed after the TypeScript compiler has been invoked.
       *
       * Options: "pre-compile", "compile", "bundle", "post-build"
       */
      "heftEvent": "pre-compile",

      /**
       * (Required) A user-defined tag whose purpose is to allow configs to replace/delete handlers that
       * were added by other configs.
       */
      "actionId": "my-example-action",

      /**
       * (Required) An array of copy operations to run perform during the specified Heft event.
       */
      "copyOperations": [
        {
          /**
           * (Required) The base folder that files will be copied from, relative to the project root.
           * Settings such as "includeGlobs" and "excludeGlobs" will be resolved relative
           * to this folder.
           * NOTE: Assigning "sourceFolder" does not by itself select any files to be copied.
           */
          "sourceFolder": "src",

          /**
           * (Required) One or more folders that files will be copied into, relative to the project root.
           * If you specify more than one destination folder, Heft will read the input files only once, using
           * streams to efficiently write multiple outputs.
           */
          "destinationFolders": ["dist"],

          /**
           * If specified, this option recursively scans all folders under "sourceFolder" and includes any files
           * that match the specified extensions.  (If "fileExtensions" and "includeGlobs" are both
           * specified, their selections are added together.)
           */
          // "fileExtensions": [".jpg", ".png"],

          /**
           * A list of glob patterns that select files to be copied.  The paths are resolved relative
           * to "sourceFolder".
           * Documentation for supported glob syntaxes: https:www.npmjs.com/package/fast-glob
           */
          "includeGlobs": ["assets/*.md"],

          /**
           * A list of glob patterns that exclude files/folders from being copied.  The paths are resolved relative
           * to "sourceFolder".  These exclusions eliminate items that were selected by the "includeGlobs"
           * or "fileExtensions" setting.
           */
          // "excludeGlobs": [],

          /**
           * Normally, when files are selected under a child folder, a corresponding folder will be created in
           * the destination folder.  Specify flatten=true to discard the source path and copy all matching files
           * to the same folder.  If two files have the same name an error will be reported.
           * The default value is false.
           */
          // "flatten": false,

          /**
           * If true, filesystem hard links will be created instead of copying the file.  Depending on the
           * operating system, this may be faster. (But note that it may cause unexpected behavior if a tool
           * modifies the link.)  The default value is false.
           */
          // "hardlink": false
        }
      ]
    }
  ],

  . . .
}
```
