---
layout: page
title: '@example'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

Indicates a documentation section that should be presented as an example
illustrating how to use the API.  It may include a code sample.

**Usage example:**

```ts
/**
 * Adds two numbers together.
 *
 * @remarks
 * Use this function to perform example addition.
 *
 * @example
 * Here's a simple example:
 * ```
 * // Prints "2":
 * console.log(add(1,1));
 * ```
 *
 * @example
 * Here's an example with negative numbers:
 * ```
 * // Prints "0":
 * console.log(add(1,-1));
 * ```
 *
 * @param x - the first number to add
 * @param y - the second number to add
 * @public
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

API Documenter will number the example sections automatically.  The output might look like this:

> **add() function**
>
> Adds two numbers together.
>
> <b>Signature:</b>
>
> ```typescript
> export declare function add(x: number, y: number): number;
> ```
>
> ## Parameters
>
> |  Parameter | Type | Description |
> |  --- | --- | --- |
> |  x | <code>number</code> | the first number to add |
> |  y | <code>number</code> | the second number to add |
>
> <b>Returns:</b>
>
> `number`
>
> ## Remarks
>
> Use this function to perform example addition.
>
> ## Example 1
>
> Here's a simple example:
>
> ```
> // Prints "2":
> console.log(add(1,1));
> ```
>
> ## Example 2
>
> Here's an example with negative numbers:
>
> ```
> // Prints "0":
> console.log(add(1,-1));
> ```

## See also

- [TSDoc RFC #20](https://github.com/microsoft/tsdoc/issues/20)
