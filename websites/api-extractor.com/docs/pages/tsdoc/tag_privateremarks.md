---
layout: page
title: '@privateRemarks'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [core](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@privateRemarks` tag designates additional documentation content that is not intended for a public audience.
Being a block tag, `@privateRemarks` introduces a TSDoc section that contains all comment text up until the
next block tag.

API Extractor will omit any private remarks blocks from the \*.api.json model file, and thus they will not appear
in the generated documentation.

**Usage example:**

```ts
/**
 * The base class for all widgets.
 *
 * @remarks
 * All widget implementations should inherit from this class.
 *
 * @privateRemarks
 * Before making changes to this class, please consult these internal guidelines:
 *
 * http://contoso-intranet/wiki/WidgetDesignPractices/
 *
 * @public
 */
export class BaseWidget {
  . . .
}
```

## See also

- [@remarks tag]({% link pages/tsdoc/tag_remarks.md %})
