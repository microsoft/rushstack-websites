---
title: ae-preapproved-unsupported-type
---

_"The @preapproved tag cannot be applied to \_\_\_ because it is not a supported declaration type."_

## Remarks

The `@preapproved` tag is only supported for the following types of declarations:

- classes
- enums
- interfaces
- namespaces

The types are supported because they are nesting containers whose members can have frequent changes.

## How to fix

Remove the `@preapproved` tag.

## See also

- [@preapproved tag]({% link pages/tsdoc/tag_preapproved.md %})
