---
layout: page
title: '@public'
navigation_source: docs_nav
---

| Standardization: | [Discretionary]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Modifier]({% link pages/spec/tag_kinds.md %}) |

## Suggested meaning

Designates that an API item's release stage is "public". It has been officially released to third-party developers,
and its signature is guaranteed to be stable (e.g. following Semantic Versioning rules).

## Example

```ts
/**
 * Represents a book in the catalog.
 * @public
 */
export class Book {
  /**
   * The title of the book.
   * @internal
   */
  public get _title(): string;

  /**
   * The author of the book.
   */
  public get author(): string;
}
```

In this example, `Book.author` inherits its `@public` designation from the containing class,
whereas `Book._title` is marked as "internal".

## See also

- [@alpha]({% link pages/tags/alpha.md %}) tag
- [@beta]({% link pages/tags/beta.md %}) tag
- [@experimental]({% link pages/tags/experimental.md %}) tag
- [@internal]({% link pages/tags/internal.md %}) tag
- [Trimming based on release tags](https://api-extractor.com/pages/setup/configure_rollup/#trimming-based-on-release-tags):
  a reference implementation of this feature
