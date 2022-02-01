---
title: rush-plugin-manifest.json (experimental)
---

This is the template for the **rush-plugin-manifest.json** file that is used when
[creating a Rush plugin](../advanced/creating_plugins.md).

**&lt;your plugin project&gt;/rush-plugin-manifest.json**

```js
/**
 * This file defines the Rush plugins that are provided by this package.
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-plugin-manifest.schema.json",

  /**
   * An array of one or more plugin definitions.
   */
  "plugins": [
    {
      /**
       * The name of the plugin.
       */
      "pluginName": "rush-init-project-plugin",
      "description": "Rush plugin for initialize project in monorepo",
      "commandLineJsonFilePath": "command-line.json"
    }
  ]
}
```

## See also

- [Creating a Rush plugin](../advanced/creating_plugins.md)
