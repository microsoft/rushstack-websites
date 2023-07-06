---
title: rig.json
---

|                                           |                                            |
| ----------------------------------------- | ------------------------------------------ |
| **File path:**                            | **&lt;project folder&gt;/config/rig.json** |
| [**Riggable?**](../intro/rig_packages.md) | No                                         |
| **Associated plugins:**                   |                                            |

## Template

```js
// The "rig.json" file directs tools to look for their config files in an external package.
// Documentation for this system: https://www.npmjs.com/package/@rushstack/rig-package
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  /**
   * (Required) The name of the rig package to inherit from.
   * It should be an NPM package name with the "-rig" suffix.
   */
  "rigPackageName": "example-rig",
  /**
   * (Optional) Selects a config profile from the rig package.  The name must consist of
   * lowercase alphanumeric words separated by hyphens, for example "sample-profile".
   * If omitted, then the "default" profile will be used."
   */
  "rigProfile": "web-library"
}
```

## See also

- [Using rig packages](../intro/rig_packages.md) with Heft
- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) documentation
