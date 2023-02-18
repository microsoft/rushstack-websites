---
layout: page
title: ae-incompatible-release-tags
navigation_source: docs_nav
---

*"The symbol ___ is marked as ___, but its signature references ___ which is marked as ___."*

## Remarks

The TSDoc "release tags" form an ordering according to their visibility:

`@public` \> `@beta` \> `@alpha`\> `@internal`

For example, when .d.ts trimming is applied, a "beta" release will include declarations marked as `@public` or `@beta`,
but will omit declarations marked as `@alpha` or `@internal`.  This prevents the developer from accidentally
using an `@alpha` or `@internal` declaration.

But suppose we have an API like this:

```ts
/**
 * Not visible in a "beta" release.
 * @alpha
 */
export ICalculateOptions {
  numerator: number;
  denominator: number;
}

/**
 * Visible in a "beta" release.
 * @beta
 */
export function calculate(options: ICalculateOptions): void {  // <-- problem!
}

// Warning: The symbol "calculate" is marked as "@beta", but its signature references
// "ICalculateOpations" which is marked as "@alpha"
```

When a developer is using the "beta" release, they won't be able to access the `ICalculateOptions` type needed
to call the `calculate()` function.  That's not good!

Similarly, suppose that a `@beta` class were to inherit from an `@alpha` class:

```ts
/**
 * Not visible in a "beta" release.
 * @alpha
 */
export class Control {
  public constructor(x: height, y: width) {
  }
}

/**
 * Visible in a "beta" release.
 * @beta
 */
export class Button extends Control {  // <-- problem!
}

// Warning: "The symbol "Button" is marked as "@beta", but its signature references
// "Control" which is marked as "@alpha"
```

When a developer is using the "beta" release, they should not be using the `Control` type because it is marked as
`@alpha`.  But then how are they supposed to construct an instance of `Button` class, which relies on it?

It's interesting to consider what happens when the tags are reversed:

```ts
/**
 * Visible in a "beta" release.
 * @beta
 */
export class Control {
  public constructor(x: height, y: width) {
  }
}

/**
 * Not visible in a "beta" release.
 * @alpha
 */
export class Button extends Control {  // <-- okay
}
```

In this example, the "beta" release hides the `Button` class, but it's still perfectly valid for a developer to use
the base class `Control`.  So there is no incompatibility here.

In general, the principle here is that *a type signature should not reference another types whose release tag
is less visible*.  API Extractor checks this for you, and will report `ae-incompatible-release-tags` if it detects
an inconsistency.


## How to fix

Correct the release tags so that the relationships are consistent.

## See also

- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
