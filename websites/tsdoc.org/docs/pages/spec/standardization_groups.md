---
title: Standardization groups
---

Three "standardization groups" are used to classify the standard TSDoc tags, according to the
the level of support expected from compatible documentation tools. They correspond to the
[Standardization enum](https://github.com/microsoft/tsdoc/blob/main/tsdoc/src/details/Standardization.ts)
in the parser API.

## "Core" group

Enum value: `Standardization.Core`

TSDoc tags in the "Core" standardization group are considered essential. Their meaning is standardized, and
every documentation tool is expected to recognize them. The TSDoc parser library typically provides dedicated
APIs for accessing these tags.

## "Extended" group

Enum value: `Standardization.Extended`

TSDoc tags in the "Extended" standardization group are optional. Documentation tools may or may not support them.
If they do, the syntax and semantics should conform to the TSDoc standard definitions.

## "Discretionary" group

Enum value: `Standardization.Discretionary`

TSDoc tags in the "Discretionary" standardization group are optional. Although the syntax is specified,
the semantics for these tags are implementation-specific (and sometimes difficult to describe completely without
referring to a specific implementation). Discretionary tags are included in the TSDoc standard to ensure that
if two different popular tools use the same tag name, developers can expect the syntax to be the same, and
the semantics to be somewhat similar.
