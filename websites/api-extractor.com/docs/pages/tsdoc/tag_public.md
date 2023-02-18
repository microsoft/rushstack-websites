---
layout: page
title: '@public'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [discretionary](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@public` modifier is one of the four **release tags**.  It indicates that an API item has been officially
released, and is now part of the supported contract for a package.  If the [SemVer](https://semver.org/) versioning
scheme is used, then the API signature cannot be changed without a MAJOR version increment.

**Usage example:**

```ts
/**
 * This is some example documentation.
 * @public
 */
export function doSomething(): void { }
```

## See also

- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
- [The .d.ts rollup]({% link pages/overview/demo_rollup.md %})
