---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/api-extractor-model](./api-extractor-model.md) &gt; [ApiEnum](./api-extractor-model.apienum.md)

## ApiEnum class

Represents a TypeScript enum declaration.

**Signature:**

```typescript
export declare class ApiEnum extends ApiEnum_base 
```
**Extends:** ApiEnum\_base

## Remarks

This is part of the [ApiModel](./api-extractor-model.apimodel.md) hierarchy of classes, which are serializable representations of API declarations.

`ApiEnum` represents an enum declaration such as `FontSizes` in the example below:

```ts
export enum FontSizes {
  Small = 100,
  Medium = 200,
  Large = 300
}
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(options)](./api-extractor-model.apienum._constructor_.md) |  | Constructs a new instance of the <code>ApiEnum</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [containerKey](./api-extractor-model.apienum.containerkey.md) | <code>readonly</code> | string |  |
|  [kind](./api-extractor-model.apienum.kind.md) | <code>readonly</code> | [ApiItemKind](./api-extractor-model.apiitemkind.md) |  |
|  [members](./api-extractor-model.apienum.members.md) | <code>readonly</code> | ReadonlyArray&lt;[ApiEnumMember](./api-extractor-model.apienummember.md)<></>&gt; |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [addMember(member)](./api-extractor-model.apienum.addmember.md) |  |  |
|  [buildCanonicalReference()](./api-extractor-model.apienum.buildcanonicalreference.md) |  | **_(BETA)_** |
|  [getContainerKey(name)](./api-extractor-model.apienum.getcontainerkey.md) | <code>static</code> |  |

