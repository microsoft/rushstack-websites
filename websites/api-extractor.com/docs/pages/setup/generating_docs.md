---
title: Generating API docs
---

_This article continues the tutorial from the "[Invoking API Extractor](../setup/invoking.md)" page.
It's recommended to start there._

## Generating JSON files

API Extractor writes your extracted API signature and doc comments into an intermediary JSON file called
the "doc model" file. To enable this output, you simply need to set `docModel.enabled` to true in
your **api-extractor.json** config file.

The doc model file is written to `"<projectFolder>/temp/<unscopedPackageName>.api.json"` by default,
but you can customize this using the `docModel.apiJsonFilePath` setting.

## Using api-documenter to generate Markdown

API Extractor includes a companion tool called **api-documenter** that you can use to generate a basic API reference
website. The Markdown output is fairly basic, since the `MarkdownDocumenter.ts` source file was designed to be concise
and understandable, while still functionally complete. That way it can serve as a starting point for people who want
to implement their own adapter to process API Extractor's doc model using a custom pipeline (discussed later).
Even so, Markdown output can be a realistic solution if your needs are not too fancy, and it is very easy to use.

As input, **api-documenter** accepts a folder containing doc model files, one for each package that you want
to incorporate. This allows a collection of related projects to be built separately (perhaps in separate Git repos
using different toolchains). The documentation pipeline collects these JSON files, and then uses them to generate
a single website, complete with cross-package hyperlinks and an integrated navigation tree.

Here's a typical usage scenario:

1.  (Separately) Invoke API Extractor for each project that you want to document. This will produce one or more
    .api.json files.

2.  Copy your .api.json files into an input folder, for example:

    - **~/my-docs/input/** &nbsp;&nbsp; (.api.json inputs go here)
    - **~/my-docs/markdown/** &nbsp;&nbsp; (.md output files will go here)

3.  Install the [api-documenter tool](https://www.npmjs.com/package/@microsoft/api-documenter) in your global
    environment, using a shell command like this:

        ```shell
        $ npm install -g @microsoft/api-documenter
        ```

        Assuming your `PATH` environment variable is set up correctly, now you should now be able to invoke
        `api-documenter` from your shell.

4.  Run the **api-documenter** tool like this:

    ```shell
    $ cd ~/my-docs/
    $ api-documenter markdown
    ```

    You can customize these folders using parameters such as `--input-folder` and `--output-folder`.
    See [the command line reference](../commands/api-documenter_markdown.md) for details.

What do we do with these generated Markdown files? There are various options:

- **GitHub**: If you're using GitHub, you can simply commit them to your master branch in
  a "docs" folder, and they will be rendered using GitHub's markdown previewer. Here's an example of how it looks:
  [node-core-library.md](https://github.com/microsoft/rushstack-websites/blob/main/websites/api.rushstack.io/docs/pages/node-core-library.md)

- **GitHub Pages**: If you use [GitHub pages](https://guides.github.com/features/pages/) to host a web site for
  your project, your repo will probably have a "gh-pages" branch. You can add the Markdown files there,
  as seen here:

  Example branch: [https://github.com/microsoft/rushstack-websites/tree/main/websites/api.rushstack.io/docs/pages](https://github.com/microsoft/rushstack-websites/tree/main/websites/api.rushstack.io/docs/pages)

  Example website: [https://api.rushstack.io/pages/](https://api.rushstack.io/pages/)

- **Docusaurus**: These Markdown files can also be rendered using [Docusaurus](https://docusaurus.io/), which
  produces a React-based web site using Markdown inputs.

  Example branch: [https://github.com/faastjs/faast.js/tree/master/docs/api](https://github.com/faastjs/faast.js/tree/master/docs/api)

  Example website: [https://faastjs.org/docs/api/faastjs](https://faastjs.org/docs/api/faastjs)

## Using api-documenter with DocFX

If Markdown output is the "go-kart" of documentation generation, then
[DocFX](https://dotnet.github.io/docfx/) is the "space shuttle". It's a fairly complex but professional
system with nearly every feature imaginable, since it was created to power
[docs.microsoft.com](https://docs.microsoft.com). As far as API Extractor's involvement, the workflow is the same
as above, except that the shell command is `api-documenter yaml` instead of `api-documenter markdown`.
Setting up DocFX can be a little challenging (unless you work at Microsoft, in which case it's super easy! :-) ).

The sites that DocFX produces are very full-featured. Here's a couple API references that were generated
using **api-documenter** with DocFX:

<!--
- [SharePoint Framework Reference](https://docs.microsoft.com/en-us/javascript/api/sp-core-library)
-->

- [Add-ins platform](https://docs.microsoft.com/en-us/javascript/api/excel?view=excel-js-preview) for Microsoft Office
- [API reference](https://esfx.js.org/esfx/index.html) for the [@esfix](https://esfx.js.org/) project

These are nice options. But suppose you have custom needs, and you're not afraid to write some code to get
what you want...
