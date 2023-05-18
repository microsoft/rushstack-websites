---
title: '@readonly'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Extended](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

This modifier tag indicates that an API item should be documented as being read-only, even if the TypeScript
type system may indicate otherwise. For example, suppose a class property has a setter function that always
throws an exception explaining that the property cannot be assigned; in this situation, the `@readonly` modifier
can be added so that the property is shown as read-only in the documentation.

## Example

```ts
export class Book {
  /**
   * Technically property has a setter, but for documentation purposes it should
   * be presented as readonly.
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
