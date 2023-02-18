---
layout: page
title: '@alpha'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [discretionary](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@alpha` modifier is one of the four **release tags**.  It indicates that an API item is eventually intended
to be public, but currently is in an early stage of development.  Third parties should not use "alpha" APIs.

**Usage example:**

```ts
/**
 * This is some example documentation.
 * @alpha
 */
export function doSomething(): void { }
```

## See also

- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
- [The .d.ts rollup]({% link pages/overview/demo_rollup.md %})
