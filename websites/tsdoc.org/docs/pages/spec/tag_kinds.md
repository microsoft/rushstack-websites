---
title: Tag kinds
---

TSDoc distinguishes three kinds of tags: Block tags, modifier tags, and inline tags.

Tag names start with an at-sign (`@`) followed by ASCII letters using "camelCase" capitalization.

A tag is defined to have exactly one of these three forms. For example, the `@link` tag must
not be written as a block tag because it is defined to be an inline tag.

## Block tags

Block tags should always appear as the first element on a line. In normalized form, a block tag
should be the only element on its line, except for certain tags that assign special meaning to
the first line of text. For example, the [@example](../tags/example.md) and
[@throws](../tags/throws.md) tags interpret their first line as a section title.

All text following a block tag, up until the start of the next block tag or modifier tag, is
considered to be the block tag's **tag content**. The content may include Markdown elements and
inline tags. Any content appearing prior to the first block tag is interpreted as the special
"summary" section.

**Examples of block tags:**

````ts
/**
 * This is the special summary section.
 *
 * @remarks
 * This is a standalone block.
 *
 * @example Logging a warning
 * ```ts
 * logger.warn('Something happened');
 * ```
 *
 * @example Logging an error
 * ```ts
 * logger.error('Something happened');
 * ```
 */
````

## Modifier tags

Modifier tags indicate a special quality of an API. Modifier tags are generally parsed the same as block tags,
with the expectation that their tag content is empty. If tag content is found after a modifier tag, a parser
may choose to discard it, or (in situations where it improves compatibility) to associate it with the previous
block tag.

In normalized form, the modifier tags appear on a single line at the bottom of the doc comment.

**Examples of modifier tags:**

```ts
/**
 * This is the special summary section.
 *
 * @remarks
 * This is a standalone block.
 *
 * @public @sealed
 */
```

In the above example, `@public` and `@sealed` are modifier tags.

## Inline tags

Inline tags appear as content elements along with Markdown expressions. Inline tags are always surrounded
by `{` and `}` characters. The `@link` and `@inheritDoc` tags are examples of inline tags.

**Examples of inline tags:**

```ts
class Book {
  /**
   * Writes the book information into a JSON file.
   *
   * @remarks
   * This method saves the book information to a JSON file conforming to the standardized
   * {@link http://example.com/ | Example Book Interchange Format}.
   */
  public writeFile(options?: IWriteFileOptions): void {
    . . .
  }

  /**
   * {@inheritDoc Book.writeFile}
   * @deprecated Use {@link Book.writeFile} instead.
   */
  public save(): void {
    . . .
  }
}
```

## See also

- [RFC #21](https://github.com/microsoft/tsdoc/issues/21): Support for custom TSDoc tags
