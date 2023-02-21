---
title: ae-extra-release-tag
---

_"The doc comment should not contain more than one release tag."_

## Remarks

These TSDoc modifiers are called "release tags":

- `@public`
- `@beta`
- `@alpha`
- `@internal`

A documentation comment should contain at most one release tag.

Example:

```ts
/**
 * @public @public
 */
export function f1(): void {}

// Warning: The doc comment should not contain more than one release tag.
```

In the example above, the `@public` release tag appears twice, so the error is reported.

## How to fix

Remove the extra release tags.

## See also

- [Doc comment syntax: Release tags](../tsdoc/doc_comment_syntax.md#release-tags)
