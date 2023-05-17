---
title: '@example'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Extended](../spec/standardization_groups.md) |
| Syntax kind: | [Block tag](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

Indicates a documentation section that should be presented as an example illustrating how to use the API.
It may include a code sample.

Any subsequent text that appears on the same line as the `@example` tag should be interpreted
as a title for the example. Otherwise, the documentation tool can index the examples numerically.

## Example A

For this code sample, the generated titles might be **"Example"** and **"Example 2"**:

````ts
/**
 * Adds two numbers together.
 * @example
 * Here's a simple example:
 * ```
 * // Prints "2":
 * console.log(add(1,1));
 * ```
 * @example
 * Here's an example with negative numbers:
 * ```
 * // Prints "0":
 * console.log(add(1,-1));
 * ```
 */
export function add(x: number, y: number): number {}
````

## Example B

For this code sample, the generated title might be **"Example: Parsing a basic JSON file"**:

````ts
/**
 * Parses a JSON file.
 *
 * @param path - Full path to the file.
 * @returns An object containing the JSON data.
 *
 * @example Parsing a basic JSON file
 *
 * # Contents of `file.json`
 * ```json
 * {
 *   "exampleItem": "text"
 * }
 * ```
 *
 * # Usage
 * ```ts
 * const result = parseFile("file.json");
 * ```
 *
 * # Result
 * ```ts
 * {
 *   exampleItem: 'text',
 * }
 * ```
 */
````

## See also

- [RFC #20](https://github.com/microsoft/tsdoc/issues/20): Syntax for `@example` tag
