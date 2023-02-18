---
layout: page
title: '@eventProperty'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

When applied to a class or interface property, this indicates that the property
returns an event object that event handlers can be attached to.  The event-handling
API is implementation-defined, but typically the property return type would be a class
with members such as `addHandler()` and `removeHandler()`.  A documentation tool can
display such properties under an "Events" heading instead of the usual "Properties" heading.

**Usage example:**

```ts
/**
 * @public
 */
export class Button {
  /**
   * This event is fired whenever the button is clicked.
   * @eventProperty
   */
  public get clicked(): Event {
    . . .
  }
}
```

## See also

- [TSDoc RFC #30](https://github.com/microsoft/tsdoc/issues/30)
