---
title: '@public'
---

| Standardization: | [Discretionary](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |

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

- [@alpha](../tags/alpha.md) tag
- [@beta](../tags/beta.md) tag
- [@experimental](../tags/experimental.md) tag
- [@internal](../tags/internal.md) tag
- [Trimming based on release tags](https://api-extractor.com/pages/setup/configure_rollup/#trimming-based-on-release-tags):
  a reference implementation of this feature
