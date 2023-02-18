---
layout: page
title: ae-different-release-tags
navigation_source: docs_nav
---

*"This symbol has another declaration with a different release tag."*

## Remarks

In the TypeScript language, a symbol can have multiple declarations.  They are called "merged declarations"
because they describe the same underlying JavaScript object.  The `ae-different-release-tags` is reported when
merged declarations have different release tags.

Example:

```ts
/** @public */
interface Size {
  width: number;
  height: number;
}

/** @beta */
function Size(width: number, height: number): Size {
  return { width, height };
}

// Warning: This symbol has another declaration with a different release tag.
```

In the example above, the `Size` symbol has an interface declaration that is marked as `@public`, but a function
declaration that is marked as `@beta`, so the `ae-different-release-tags` error is reported.

Note that mixed release tags are allowed for overloads of a function or method. For example:
```ts
/**
 * Combines two values, by adding the numbers.
 * @public
 */
export function combine(x: number, y: number): number;

/**
 * Combines two values, by appending the strings.
 * @beta
 */
export function combine(x: string, y: string): string;

export function combine(x: number | string, y: number | string): number | string {
  return x + y;
}
```

> It would be possible for API Extractor to allow different release tags for other types of declarations.
> GitHub [issue #972](https://github.com/microsoft/rushstack/issues/972)
> proposes this enhancement and discusses some of the challenges involved.

## How to fix

Change the symbol's declarations to have the same release tag.

## See also

- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
