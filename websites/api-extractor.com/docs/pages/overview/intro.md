---
layout: page
title: What is API Extractor?
navigation_source: docs_nav
---

API Extractor is a TypeScript analysis tool that produces three different output types:

**1. API Report** - API Extractor can trace all exports from your project's main entry point and generate
a report to be used as the basis for an API review workflow.

**2. .d.ts Rollups** - Similar to how **Webpack** can "roll up" all your JavaScript files into a single bundle
for distribution, API Extractor can roll up your TypeScript declarations into a single .d.ts file.

**3. API Documentation** - API Extractor can generate a "doc model" JSON file for each of your projects.  This
JSON file contains the extracted type signatures and doc comments.  The **api-documenter** companion tool
can use these files to generate an API reference website, or you can use them as inputs for a custom documentation
pipeline.

<div class="d-flex flex-row justify-content-center py-5">
  <img style="height: 450px;" class="mx-auto" src="{{ site.baseurl }}/images/ae-flow-chart.svg" />
</div>

#### Next up: [A sample project]({% link pages/overview/demo_project.md %})
