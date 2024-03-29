---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/node-core-library](./node-core-library.md) &gt; [Sort](./node-core-library.sort.md) &gt; [isSortedBy](./node-core-library.sort.issortedby.md)

## Sort.isSortedBy() method

Returns true if the collection is already sorted by the specified key.

**Signature:**

```typescript
static isSortedBy<T>(collection: Iterable<T>, keySelector: (element: T) => any, comparer?: (x: any, y: any) => number): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  collection | Iterable&lt;T&gt; |  |
|  keySelector | (element: T) =&gt; any |  |
|  comparer | (x: any, y: any) =&gt; number | _(Optional)_ |

**Returns:**

boolean

## Example


```ts
let array: string[] = [ 'a', 'bb', 'ccc' ];
Sort.isSortedBy(array, x => x.length); // true
```

