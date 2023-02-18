---
title: ae-missing-getter
---

_"The property \_\_\_ has a setter but no getter."_

## Remarks

TypeScript properties are conventionally used to indicate an API that behaves similar to reading or writing a variable.
For example, style guides often recommend:

- property getters shouldn't perform expensive/complex operations
- property getters shouldn't cause observable side-effects (e.g. reading the property moves a stream pointer forwards)
- property getters should avoid throwing exceptions

In the same way, it would be strange to declare a property getter without a setter. After assigning a value
to a variable, intuitively a developer would expect to be able to read the assigned value.

Consider this example:

```ts
/**
 * Represents a book from the catalog.
 * @public
 */
export class Book {
  private _title: string = 'untitled';

  /**
   * Sets the title of the book.
   */
  // Error: (ae-missing-getter) The property "title" has a setter but no getter.
  public set title(value: string) {
    this._title = value;
  }
}

const book: Book = new Book();
book.title = 'The Hobbit';
console.log('The title: ' + book.title); // prints "The title: undefined"
```

The above behavior is counterintuitive. The missing setter is likely a mistake in the API design.
API Extractor reports the `ae-missing-getter` error.

## How to fix

The simplest solution is to implement the missing property getter. Note that the getter's documentation describes
both operations; a property setter cannot have a doc comment:

```ts
/**
 * Represents a book from the catalog.
 * @public
 */
export class Book {
  private _title: string = 'untitled';

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

const book: Book = new Book();
book.title = 'The Hobbit';
console.log('Title: ' + book.title); // prints "Title: The Hobbit"
```

Alternatively, if your API really needs to be a unidirectional operation, you should design it as a method instead
of a property:

```ts
/**
 * Represents a book from the catalog.
 * @public
 */
export class Book {
  private _title: string = 'untitled';

  /**
   * Sets the title of the book.
   */
  public setTitle(title: string): void {
    this._title = title;
  }
}
```

> **A pitfall involving "inherited" getters**
>
> If you choose to disable the `ae-missing-getter` validation, be careful with inherited properties:
> If a child class overrides a property by specifying the setter only, the getter will become undefined.
> Unlike some other languages, ECMAScript `get` and `set` attributes comprise a single
> [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type)
> that is being overridden.
> See [this playground link](https://www.typescriptlang.org/play?#code/PQKhCgAIUglBTADgJ3gZ3gOwC5sgQ0kXmTQHtMA6KGAAUQFcAjAGwEsBjG4cDl-NHgAKJcpkgBvKJBkoy2eBwUATSAH1M+ALbxIAXkgByQwG5w0maAgybMAOLxckbAAtdmnZDIAzZ26KiFNQ2MiA8IQDmjpAe8AAUAJQAXJBo2MhsmBGSFiGQqNgMyOKubGiUGtrwZiEAvuD14FY0cEioGDh4+OLwWogsZACe8PDBdIysnGM8fAJ4AKJ9A8O68AAeCpjKwoHiUiHNeTAAyo54ru5VXr4XAaRBudDhNsDAkPPIyGTIKXH48ABaLRlNCZCIAqLYBTIBKQAAq-jkxGQ2EGkAARNg2NgWPB0ZAXAICKlHNDIEwGNgYmRIJDocEXm8EWVICQvshICz1sQlPBlJRIAADRb9IYjQWQADubBYLGpVMybgyVNudJIkG8Xy0QpE90wgoZljep10t0FHAo5FxlAGEQlTHgA0lhpJVNicQAbvgWAx4Ck0hksrD9nkZKVypVPAYvT7qrl6o0LZg0qylmLdAZMPBJe80ytEmZeqKVpRYvojABBdgceCmXiWsjW21xIvLEalqoJEyQV6QAAyZAieEFDC28G8mT5BqAA) for an example.

## See also

- [ae-setter-with-docs message](../messages/ae-setter-with-docs.md)
