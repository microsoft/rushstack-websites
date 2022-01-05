---
title: Project roadmap
---

Our [News page](./news) and Twitter feed is the best way to find out what's happening.
This roadmap supplements that with more general information about future directions.

***Last update: September 2021***


## Recently Completed

These milestones were completed recently:

<!-- latest events go on the bottom -->
- Shell tab completion for Rush
- Rush integration with [BuildXL](https://github.com/microsoft/BuildXL) for sharded builds
- Optimize Rush startup time, adding a new tool [@rushstack/rundown](https://www.npmjs.com/package/@rushstack/rundown)
- Redesign the "rush build" collator, based around a new [@rushstack/terminal](https://www.npmjs.com/package/@rushstack/terminal) model
- Introduce a model for [rig packages](https://www.npmjs.com/package/@rushstack/rig-package)
- Move the TSDoc project documentation to a dedicated website [https://tsdoc.org/](@tsdoc/)
- Get the Rush [build cache](@rushjs/pages/maintainer/build_cache/) feature released and documented
- [Artifactory integration](@rushjs/pages/maintainer/npm_registry_auth/)  for Rush
- Merge API Extractor to support `import * as ___ from "___";` namespaces ([issue #1029](https://github.com/microsoft/rushstack/issues/1029))
- Merge API Extractor to support `import()` type expressions ([issue #1050](https://github.com/microsoft/rushstack/issues/1050))
- Start a new [@rushstack/eslint-plugin-security](https://www.npmjs.com/package/@rushstack/eslint-plugin-security) package
- Improve Heft support for developing [Node.js services](https://rushstack.io/pages/heft_tasks/node-service/)


## In progress

Contributor availability is difficult to predict, so we try not to make commitments about when (or whether)
a particular feature will get implemented.  That said, here's some areas which people are actively working on:

<!-- things we expect to get to sooner go at the top -->

- Create a Heft plugin for StorybookJS
- Upgrade the Jest package used by Heft
- Upgrade the baseline TypeScript version to be 4.x
- Set up a [rushstack-samples](https://github.com/microsoft/rushstack-samples/) repo with fully worked out projects
  illustrating realistic usage patterns
- Share samples for using ReactNative with Rush+PNPM
- [Multi-project watch mode](@rushjs/pages/advanced/watch_mode/) for Rush
- Working towards a 1.0 release of Heft, to stabilize the config file and plugin API contracts


## Soon, hopefully

The Rush Stack maintainers currently see these feature areas as the main priorities for upcoming investments:

<!-- things we expect to get to sooner go at the top -->

- Multiphase builds for Rush
- Improve the design of Rush publishing (`rush publish`, `rush version`, `rush change`)


If there's a specific area that's important to you, let us know in the
[Zulip chat room](https://rushstack.zulipchat.com/).
And of course, even if a feature isn't listed on the road map, pull requests are always welcome!
