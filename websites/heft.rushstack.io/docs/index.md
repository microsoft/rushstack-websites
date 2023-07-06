---
title: Overview
hide_title: true
---

<div>
  <img src="/images/site/heft-logo.svg" alt="heft" title="heft" style={{ width: '380px', paddingTop: '30px' }} />
  <p />
</div>

<!-- --------------------------------------------------------------------------- -->
<!-- Text below this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->

Heft is a config-driven toolchain that invokes other popular tools such as TypeScript, ESLint, Jest, Webpack,
and API Extractor. You can use it to build web applications, Node.js services, command-line tools, libraries,
and more. Heft builds all your JavaScript projects the same way: A way that works.

Heft is typically launched by the `"build"` action from a **package.json** file. It's designed for use in
a monorepo with potentially hundreds of projects, where the [Rush](@rushjs/) orchestrator invokes
a `"build"` action separately in each project folder. In this situation, everything must execute as fast as possible.
Special purpose scripts become a headache to maintain, so it's better to replace them with a reusable engine that's
driven by config files. In a large repo, you'll want to minimize duplication of these config files across projects.
Ultimately, you'll want to define a small set of stereotypical project types
(["rigs"](https://rushstack.io/pages/heft/rig_packages/)) that you will maintain, then discourage projects from
overriding the rig configuration. Being consistent ensures that any person can easily contribute to any project.
Heft is a ready-made implementation of all these concepts.

You don’t need a monorepo to use Heft, however. It also works well for small standalone projects. Compared to other
similar systems, Heft has some unique design goals:

- **Scalable**: Heft interfaces with the [Rush Stack](https://rushstack.io/) family of tools, which are tailored
  for large monorepos with many people and projects. Heft doesn't require Rush, though.

- **Optimized**: Heft tracks fine-grained performance metrics at each step. Although Heft is still in its
  early stages, the TypeScript plugin already implements sophisticated optimizations such as: filesystem caching,
  incremental compilation, symlinking of cache files to reduce copy times, hosting the compiler in a separate
  worker process, and a unified compiler pass for Jest and Webpack.

- **Complete**: Rush Stack aspires to establish a fully worked out solution for building typical TypeScript
  projects. Unopinionated task abstractions often work against this goal: It is expensive to optimize and support
  (and document!) every possible cocktail of tech choices. The best optimizations and integrations
  make lots of assumptions about how tasks will interact. Heft is opinionated. Our aim is to agree on a recommended
  toolkit that works well for a broad range of scenarios, then work together on the deep investments that will
  make that a great experience.

- **Extensible**: Most projects require at least a few specialized tasks such as preprocessors, postprocessors,
  or loaders. Heft is composed of plugins using the [tapable](https://www.npmjs.com/package/tapable)
  hook system (familiar from Webpack). It's easy to write your own plugins. Compared to loose architectures
  such as Grunt or Gulp, Heft ships a predefined arrangement of "stages" that custom tasks hook into. Having
  a standardized starting point makes it easier to get technical support for customized rigs.

- **Familiar**: Like Rush, Heft is a regular Node.js application -- developers don't need to install native
  prerequisites such as Python, MSYS2, or the .NET Framework. Heft's source code is easy to understand and debug
  because it's 100% TypeScript, the same programming language as your web projects. Developing for native targets
  is still possible, of course.

- **Professional**: The Rush Stack projects are developed by and for engineers who ship major commercial services.
  Each feature is designed, discussed in the open, and thoughtfully code reviewed. Despite being a free community
  collaboration, this software is developed with the mindset that we'll be depending on it for many years to come.

<!-- --------------------------------------------------------------------------- -->
<!-- Text above this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->

## Sample projects

For a couple quick examples of Heft projects in a real Rush monorepo, take a look at these folders:

- [heft-node-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-basic-tutorial): A basic Node.js
  application with Jest and ESLint

- [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial): A basic
  web application bundled using Webpack
