---
layout: page
title: '@readonly'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

This modifier tag is used with a property of a class or interface.  It indicates that the property should be
documented as being read-only, even if the type signature indicates otherwise.

This modifier is only needed in special situations.  Generally API Extractor will use the property's
type signature to determine whether it is read-only.

However, suppose that a class property has a setter function that always throws an exception explaining
that the property cannot be assigned.  In this situation, the `@readonly` modifier should be added so that
the property will be documented as being read-only.

**Usage example:**

```ts
/** @public */
export class Widget {
  ...
  /**
   * Everyday case: API Extractor will document this property as being read-only.
   */
  public get x(): number {
    return this._x;
  }

  /**
   * Special case:  We need to tell API Extractor to ignore the property setter.
   * @readonly
   */
  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    throw new Error('This property is read-only!');
  }
}
```
