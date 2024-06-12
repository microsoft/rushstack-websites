---
title: Creating Rush plugins (experimental)
---

Rush plugins enable repository maintainers to:

- Share common Rush configuration across multiple monorepos
- Extend Rush's base functionality with custom features
- Prototype new feature ideas before officially contributing them to Rush

## Creating a plugin package

A **plugin package** is an NPM package that provides one or more **Rush plugins**.
The plugins are described by a **plugin manifest** file. This file is always named
[rush-plugin-manifest.json](../configs/rush-plugin-manifest_json.md)
and found in same folder as the **package.json** file.

## Common extensibility scenarios

### Defining a Rush custom command

A plugin can define new commands and parameters that extend Rush's command-line,
using the same **command-line.json** file format that is used to implement
[Rush custom commands](../maintainer/custom_commands.md).

Here's an example:

**rush-example-plugin/rush-plugin-manifest.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-plugin-manifest.schema.json",
  "plugins": [
    {
      "pluginName": "check-readme",

      "description": "Adds a custom command \"rush check-readme\" that validates each project's README.md",

      /**
       * (Optional) A path to a "command-line.json" file that defines Rush command line actions
       * and parameters contributed by this plugin.  This config file has the same JSON schema
       * as Rush's "common/config/rush/command-line.json" file.
       */
      "commandLineJsonFilePath": "./command-line.json"
    }
  ]
}
```

**rush-example-plugin/command-line.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/command-line.schema.json",
  "commands": [
    {
      "name": "check-readme",
      "commandKind": "bulk",
      "summary": "Validates a project's README.md to make sure it conforms to company policy",
      "shellCommand": "node <packageFolder>/lib/start.js",
      "safeForSimultaneousRushProcesses": true
    }
  ]
}
```

Example project for this scenario:
[rush-sort-package-json](https://github.com/bytesfriends/rush-plugins/tree/main/rush-plugins/rush-sort-package-json) from **bytesfriends**

### Loading a code module

A plugin can use the [@rushstack/rush-sdk](https://www.npmjs.com/package/@rushstack/rush-sdk) APIs
to register handlers for Rush events and services. This is specified using the `entryPoint` setting
in the plugin manifest:

**rush-example-plugin/rush-plugin-manifest.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-plugin-manifest.schema.json",
  "plugins": [
    {
      "pluginName": "check-readme",
      "description": "Adds a custom command \"rush check-readme\" that validates each project's README.md",

      /**
       * (Optional) A path to a JavaScript code module that implements the "IRushPlugin" interface.
       * This module can use the "@rushstack/rush-sdk" API to register handlers for Rush events
       * and services.  The module path is relative to the folder containing the "package.json" file.
       */
      "entryPoint": "lib/RushExamplePlugin.js"
    }
  ]
}
```

The plugin module should have a `default` export that is an implementation of the
[IRushPlugin](https://api.rushstack.io/pages/rush-lib.irushplugin/) interface.

For example:

**rush-example-plugin/src/RushExamplePlugin.ts**

```ts
import type { IRushPlugin, RushSession, RushConfiguration } from '@rushstack/rush-sdk';

export interface IRushExamplePluginOptions {}

export class RushExamplePlugin implements IRushPlugin {
  public readonly pluginName: string = 'RushExamplePlugin';

  public constructor(options: IRushExamplePluginOptions) {
    // Add your initialization here
  }

  public apply(rushSession: RushSession, rushConfiguration: RushConfiguration): void {
    rushSession.hooks.initialize.tap(this.pluginName, () => {
      const logger: ILogger = rushSession.getLogger(this.pluginName);
      logger.terminal.writeLine('Add your custom logic here');
    });
  }
}

export default { RushExamplePlugin };
```

The [RushSession.hooks](https://api.rushstack.io/pages/rush-lib.rushsession/) API exposes various
[lifecycle hooks](https://api.rushstack.io/pages/rush-lib.rushlifecyclehooks/) that your plugin can
use to register its handlers. The hook system is based on the popular
[tapable](https://www.npmjs.com/package/tapable) framework familiar from Webpack.

Example project for this scenario:
[@rushstack/rush-amazon-s3-build-cache-plugin](https://github.com/microsoft/rushstack/blob/main/rush-plugins/rush-amazon-s3-build-cache-plugin)

> **Note:** If your code module is only used with certain Rush commands,
> use the `"associatedCommands"` setting to improve performance by
> avoiding loading the module when it is not needed.

### Defining a config file for your plugin

Often a plugin will need to be configured using its own custom settings. Rush's convention
is that the plugin's config file should be stored in the folder **common/config/rush-plugins**
with the same filename as the `"pluginName"` field from the manifest.

Here's a complete example of this naming pattern:

| Plugin component                                 | Example naming pattern                                        |
| :----------------------------------------------- | :------------------------------------------------------------ |
| NPM package name:                                | `@your-company/rush-policy-plugins`                           |
| `"pluginName"` in **rush-plugin-manifest.json**: | `"email-policy"`                                              |
| end user config file:                            | **&lt;repo&gt;/common/config/rush-plugins/email-policy.json** |
| config file JSON schema:                         | **src/schemas/email-policy.schema.json**                      |
| code module:                                     | **src/RushEmailPolicyPlugin.ts**                              |

To enable Rush's automatic validation of your plugin's config file, specify the `optionsSchema`
setting in your plugin manifest:

**rush-policy-plugins/rush-plugin-manifest.json**

```js
    . . .
    /**
     * (Optional) A path to a JSON schema for validating the config file that end users can
     * create to customize this plugin's behavior.  Plugin config files are stored in the folder
     * "common/config/rush-plugins/" with a filename corresponding to the "pluginName" field
     * from the manifest.  For example: "common/config/rush-plugins/business-policy.json"
     * whose schema is "business-policy.schema.json".
     */
    "optionsSchema": "lib/schemas/email-policy.schema.json",
    . . .
```

## See also

- [Using Rush plugins](../maintainer/using_rush_plugins.md)
- [rush-plugin-manifest.json](../configs/rush-plugin-manifest_json.md) config file documentation
- [command-line.json](../configs/command-line_json.md)
- [Rush custom commands](../maintainer/custom_commands.md)
