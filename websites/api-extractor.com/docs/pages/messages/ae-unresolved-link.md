---
layout: page
title: ae-unresolved-link
navigation_source: docs_nav
---

*"The @link reference could not be resolved."*

## Remarks

This occurs when the TSDoc declaration reference cannot be resolved.

For example, suppose that we mistyped `f1` as `g1` in this example:

```ts
/**
 * Some documentation that we want to inherit
 */
export function f1(): void {
}

/**
 * For more info, see {@link g2 | the f1 function}.
 */
export function f2(): void {
}

// Warning: The @link reference could not be resolved: The package does not have an export "g2"
```

## How to fix

Correct the reference.  In the above example, we would fix `f2()`'s comment to reference `f1` like this:

```ts
/**
 * For more info, see {@link f1 | the f1 function}.
 */
export function f2(): void {
}
```

## See also

- [@link tag]({% link pages/tsdoc/tag_link.md %})
