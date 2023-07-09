---
title: 'delete-files-plugin'
---

This task implements the `"actionKind": "deleteGlobs"` action kind that is used when specifying
`"eventActions"` in the [heft.json](../configs/heft_json.md) config file.

## When to use it

The most common usage is to implement the `heft clean` action that deletes build output folders
such as `lib`, `temp`, and `dist`.

## package.json dependencies

None - this feature is implemented internally by Heft.

## Config files

Event actions are registered in the [heft.json](../configs/heft_json.md) config file. For example:

**&lt;project folder&gt;/config/heft.json**

```js
{
  . . .

  "eventActions": [
    {
      /**
       * (Required) The kind of built-in operation that should be performed.
       * The "deleteGlobs" action deletes files or folders that match the specified glob patterns.
       */
      "actionKind": "deleteGlobs",

      /**
       * (Required) The Heft stage when this action should be performed.  Note that heft.json event actions
       * are scheduled after any plugin tasks have processed the event.  For example, a "compile" event action
       * will be performed after the TypeScript compiler has been invoked.
       *
       * Options: "clean", "pre-compile", "compile", "bundle", "post-build"
       */
      "heftEvent": "clean",

      /**
       * (Required) A user-defined tag whose purpose is to allow configs to replace/delete handlers that
       * were added by other configs.
       */
      "actionId": "my-example-action",

      /**
       * (Required) Glob patterns to be deleted. The paths are resolved relative to the project folder.
       * Documentation for supported glob syntaxes: https://www.npmjs.com/package/fast-glob
       */
      "globsToDelete": [
        "dist",
        "lib",
        "lib-esnext",
        "temp"
      ]
    }
  ],

  . . .
}
```
