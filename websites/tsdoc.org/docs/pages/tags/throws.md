---
title: '@throws'
---

| Standardization: | [Extended]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Block tag]({% link pages/spec/tag_kinds.md %}) |

## Usage

Used to document an exception type that may be thrown by a function or property.

A separate `@throws` block should be used to document each exception type. This tag is for informational
purposes only, and does not restrict other types from being thrown. It is suggested, but not required,
for the `@throws` block to start with a line containing only the name of the exception.

For example:

```ts
/**
 * Retrieves metadata about a book from the catalog.
 *
 * @param isbnCode - the ISBN number for the book
 * @returns the retrieved book object
 *
 * @throws {@link IsbnSyntaxError}
 * This exception is thrown if the input is not a valid ISBN number.
 *
 * @throws {@link book-lib#BookNotFoundError}
 * Thrown if the ISBN number is valid, but no such book exists in the catalog.
 *
 * @public
 */
function fetchBookByIsbn(isbnCode: string): Book;
```

## See also

- [RFC 171](https://github.com/microsoft/tsdoc/issues/171): `@throws` tag for documenting exceptions
