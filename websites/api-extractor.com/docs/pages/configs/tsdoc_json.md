---
layout: page
title: tsdoc.json
navigation_source: docs_nav
---

[TSDoc](https://tsdoc.org/) is a standard syntax for TypeScript doc comments.  It can be extended with custom
tag definitions.  API Extractor's custom tags are referred to as "AEDoc" tags.  They are defined in the file
[extends/tsdoc-base.json](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/extends/tsdoc-base.json).

If your code comments are processed by other TSDoc-compatible tools, you can add a **tsdoc.json** config file
to your project. This enables different tools to agree about how comments should be parsed.  If you are using
the [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc) plugin, it also enables ESLint
to report warnings for tags that are ***not defined*** (for example misspelled) or ***not supported***
(for example a standardized tag that is not implemented by your tooling).

Add a file like this to your project:

**&lt;your-project-folder&gt;/tsdoc.json**
```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",

  // Inherit the TSDoc configuration for API Extractor
  "extends": [ "@microsoft/api-extractor/extends/tsdoc-base.json" ]
}
```


## Defining your own TSDoc tags

You can also define your own tags in **tsdoc.json**, and the ESLint plugin will validate them.
API Extractor serializes these definitions into the .api.json output files (in the `"tsdocConfig"` field)
so that they are accessible to tools that use the
[@microsoft/api-extractor-model](https://www.npmjs.com/package/@microsoft/api-extractor-model) library
(via the [ApiDocumentedItem.tsdocComment](https://api.rushstack.io/pages/api-extractor-model.apidocumenteditem/) API).

A custom tag definition might look like this:

**&lt;your-project-folder&gt;/tsdoc.json**
```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",

  // Include the definitions that are required for API Extractor
  "extends": ["@microsoft/api-extractor/extends/tsdoc-base.json"],

  // noStandardTags: false,

  "tagDefinitions": [
    // Define a custom tag and specify how it should be parsed
    {
      "tagName": "@myCustomTag",
      "syntaxKind": "block",
      "allowMultiple": true,
    }
  ],

  "supportForTags": {
    // Indicate that the custom tag is supported by your tooling.  (Without this, warnings may
    // be reported saying that the tag is unsupported.)
    "@myCustomTag": true
  }
}
```

The resulting TSDoc configuration will include the AEDoc definitions that were merged via `"extends"`,
plus the standard tags that are predefined by the TSDoc parser.  To see your project's final TSDoc configuration,
invoke API Extractor with the `--diagnostics` command-line option:

```
$ cd your-project-folder

# Look for the "DIAGNOSTIC: TSDoc configuration" in the console output
$ api-extractor run --local --diagnostics
```

> For more details about the **tsdoc.json** file, refer to the
> [@microsoft/tsdoc-config](https://tsdoc.org/pages/packages/tsdoc-config/) documentation.
