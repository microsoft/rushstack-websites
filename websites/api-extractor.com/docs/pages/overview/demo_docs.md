---
title: API documentation
---

_This article continues the tutorial from the "[What is API Extractor?](../overview/intro.md)" page. It's recommended to start there._

The final API Extractor output that we'll look at is the "**doc model**" file. This JSON file captures
the API signatures and doc comments for a project that was processed by API Extractor. It contains all the
information needed to generate an API reference website.

The website can be generated using the basic [api-documenter](https://www.npmjs.com/package/@microsoft/api-documenter) tool that comes with API Extractor. You can also
use the JSON files as an input for your own custom pipeline. For example, real **@microsoft/sp-core-library**
gets rendered using Microsoft's custom DocFX engine. Here's the final result:

[https://docs.microsoft.com/en-us/javascript/api/sp-core-library](https://docs.microsoft.com/en-us/javascript/api/sp-core-library)

## What's in the JSON file?

Since the NPM package name for our example project is **@microsoft/sp-core-library**, the default path for this
output will be **temp/sp-core-library.api.json**. The file is fairly large, but here's an excerpt
corresponding to the `ILogHandler.error` member, which should give an idea of the file structure:

**temp/sp-core-library.api.json**<br/>

```js
{
  "metadata": {
    "toolPackage": "@microsoft/api-extractor",
    "toolVersion": "7.1.0",
    "schemaVersion": 1000
  },
  "kind": "Package",
  "canonicalReference": "@microsoft/sp-core-library",
  "docComment": "",
  "name": "@microsoft/sp-core-library",
  "members": [
    {
      "kind": "EntryPoint",
      "canonicalReference": "",
      "name": "",
      "members": [
        {
          "kind": "Interface",
          "canonicalReference": "(ILogHandler:interface)",
          "docComment": "/**\n * The redirectable implementation for the Log class.\n *\n * @beta\n */\n",
          "releaseTag": "Beta",
          "name": "ILogHandler",
          "members": [
            {
              "kind": "MethodSignature",
              "canonicalReference": "(error:0)",
              "docComment": "",
              "excerptTokens": [
                {
                  "kind": "Reference",
                  "text": "error"
                },
                {
                  "kind": "Content",
                  "text": "("
                },
                . . .
              ],
              "returnTypeTokenRange": {
                "startIndex": 10,
                "endIndex": 11
              },
              "releaseTag": "Beta",
              "overloadIndex": 1,
              "parameters": [
                {
                  "parameterName": "source",
                  "parameterTypeTokenRange": {
                    "startIndex": 4,
                    "endIndex": 5
                  }
                },
                {
                  "parameterName": "error",
                  "parameterTypeTokenRange": {
                    "startIndex": 8,
                    "endIndex": 9
                  }
                }
              ],
              "name": "error"
            },
            . . .
          ],
          "extendsTokenRanges": []
        },
        . . .
      ]
    }
  ]
}
```

Hmm, well that was interesting... but there's some good news: **You don't need to write your own parser for this
complex file format!** The [@microsoft/api-extractor-model](https://www.npmjs.com/package/@microsoft/api-extractor-model) package already provides a complete library for reading,
querying, modifying, and writing this file format. If you want to roll your own TypeScript documentation generator,
it's never been easier! :-)

## Documenting multiple projects together

A major advantage of this intermediary JSON file is that it allows a collection of related projects to be built
separately, but documented as a group. This is particularly useful at a large company, where individual
projects may be owned by different teams, perhaps working in separate Git repos, perhaps using different toolchains,
perhaps releasing on different timelines. Regardless of how the JSON files are produced, once they are collected
together in a central location, a tool such as **api-documenter** can load them into a single "model" and generate
an integrated website, complete with cross-package hyperlinks and an integrated navigation tree.

This concludes our quick tour of the three major use cases for API Extractor. Ready to get started?

#### Next up: [Invoking API Extractor](../setup/invoking.md)
