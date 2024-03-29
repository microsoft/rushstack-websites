---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [PnpmOptionsConfiguration](./rush-lib.pnpmoptionsconfiguration.md) &gt; [globalAllowedDeprecatedVersions](./rush-lib.pnpmoptionsconfiguration.globalalloweddeprecatedversions.md)

## PnpmOptionsConfiguration.globalAllowedDeprecatedVersions property

The `globalAllowedDeprecatedVersions` setting suppresses installation warnings for package versions that the NPM registry reports as being deprecated. This is useful if the deprecated package is an indirect dependency of an external package that has not released a fix. The settings are copied into the `pnpm.allowedDeprecatedVersions` field of the `common/temp/package.json` file that is generated by Rush during installation.

PNPM documentation: https://pnpm.io/package\_json\#pnpmalloweddeprecatedversions

If you are working to eliminate a deprecated version, it's better to specify `allowedDeprecatedVersions` in the package.json file for individual Rush projects.

**Signature:**

```typescript
readonly globalAllowedDeprecatedVersions: Record<string, string> | undefined;
```
