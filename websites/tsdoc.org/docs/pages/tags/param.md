---
title: '@param'
---

| Standardization: | [Core](../spec/standardization_groups.md) |
| Syntax kind: | [Block tag](../spec/tag_kinds.md) |

## Usage

Used to document a function parameter. The `@param` tag is followed by a parameter name, followed by a hyphen,
followed by a description.

## Example

```ts
/**
 * Returns the average of two numbers.
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * @param x - The first input number
 * @param y - The second input number
 * @returns The arithmetic mean of `x` and `y`
 *
 * @beta
 */
function getAverage(x: number, y: number): number {
  return (x + y) / 2.0;
}
```

## See also

- [@returns](../tags/returns.md) tag
- [RFC #19](https://github.com/microsoft/tsdoc/issues/19): Support for dot syntax on `@param`
- [Issue #151](https://github.com/microsoft/tsdoc/issues/151): Documenting the default value for a parameter
