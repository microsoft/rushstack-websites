---
title: TSDoc spec
---

Technical details for the TSDoc syntax are tracked by "RFC" issues with the
[Request for Comments](https://github.com/microsoft/tsdoc/issues?q=is%3Aissue+is%3Aopen+label%3A%22request+for+comments%22+)
GitHub label.

The [@microsoft/tsdoc](../packages/tsdoc.md) package provides a feature complete reference
implementation of a parser, and many syntax details are explained in the code comments for its source code.

> This section is still under development. We'll post more detail soon.

### Declaration references

The **"old"** syntax for declaration references is detailed in this technical note:

[/spec/code-snippets/DeclarationReferences.ts](https://github.com/microsoft/tsdoc/blob/main/spec/code-snippets/DeclarationReferences.ts)

The **"new"** syntax for declaration references is described in this grammar:

[/tsdoc/src/beta/DeclarationReference.grammarkdown](https://github.com/microsoft/tsdoc/blob/main/tsdoc/src/beta/DeclarationReference.grammarkdown)

Examples of the new syntax can be found in the
[DeclarationReference.test.ts](https://github.com/microsoft/tsdoc/blob/main/tsdoc/src/beta/__tests__/DeclarationReference.test.ts)
file.
