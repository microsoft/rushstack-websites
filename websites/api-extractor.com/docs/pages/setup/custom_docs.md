---
title: Integrating a custom doc pipeline
---

_This article continues the tutorial from the "[Invoking API Extractor](../setup/invoking.md)" page.
It's recommended to start there._

On the [previous page](../setup/generating_docs.md), we discussed various documentation systems that
can render the outputs created by the **api-documenter** tool. But what if you want a custom layout,
or want to integrate with a totally different system? If you're not afraid of writing some code, API Extractor makes
this fairly straightforward.

## Forking the api-documenter project

The **api-documenter** project was designed to serve as a code sample, so if you want to make some small changes,
you can simply fork it and modify the code. Here's the basic files you'd want to look at:

- [apps/api-documenter](https://github.com/microsoft/rushstack/tree/main/apps/api-documenter) - the main
  project folder on GitHub.

- [MarkdownAction.ts](https://github.com/microsoft/rushstack/blob/main/apps/api-documenter/src/cli/MarkdownAction.ts) -
  This source file defines the `api-documenter markdown` command-line and its parameters. It loads the `ApiModel`
  object and passes it to `MarkdownDocumenter`.

- [MarkdownDocumenter.ts](https://github.com/microsoft/rushstack/blob/main/apps/api-documenter/src/documenters/MarkdownDocumenter.ts) -
  This is the main documentation generator that you'd want to study. It illustrates how to traverse the tree of
  declarations and render each TypeScript construct. Since the
  [TSDoc library](https://github.com/microsoft/tsdoc/tree/master/tsdoc) already provides a nice API for representing
  a tree of rich text elements, the `MarkdownDocumenter` class takes the approach of producing a huge TSDoc "comment"
  representing each page on the web site. It's an unusual approach, but generating TSDoc output from TSDoc input
  avoids having to transform all the inner content.

- [api-documenter/src/nodes](https://github.com/microsoft/rushstack/tree/main/apps/api-documenter/src/nodes) -
  This folder extends the TSDoc library with some custom node types for headings, tables, note boxes, etc.
  that we need to make a full web page.

- [MarkdownEmitter.ts](https://github.com/microsoft/rushstack/blob/main/apps/api-documenter/src/markdown/MarkdownEmitter.ts) -
  This class is the final stage that generates a Markdown document from our TSDoc "comment" (plus custom nodes).
  This separation might enable modularity in the future: For example, if we wanted to support different Markdown
  flavors, the `MarkdownDocumenter` class doesn't have to be concerned with that. Theoretically we could also
  emit entirely different output formats such as HTML from the same intermediary TSDoc node tree.

## Coding your own generator

Looking over the above components, we see that most of this code is concerned with presentation of the
documentation content. The main loop that visits all the API declarations and renders their various attributes
is entirely contained in `MarkdownDocumenter.ts` and is relatively small.

This is possible because of the [@microsoft/api-extractor-model](https://www.npmjs.com/package/@microsoft/api-extractor-model) library. It does the hard work of loading
the folder of .api.json files, parsing their contents, and providing a nice hierarchy that you can query.
The library also implements the [ApiModel.resolveDeclarationReference()](https://github.com/microsoft/rushstack/blob/main/libraries/api-extractor-model/src/model/ApiModel.ts)
function that you can use to resolve the declaration references such as `@link` hyperlinks.

The README.md for **@microsoft/api-extractor-model** explains the basic hierarchy and how to traverse it,
and the individual classes such as `ApiClass`, `ApiEnum`, `ApiInterface` have pretty decent code comments.

One aspect that may not be entirely obvious is how to render TSDoc into some other format besides Markdown.
For an example of rendering HTML using React, you might also want to look at
[DocHtmlView.tsx](https://github.com/microsoft/tsdoc/blob/master/playground/src/DocHtmlView.tsx)
which renders the "HTML" tab for the [TSDoc Playground](https://microsoft.github.io/tsdoc/).

If you get stuck or have questions, the API Extractor developers are usually reachable
in the [Zulip chat room](https://rushstack.zulipchat.com/#narrow/stream/262521-api-extractor) for the **rushstack** monorepo.

And if you implement an adapter that allows API Extractor to work with a cool open source documentation engine...
let us know! We'll definitely mention it in these docs! :-)
