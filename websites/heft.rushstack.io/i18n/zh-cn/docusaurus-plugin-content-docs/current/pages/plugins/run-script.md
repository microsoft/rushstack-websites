---
title: Run script plugin
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft](https://github.com/microsoft/rushstack/tree/main/apps/heft) (built-in) |
| **Plugin name:** | [run-script-plugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json) implemented by [RunScriptPlugin.ts](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/RunScriptPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [run-script-options.schema.json](https://developer.microsoft.com/json-schemas/heft/v0/run-script-options.schema.json) |
<!-- prettier-ignore-end -->

This plugin allows a Heft task to execute an arbitrary JavaScript file which can perform similar actions as a Heft task plugin.

## When to use it

**This plugin is generally NOT recommended.** If you need to perform custom operations during a Heft build, the
best practice is to create a proper Heft plugin package. Doing so ensures that your code is professionally developed
with TypeScript and ESLint validation, and therefore easier to maintain. The `run-script-plugin` should only be
used for experimentation or small bits of code to solve one-off problems.

## package.json dependencies

None - this feature is built-in to `@rushstack/heft`.

## Configuration

The `run-script-plugin` is a built-in plugin loaded directly from `@rushstack/heft`.
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
            "pluginName": "run-script-plugin",
            "pluginPackage": "@rushstack/heft",

            // --------------------------------------------------------------
            // EXAMPLE OPTIONS FOR run-script-plugin
            "options": {
              "scriptPath": "lib/scripts/generate-version-file.js"
            }
            // --------------------------------------------------------------
          }
        }
      }
    }
  }
}
```

The `"scriptPath"` should refer to a Node.js module that will be loaded using `await import(scriptPath)`,
resolved relative to the project folder. The script should export a function named `runAsync()`
that will be invoked when the task is run. The function receives a single `options` parameter with this
type:

```js
export interface IRunScriptOptions {
  /**
   * The Heft session context, the same as for heft plugins.
   */
  heftTaskSession: IHeftTaskSession;

  /**
   * The Heft configuration.
   */
  heftConfiguration: HeftConfiguration;

  /**
   * If your script performs a long-running task, it must periodically check
   * this `cancellationToken` so that Heft can gracefully abort the operation.
   */
  runOptions: IHeftTaskRunHookOptions;

  /**
   * The user-defined `scriptOptions` that can optionally be specified in **heft.json**.
   */
  scriptOptions: Record<string, unknown>;
}
```

Here is a sample implementation of the `runAsync()` function:

<Tabs>
  <TabItem value="ts" label="TypeScript">

```ts
import type { IRunScriptOptions } from '@rushstack/heft';

export async function runAsync(options: IRunScriptOptions): Promise<void> {
  // If your script performs a long-running task, it must periodically check
  // options.runOptions.cancellationToken so that Heft can gracefully abort the operation.
  options.heftTaskSession.logger.terminal.writeLine('Hello, world!');
}
```

  </TabItem>
  <TabItem value="js" label="JavaScript">

```js
module.exports = {
  runAsync: async (options) => {
    // If your script performs a long-running task, it must periodically check
    // options.runOptions.cancellationToken so that Heft can gracefully abort the operation.
    options.heftTaskSession.logger.terminal.writeLine('Hello, world!');
  }
};
```

  </TabItem>
</Tabs>

## heft.json plugin options

This commented template documents the available options. In the above example, it would get
pasted between the `------` bars.

```ts
// EXAMPLE OPTIONS FOR run-script-plugin
// JSON Schema: https://developer.microsoft.com/json-schemas/heft/v0/run-script-options.schema.json
"options": {

  /**
   * (REQUIRED) Path to the script that will be run, relative to the project root.
   */
  "scriptPath": "path/to/your/script",

  /**
   * User-defined JSON values that will be passed to the script at runtime.
   */
  // "scriptOptions": {
  //   "option1": "value"
  // }
}
```
