---
title: '@internal'
---

| Standardization: | [Discretionary](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |

## Suggested meaning

Designates that an API item is not planned to be used by third-party developers. The tooling may trim the
declaration from a public release. In some implementations, certain designated packages may be allowed to
consume internal API items, e.g. because the packages are components of the same product.

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

- [@alpha](../tags/alpha.md) tag
- [@beta](../tags/beta.md) tag
- [@experimental](../tags/experimental.md) tag
- [@public](../tags/public.md) tag
- [Trimming based on release tags](https://api-extractor.com/pages/setup/configure_rollup/#trimming-based-on-release-tags):
  a reference implementation of this feature
