---
layout: page
title: ae-unresolved-inheritdoc-base
navigation_source: docs_nav
---

*"The @inheritDoc tag needs a TSDoc declaration reference; signature matching is not supported yet"*

## Remarks

Suppose we have some declarations like this:

```ts
export class Base {
  /**
   * Some documentation that we want to inherit
   */
   public member(): void {
   }
}

export interface IChild {
  /**
   * Some documentation that we want to inherit
   */
  value: string;
}
```

...and then we try to inherit their documentation like this:

```ts
export class Child extends Base implements IChild {
  /** {@inheritDoc} */    // <-- not supported
  public member(): void {
  }

  /** {@inheritDoc} */    // <-- not supported
  public value: string = 'example';
}

// Warning: The @inheritDoc tag needs a TSDoc declaration reference;
// signature matching is not supported yet
```

It would be convenient if the `{@inheritDoc}` tag could be matched with the corresponding member from the
base class or interface.  This may be implemented in the future; however, it is not supported today.
Instead, you need to provide an explicit declaration reference like this:

```ts
export class Child extends Base implements IChild {
  /** {@inheritDoc Base.member} */
  public member(): void {
  }

  /** {@inheritDoc IChild.value} */
  public value: string = 'example';
}
```

## How to fix

Add an explicit declaration reference to the `{@inheritDoc}` tag.

## See also

- [@inheritDoc tag]({% link pages/tsdoc/tag_inheritdoc.md %})
