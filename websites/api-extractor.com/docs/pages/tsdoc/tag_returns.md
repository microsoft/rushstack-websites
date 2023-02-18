---
layout: page
title: '@returns'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [core](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@returns` tag is used to document the return value of a function or method parameter.  Being a block tag,
`@returns` introduces a TSDoc section that contains all comment text up until the next block tag.

> NOTE: [JSDoc's version](http://usejsdoc.org/tags-returns.html) of the `@returns` tag optionally allows type
> information to be specified in curly braces.  For example:
>
> ```js
> // NOT SUPPORTED BY API EXTRACTOR
>
> /**
>  * Returns the sum of a and b
>  * @param {number} a
>  * @param {number} b
>  * @param {boolean} retArr If set to true, the function will return an array
>  * @returns {(number|Array)} Sum of a and b or an array
>  */
> function sum(a, b, retArr) {
>  if (retArr) {
>    return [a, b, a + b];
>  }
>  return a + b;
> }
> ```
>
> API Extractor does not support this `{(number|Array)}` notation, since its grammar is complex, and
> the type system it implements is fairly rudimentary compared to TypeScript's.  For TypeScript source code,
> the return type information is already fully expressed in the code, and thus it would be redundant
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

- [@param tag]({% link pages/tsdoc/tag_param.md %})
