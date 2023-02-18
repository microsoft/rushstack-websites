---
layout: page
title: ae-unresolved-inheritdoc-reference
navigation_source: docs_nav
---

*"The @inheritDoc reference could not be resolved."*

## Remarks

This occurs when the TSDoc declaration reference cannot be resolved.  For example:

```ts
/**
 * Some documentation that we want to inherit
 */
export function f1(): void {
}

/** {@inheritDoc g1} */   // <-- we misspelled "f1"
export function f2(): void {
}

// Warning: The @inheritDoc reference could not be resolved:
// The package does not have an export "g1".
```

## How to fix

Correct the reference.  In the above example, we would change the comment for `f2()` to this:

```ts
/** {@inheritDoc f1} */
export function f2(): void {
}
```

## See also

- [@inheritDoc tag]({% link pages/tsdoc/tag_inheritdoc.md %})
