---
title: '@label'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Core](../spec/standardization_groups.md) |
| Syntax kind: | [Inline tag](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

The `{@label}` inline tag is used to label a declaration, so that it can be referenced using a selector in
the TSDoc declaration reference notation.

> Note: The `{@label}` notation has not been finalized. See GitHub
> [issue #9](https://github.com/microsoft/tsdoc/issues/9)

## Example

```ts
export interface Interface {
  /**
   * Shortest name:  {@link InterfaceL1.(:STRING_INDEXER)}
   * Full name:      {@link (InterfaceL1:interface).(:STRING_INDEXER)}
   *
   * {@label STRING_INDEXER}
   */
  [key: string]: number;

  /**
   * Shortest name:  {@link InterfaceL1.(:NUMBER_INDEXER)}
   * Full name:      {@link (InterfaceL1:interface).(:NUMBER_INDEXER)}
   *
   * {@label NUMBER_INDEXER}
   */
  [key: number]: number;

  /**
   * Shortest name:  {@link InterfaceL1.(:FUNCTOR)}
   * Full name:      {@link (InterfaceL1:interface).(:FUNCTOR)}
   *
   * {@label FUNCTOR}
   */
  (source: string, subString: string): boolean;

  /**
   * Shortest name:  {@link InterfaceL1.(:CONSTRUCTOR)}
   * Full name:      {@link (InterfaceL1:interface).(:CONSTRUCTOR)}
   *
   * {@label CONSTRUCTOR}
   */
  new (hour: number, minute: number);
}
```
