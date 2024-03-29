---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/api-extractor-model](./api-extractor-model.md) &gt; [ApiExportedMixin](./api-extractor-model.apiexportedmixin.md) &gt; [isExported](./api-extractor-model.apiexportedmixin.isexported.md)

## ApiExportedMixin.isExported property

Whether the declaration is exported from its parent item container (i.e. either an `ApiEntryPoint` or an `ApiNamespace`<></>).

**Signature:**

```typescript
readonly isExported: boolean;
```

## Remarks

Suppose `index.ts` is your entry point:

```ts
// index.ts

export class A {}
class B {}

namespace n {
  export class C {}
  class D {}
}

// file.ts
export class E {}
```
Classes `A` and `C` are both exported, while classes `B`<></>, `D`<></>, and `E` are not. `E` is exported from its local file, but not from its parent item container (i.e. the entry point).

