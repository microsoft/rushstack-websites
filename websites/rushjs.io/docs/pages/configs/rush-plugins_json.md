---
title: rush-plugins.json (experimental)
---

This is the template for the **rush-plugins.json** file that is used to enable
[Rush plugins](../maintainer/using_rush_plugins).

**common/config/rush/command-line.json**

```js
/**
 * This configuration file manages Rush's plugin feature.
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-plugins.schema.json",
  "plugins": [
    /**
     * Each item defines a plugin to be loaded by Rush.
     */
    // {
    //   /**
    //    * The name of the NPM package that provides the plugin.
    //    */
    //   "packageName": "@scope/my-rush-plugin",
    //
    //   /**
    //    * The name of the plugin.  This can be found in the "pluginName"
    //    * field of the "rush-plugin-manifest.json" file in the NPM package folder.
    //    */
    //   "pluginName": "my-plugin-name",
    //
    //   /**
    //    * The name of a Rush autoinstaller that will be used for installation, which
    //    * can be created using "rush init-autoinstaller".  Add the plugin's NPM package
    //    * to the package.json "dependencies" of your autoinstaller, then run
    //    * "rush update-autoinstaller".
    //    */
    //   "autoinstallerName": "rush-plugins"
    // }
  ]
}
```

## See also

- [Using Rush plugins](../maintainer/using_rush_plugins)
- [Creating a Rush plugin](../extensibility/creating_plugins)
