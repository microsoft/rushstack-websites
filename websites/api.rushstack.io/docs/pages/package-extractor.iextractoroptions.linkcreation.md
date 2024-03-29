---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/package-extractor](./package-extractor.md) &gt; [IExtractorOptions](./package-extractor.iextractoroptions.md) &gt; [linkCreation](./package-extractor.iextractoroptions.linkcreation.md)

## IExtractorOptions.linkCreation property

The link creation mode to use. "default": Create the links while copying the files; this is the default behavior. Use this setting if your file copy tool can handle links correctly. "script": A Node.js script called create-links.js will be written to the target folder. Use this setting to create links on the server machine, after the files have been uploaded. "none": Do nothing; some other tool may create the links later, based on the extractor-metadata.json file.

**Signature:**

```typescript
linkCreation?: 'default' | 'script' | 'none';
```
