---
layout: page
title: ae-setter-with-docs
navigation_source: docs_nav
---

*"The doc comment for the property ___ must appear on the getter, not the setter."*

## Remarks

API Extractor models a property getter/setter pair as a single API item.  The getter is the main declaration,
and the setter is treated as an "ancillary" signature.  Only the getter can have a doc comment.  If a doc comment
is found on the setter, then API Extractor reports the `ae-setter-with-docs` error.

Example:

```ts
/**
 * Represents a book from the catalog.
 * @public
 */
export class Book {
  private _title: string = "untitled";

  /**
   * Gets the title of the book.
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Sets the title of the book.
   */
  // Error: (ae-setter-with-docs) The doc comment for the property "title" must appear
  // on the getter, not the setter.
  public set title(value: string) {
    this._title = value;
  }
}
```

## How to fix

Remove the doc comment from the setter.  Describe both options in the getter's doc comment:

```ts
/**
 * Represents a book from the catalog.
 * @public
 */
export class Book {
  private _title: string = "untitled";

  /**
   * Gets or sets the title of the book.
   */
  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }
}
```

## See also

- [ae-missing-getter]({% link pages/messages/ae-missing-getter.md %})
