---
layout: page
title: '@deprecated'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [core](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@deprecated` tag indicates that an API item is no longer supported and may be removed in a future release.
It should be followed by a sentence describing the recommended alternative. (This is optional in JSDoc,
but required in AEDoc.)  The `@deprecated` tag can be combined with any release tag
(`@internal`, `@alpha`, `@beta`, or `@public`).  It recursively applies to members of the container,
e.g. if a class is deprecated, then so are all of its members.

**Usage example:**

```ts
/**
 * The base class for all graphical components.
 *
 * @deprecated The BaseWidget class has been superceded by the BaseControl class.
 * @public
 */
export class BaseWidget {
  ...
}
```

## See also

- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)

