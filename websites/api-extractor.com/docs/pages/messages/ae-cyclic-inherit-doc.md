---
title: ae-cyclic-inherit-doc
---

_"The `@inheritDoc` tag for \_\_\_ refers to its own declaration"._

## Remarks

The `@inheritDoc` tag saves typing by copying documentation content from another declaration. The other declaration
is specified using a TSDoc declaration reference. But if the other reference refers back to the original declaration,
then an `ae-cyclic-inherit-doc` error is reported.

The self-reference can be simple:

```ts
/**
 * {@inheritDoc f1}
 * @public
 */
export function f1(): void {}

// Warning: The "@inheritDoc" tag for "f1" refers to its own declaration.
```

Or it can be indirect:

```ts
/**
 * {@inheritDoc f2}
 * @public
 */
export function f1(): void {}

/**
 * {@inheritDoc f3}
 * @public
 */
export function f2(): void {}

/**
 * {@inheritDoc f1}
 * @public
 */
export function f3(): void {}

// Warning: The "@inheritDoc" tag for "f1" refers to its own declaration.
```

## How to fix

Remove or change one of the `@inheritDoc` tags to eliminate the cycle.

## See also

- [@inheritDoc tag](../tsdoc/tag_inheritdoc.md)
