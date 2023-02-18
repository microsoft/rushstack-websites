---
layout: page
title: ae-misplaced-package-tag
navigation_source: docs_nav
---

*"The @packageDocumentation comment must appear at the top of entry point *.d.ts file."*

## Remarks

The doc comment containing the `@packageDocumentation` tag must appear as the first comment
in the entry point file (as specified by the `mainEntryPointFilePath` setting).  To prevent mistakes,
API Extractor reports `ae-misplaced-package-tag` if it finds a comment with the `@packageDocumentation` tag
in some other location.

## How to fix

Move the comment to the top of the file.

> When investigating this issue, it's better to inspect your entry point's .d.ts file instead of the .ts file.
> The TypeScript compiler can remove or rearrange comment blocks in the emitted .d.ts files.

## See also

- [@packageDocumentation tag]({% link pages/tsdoc/tag_packagedocumentation.md %})
- [mainEntryPointFilePath setting]({% link pages/configs/api-extractor_json.md %}#mainentrypointfilepath)
