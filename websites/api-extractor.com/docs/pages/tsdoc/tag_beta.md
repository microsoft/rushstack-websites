---
layout: page
title: '@beta'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [discretionary](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@beta` modifier is one of the four **release tags**.  It indicates that an API item has been released
as a preview or for experimental purposes.  Third parties are encouraged to try it and provide feedback.  However,
a "beta" API should NOT be used in production, because it may be changed or removed in a future version.

**Usage example:**

```ts
/**
 * This is some example documentation.
 * @beta
 */
export function doSomething(): void { }
```

## See also

- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
- [The .d.ts rollup]({% link pages/overview/demo_rollup.md %})
