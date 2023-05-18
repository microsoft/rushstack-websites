---
title: Project roadmap
---

## Already completed

These milestones were completed recently:

- Write up all the interesting design questions as "RFC" GitHub issues to collect community feedback
- Convert Microsoft's API Extractor tool to use **@microsoft/tsdoc** (replacing its proprietary AEDoc engine);
  this demonstrates that TSDoc can meet the needs of
  [a large production API docs website](https://docs.microsoft.com/en-us/javascript/api/sp-core-library?view=sp-typescript-latest)
- Implement an ESLint plugin for validating TSDoc syntax
- Introduce a `tsdoc.json` file format to enable custom tag definitions to be portable between tools
- Launch a `tsdoc.org` website providing more complete documentation (finally!)

## What's next

Contributor availability is difficult to predict, so we try not to make commitments about when (or whether)
a particular feature will get implemented. That said, here’s some feature areas seen as the main priorities for
future investments:

- Collect all the design specifications from the GitHub "RFC" issues and document them on the website
- Finish integrating the [new declaration reference syntax](https://github.com/microsoft/tsdoc/tree/main/tsdoc/src/beta)
  and deprecate the old syntax
- Expand the parser to support a much broader set of CommonMark syntax elements
- Expand the capabilities of the [tsdoc.json](https://github.com/microsoft/tsdoc/tree/main/tsdoc-config) config file
- Write up a formal grammar specification
