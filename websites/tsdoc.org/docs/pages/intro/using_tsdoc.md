---
layout: page
title: How can I use TSDoc?
navigation_source: docs_nav
---

By itself, the **@microsoft/tsdoc** package is not a documentation solution you can use directly. It is an engine component used by other tools such as [API Extractor](https://api-extractor.com/pages/tsdoc/doc_comment_syntax/). The [NPM dependency report](https://www.npmjs.com/browse/depended/@microsoft/tsdoc) is an easy way to find tools that implement TSDoc.

Even if you have not enabled a documentation tool yet for your project, adopting the TSDoc conventions will make your code comments more compatible with other tools.

👉 **To check for mistakes in your code,** install the [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc) plugin for ESLint

👉 **To see how your comments would be rendered** by a compatible documentation tool, try pasting your `/** */` comment into the [TSDoc Playground](/play)!

👉 **Implementing a tool that needs to parse doc comments?** The [@microsoft/tsdoc](https://www.npmjs.com/package/@microsoft/tsdoc) package provides a professional quality parser. The [api-demo](https://github.com/microsoft/tsdoc/tree/main/api-demo) folder contains sample code showing how to invoke the parser.

👉 **Have an idea for an improvement?** We're using [GitHub issues](https://github.com/Microsoft/tsdoc/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) to discuss the TSDoc specification, library design, and project roadmap.
