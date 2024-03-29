---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [IndividualVersionPolicy](./rush-lib.individualversionpolicy.md) &gt; [ensure](./rush-lib.individualversionpolicy.ensure.md)

## IndividualVersionPolicy.ensure() method

Returns an updated package json that satisfies the version policy.

**Signature:**

```typescript
ensure(project: IPackageJson, force?: boolean): IPackageJson | undefined;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  project | [IPackageJson](./node-core-library.ipackagejson.md) | input package json |
|  force | boolean | _(Optional)_ force update even when the project version is higher than the policy version. |

**Returns:**

[IPackageJson](./node-core-library.ipackagejson.md) \| undefined

