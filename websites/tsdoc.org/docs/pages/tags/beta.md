---
title: '@beta'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Discretionary](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |
| Synonyms: | [@experimental](../tags/experimental.md) |
<!-- prettier-ignore-end -->

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

- [@alpha](../tags/alpha.md) tag
- [@experimental](../tags/experimental.md) tag
- [@internal](../tags/internal.md) tag
- [@public](../tags/public.md) tag
- [Trimming based on release tags](https://api-extractor.com/pages/setup/configure_rollup/#trimming-based-on-release-tags):
  a reference implementation of this feature
