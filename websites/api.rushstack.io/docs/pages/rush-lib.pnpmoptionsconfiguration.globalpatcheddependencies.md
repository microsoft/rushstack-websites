---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [PnpmOptionsConfiguration](./rush-lib.pnpmoptionsconfiguration.md) &gt; [globalPatchedDependencies](./rush-lib.pnpmoptionsconfiguration.globalpatcheddependencies.md)

## PnpmOptionsConfiguration.globalPatchedDependencies property

(GENERATED BY RUSH-PNPM PATCH-COMMIT) When modifying this property, make sure you know what you are doing.

The `globalPatchedDependencies` is added/updated automatically when you run pnpm patch-commit command. It is a dictionary where the key should be the package name and exact version. The value should be a relative path to a patch file.

PNPM documentation: https://pnpm.io/package\_json\#pnpmpatcheddependencies

**Signature:**

```typescript
get globalPatchedDependencies(): Record<string, string> | undefined;
```
