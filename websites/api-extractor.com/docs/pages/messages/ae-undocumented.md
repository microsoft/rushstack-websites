---
title: ae-undocumented
---

_"Missing documentation for \_\_\_."_

## Remarks

This message is reported when an exported API item does not have a TSDoc doc comment. This helps ensure
that every public API has proper documentation.

The `ae-undocumented` message is only generated if the API report feature is enabled
(`apiReport.enabled` is `true`).

Because the API report file already annotates undocumented items with `// (undocumented)`,
the `ae-undocumented` message is not logged by default (its default `logLevel` is `"none"`).

## How to fix

Add a TSDoc doc comment to the declaration. For example:

```ts
/**
 * Represents the application state.
 * @public
 */
export interface IAppState {
  /**
   * The current user name.
   */
  userName: string;
}
```

If you want to see these warnings during your build, add a section like this to your
**api-extractor.json** file:

```js
  "messages": {
    "extractorMessageReporting": {
      "ae-undocumented": {
        "logLevel": "warning"
      }
    }
  }
```

To add the messages to your API report file for tracking purposes instead:

```js
  "messages": {
    "extractorMessageReporting": {
      "ae-undocumented": {
        "logLevel": "warning",
        "addToApiReportFile": true
      }
    }
  }
```

## See also

- [api-extractor.json config file](../configs/api-extractor_json.md#message-reporting-section)
- [Doc comment syntax](../tsdoc/doc_comment_syntax.md)
