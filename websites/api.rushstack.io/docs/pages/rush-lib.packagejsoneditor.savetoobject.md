---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [PackageJsonEditor](./rush-lib.packagejsoneditor.md) &gt; [saveToObject](./rush-lib.packagejsoneditor.savetoobject.md)

## PackageJsonEditor.saveToObject() method

Get the normalized package.json that represents the current state of the PackageJsonEditor. This method does not save any changes that were made to the package.json, but instead returns the object representation of what would be saved if saveIfModified() is called.

**Signature:**

```typescript
saveToObject(): IPackageJson;
```
**Returns:**

[IPackageJson](./node-core-library.ipackagejson.md)

