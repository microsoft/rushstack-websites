---
title: Declaration references
---

Certain tags such as `{@inheritdoc}` and `{@link}` can refer to other API items such as classes, member functions,
enum values, etc. The referenced item may be local, or it may be imported from an external NPM package.
It could be part of a merged declaration or an overloaded function.

The TSDoc syntax provides a special "**declaration reference**" notation for unambiguously identifying declarations
in all these situations. (This aspect of TSDoc is still evolving; it is tracked by
[RFC #9](https://github.com/microsoft/tsdoc/issues/9). The current spec is outlined in
[code-snippets/DeclarationReferences.ts](https://github.com/microsoft/tsdoc/blob/main/spec/code-snippets/DeclarationReferences.ts).)

## Syntax Examples

Below are syntax examples that should help you get started writing declaration references.

### A simple local declaration

```ts
/** @public */
export class Widget {
  /**
   * Call this before calling the {@link Widget.render | the render() method}.
   */
  public initialize(): void {}

  public render(): void {}
}
```

To refer to a declaration in the same project, simply use its name, with a "." to scope any nested members.
In the above example, `Widget.render` refers to the `render` method of the `Widget` class. As long as the match
is unambiguous, it doesn't matter whether the member is `static` or not.

> TSDoc declaration references are always resolved relative to a specific entry point (NOT relative to the current
> source file or declaration scope). Thus, their syntax is independent of where the reference occurs within
> a given package. Since `Widget.initialize` appears inside `Widget`, we may want to shorten the reference to
> `{@link render | the render() method}`, but TSDoc standard does not support this.

### An imported declaration

```ts
import { Widget } from '@my-org/widget-lib';

/**
 * Returns a new instance of the {@link @my-org/widget-lib#Widget} class.
 * @public
 */
export function createWidget(): Widget {
  . . .
}
```

To refer to a declaration that is imported from an NPM package, specify the package name followed by a `#`
character (e.g. `widget-lib#Widget`). If the package name has an NPM scope, it can be included
as well (e.g. `@my-org/widget-lib#Widget`).

### An entire package

```ts
import { Button } from 'controls';

/**
 * Constructs a `Button` as defined by the {@link controls#} library.
 * @public
 */
export function createButton(): Button {
  . . .
}
```

To refer to the entire package (rather than a particular export), simply omit the member name as shown above.
You must include the `#` character, however, since otherwise `controls` looks like a reference to a declaration
with that name.

### A merged declaration

```ts
/** @public */
export enum ShirtSize {
  Small,
  Medium,
  Large
}

/** @public */
export namespace ShirtSize {
  /**
   * Parses a string and returns an instance of the
   * {@link (ShirtSize:enum)} enum.
   */
  export function parseName(name: string): ShirtSize {
    switch (name) {
      case 'S':
        return ShirtSize.Small;
      case 'M':
        return ShirtSize.Small;
      case 'L':
        return ShirtSize.Large;
    }
    throw new Error('Invalid size');
  }
}
```

In the above example, the symbol `ShirtSize` is both an enum and a namespace. If we simply wrote `{@link ShirtSize}`
then API Extractor would report a warning like this:

```
Warning: (ae-unresolved-link) The @link reference could not be resolved:
The reference is ambiguous because "ShirtSize" has more than one declaration;
you need to add a TSDoc member reference selector
```

The `(ShirtSize:enum)` notation uses a TSDoc system selector to clarify that we're talking about the enum,
not the namespace.

## Unsupported Features

API Extractor supports all the core features of TSDoc declaration references, but does not yet
support some advanced features that are described in the spec:

- Index selectors
- Label selectors
- References using ECMAScript symbols instead of identifiers
- Import paths

These features may be implemented in the future. If you'd like to contribute, take a look at the code in
[AstReferenceResolver.ts](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/analyzer/AstReferenceResolver.ts)
and [ModelReferenceResolver.ts](https://github.com/microsoft/rushstack/blob/main/libraries/api-extractor-model/src/model/ModelReferenceResolver.ts).
