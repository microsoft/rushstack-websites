---
layout: page
title: '@beta'
navigation_source: docs_nav
---

| Standardization: | [Discretionary]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Modifier]({% link pages/spec/tag_kinds.md %}) |
| Synonyms: | [@experimental]({% link pages/tags/experimental.md %}) |

## Suggested meaning

Designates that an API item's release stage is "beta". It has been released to third-party developers experimentally
for the purpose of collecting feedback. The API should not be used in production, because its contract may
change without notice. The tooling may trim the declaration from a public release, but may include it in a
developer preview release.

## Example

```ts
/**
 * Represents a book in the catalog.
 * @public
 */
export class Book {
  /**
   * The title of the book.
   * @beta
   */
  public get title(): string;

  /**
   * The author of the book.
   */
  public get author(): string;
}
```

In this example, `Book.author` inherits its `@public` designation from the containing class,
whereas `Book.title` is marked as "beta".

## See also

- [@alpha]({% link pages/tags/alpha.md %}) tag
- [@experimental]({% link pages/tags/experimental.md %}) tag
- [@internal]({% link pages/tags/internal.md %}) tag
- [@public]({% link pages/tags/public.md %}) tag
- [Trimming based on release tags](https://api-extractor.com/pages/setup/configure_rollup/#trimming-based-on-release-tags):
  a reference implementation of this feature
