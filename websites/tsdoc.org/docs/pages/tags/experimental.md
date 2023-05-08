---
title: '@experimental'
---

| Standardization: | [Discretionary](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |
| Synonyms: | [@beta](../tags/beta.md) |

## Suggested meaning

Same semantics as `@beta`, but used by tools that don't support an `@alpha` release stage.

## Example

```ts
/**
 * Represents a book in the catalog.
 * @public
 */
export class Book {
  /**
   * The title of the book.
   * @experimental
   */
  public get title(): string;

  /**
   * The author of the book.
   */
  public get author(): string;
}
```

In this example, `Book.author` inherits its `@public` designation from the containing class,
whereas `Book.title` is marked as "experimental".

## See also

- [@alpha](../tags/alpha.md) tag
- [@beta](../tags/beta.md) tag
- [@public](../tags/public.md) tag
- [@internal](../tags/internal.md) tag
