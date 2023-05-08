---
title: '@experimental'
---

| Standardization: | [Discretionary]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Modifier]({% link pages/spec/tag_kinds.md %}) |
| Synonyms: | [@beta]({% link pages/tags/beta.md %}) |

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

- [@alpha]({% link pages/tags/alpha.md %}) tag
- [@beta]({% link pages/tags/beta.md %}) tag
- [@public]({% link pages/tags/public.md %}) tag
- [@internal]({% link pages/tags/internal.md %}) tag
