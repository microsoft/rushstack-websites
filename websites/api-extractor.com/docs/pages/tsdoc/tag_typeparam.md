---
title: '@typeParam'
---

**Tag type:** block tag

**TSDoc standardization:** [core](https://github.com/microsoft/tsdoc/blob/main/tsdoc/src/details/Standardization.ts)

**Syntax:**

- `@typeParam NAME - DESCRIPTION`

The `@typeParam` tag is used to document a
[generic parameter](https://www.typescriptlang.org/docs/handbook/generics.html)
for a type. The `@typeParam` tag is followed by the parameter name, followed by a hyphen, followed by a description.
Being a block tag, `@typeParam` introduces a TSDoc section that contains all comment text up until the next block tag.

**Usage example:**

```ts
/**
 * A collection of items.
 * @typeParam TItem - the type of the items in the collection
 * @public
 */
class ItemCollection<TItem extends object> {
  private readonly _items: TItem[] = [];

  /**
   * Add an item to the collection.
   * @param item - the item to add
   */
  public add(item: TItem): void {
    this._items.push(item);
  }
}
```

## See also

- [@param tag](../tsdoc/tag_param.md)
- [@returns tag](../tsdoc/tag_returns.md)
