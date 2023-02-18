---
layout: page
title: '@param'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [core](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

**Syntax:**

* `@param NAME - DESCRIPTION`

The `@param` tag is used to document a function or method parameter.  The `@param` tag is followed by the
parameter name, followed by a hyphen, followed by a description.  Being a block tag, `@param` introduces
a TSDoc section that contains all comment text up until the next block tag.

> NOTE: [JSDoc's version](http://usejsdoc.org/tags-param.html) of the `@param` tag optionally allows type
> information to be specified in curly braces.  For example:
>
> ```js
> // NOT SUPPORTED BY API EXTRACTOR
>
> /**
>  * @param {string} somebody - Somebody's name.
>  */
> function sayHello(somebody) {
>   alert('Hello ' + somebody);
> }
> ```
>
> API Extractor does not support this `{string}` notation, since its grammar is complex, and
> the type system it implements is fairly rudimentary compared to TypeScript's.  For TypeScript source code,
> the parameter type information is already fully expressed in the code, and thus it would be redundant
> to try to express it in a doc comment.

**Usage example:**

```ts
/** @public */
export class Statistics {
  /**
   * Returns the average of two numbers.
   *
   * @remarks
   * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
   *
   * @param x - The first input number
   * @param y - The second input number
   * @returns The arithmetic mean of `x` and `y`
   */
  public static getAverage(x: number, y: number): number {
    return (x + y) / 2.0;
  }
}
```

## See also

- [@typeParam tag]({% link pages/tsdoc/tag_typeparam.md %})
- [@returns tag]({% link pages/tsdoc/tag_returns.md %})
