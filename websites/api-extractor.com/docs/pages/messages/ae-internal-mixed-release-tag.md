---
title: ae-internal-mixed-release-tag
---

_"Mixed release tags are not allowed for \_\_\_ because one of its declarations is marked as @internal."_

## Remarks

For a function that has multiple overloads, you can specify different release tags for each overload.
For example:

```ts
/**
 * Combines two values, by adding the numbers.
 * @public
 */
export function combine(x: number, y: number): number;

/**
 * Combines two values, by appending the strings.
 * @beta
 */
export function combine(x: string, y: string): string;

export function combine(x: number | string, y: number | string): number | string {
  return x + y;
}
```

However, this is not allowed if one of the overloads is marked as `@internal`.

## How to fix

Create a separate function for the internal API.

Alternatively, you can disable the `ae-internal-mixed-release-tag`
validation by adding a section like this to your **api-extractor.json** file:

```js
  "messages": {
    "extractorMessageReporting": {
      "ae-internal-mixed-release-tag": {
        "logLevel": "none"
      }
    }
  }
```

## See also

- [api-extractor.json config file]({% link pages/configs/api-extractor_json.md %}#message-reporting-section)
- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
