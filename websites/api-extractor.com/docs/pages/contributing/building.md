---
layout: page
title:  Building the code
navigation_source: docs_nav
---

API Extractor is developed in the monorepo for the [Rush Stack](https://rushstack.io/) family of projects:

&nbsp;&nbsp;&nbsp;&nbsp; [https://github.com/microsoft/rushstack](https://github.com/microsoft/rushstack)

Related GitHub repos:
- The API Extractor website and documentation: [https://github.com/microsoft/api-extractor.com-website](https://github.com/microsoft/api-extractor.com-website)
- The TSDoc parser for doc comments: [https://github.com/Microsoft/tsdoc](https://github.com/Microsoft/tsdoc)

For general instructions on building API Extractor and guidelines for submitting PRs, please read the
[Contributing](https://rushstack.io/pages/contributing/get_started/) documentation for the Rush Stack
monorepo.

The specific project folders that you will be interested in are:

- [apps/api-extractor](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor)
- [apps/api-documenter](https://github.com/microsoft/rushstack/tree/main/apps/api-documenter)
- [libraries/api-extractor-model](https://github.com/microsoft/rushstack/tree/main/libraries/api-extractor-model)

After you've built the above 3 projects, there are a number of test projects in the [build-tests](
https://github.com/microsoft/rushstack/tree/main/build-tests) folder that will be symlinked to
your built executables.  These "test" projects don't use a test runner.  Instead, they are modeled realistic
NodeJS library projects whose interesting outputs are tracked by Git.  Thus, when the output changes, you need
to remember to commit the updated output files to Git.  (Eventually we'll add a build task that validates this
similar to a Jest snapshot.)

These test projects impact the overall monorepo build time, so most of the newer tests have been moved into
a monolithic project called [api-extractor-scenarios](
https://github.com/microsoft/rushstack/tree/main/build-tests/api-extractor-scenarios).
It contains a number of small entry points that get compiled via a single invocation of the TypeScript compiler.
Then the [runScenarios.ts](
https://github.com/microsoft/rushstack/blob/main/build-tests/api-extractor-scenarios/src/runScenarios.ts)
driver invokes API Extractor on each output, using the `CompilerState` object to reuse the semantic analysis.
This is an order of magnitude faster than building each project individually.

Some of the **api-extractor-scenarios** tests need to import declarations from an external package.
These projects are used for that purpose (and no other purpose):

- [api-extractor-lib1-test](
https://github.com/microsoft/rushstack/tree/main/build-tests/api-extractor-lib1-test)
- [api-extractor-lib2-test](
https://github.com/microsoft/rushstack/tree/main/build-tests/api-extractor-lib2-test)
- [api-extractor-lib3-test](
https://github.com/microsoft/rushstack/tree/main/build-tests/api-extractor-lib3-test)
