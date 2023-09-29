---
title: custom-tips.json (experimental)
---

This is the template that [rush init](../commands/rush_init.md)
generates for the [Custom tips](../maintainer/custom_tips.md) feature.

**common/config/rush/custom-tips.json**

```js
/**
 * This configuration file allows repo maintainers to configure extra details to be
 * printed alongside certain Rush messages.  More documentation is available on the
 * Rush website: https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/custom-tips.schema.json",

  /**
   * Specifies the custom tips to be displayed by Rush.
   */
  "customTips": [
    // {
    //   /**
    //    * (REQUIRED) An identifier indicating a message that may be printed by Rush.
    //    * If that message is printed, then this custom tip will be shown.
    //    * Consult the Rush documentation for the current list of possible identifiers.
    //    */
    //   "tipId": "TIP_RUSH_INCONSISTENT_VERSIONS",
    //
    //   /**
    //    * (REQUIRED) The message text to be displayed for this tip.
    //    */
    //   "message": "For additional troubleshooting information, refer this wiki article:\n\nhttps://intranet.contoso.com/docs/pnpm-mismatch"
    // }
  ]
}
```

## See also

- [Custom tips](../maintainer/custom_tips.md)
