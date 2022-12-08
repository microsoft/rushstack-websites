---
title: What is Rush Stack?
hide_title: true
---

## What is Rush Stack?

**Rush Stack** is a...

- **Mission** to provide reusable tech for running large scale monorepos for the web
- **Open collaboration** among community partners with serious tooling requirements, who got tired of going it alone
- **Specific strategy** that integrates popular tools like Node.js, TypeScript, ESLint, Prettier, Webpack, Jest, etc.
- **Family of projects** that fill in the gaps for this strategy

Although various pieces of this work have been underway for years, we're now bringing them together under a common charter as **Rush Stack**. Track our progress on the [News](pages/news.md) page and [Roadmap](pages/overview/roadmap.md).

## What's in the stack?

These major tools are developed under the **Rush Stack** umbrella:

- [Rush](@rushjs/): the scalable monorepo build orchestrator
- [Heft](./pages/heft/overview.md): an extensible build system that interfaces with Rush
- [API Extractor](@api-extractor/): coordinates API reviews for library packages, and generates .d.ts rollups
- [API Documenter](@api-extractor/pages/setup/generating_docs): generates your API documentation website
- [@<!---->rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config): our standardized
  ESLint rule set, specifically designed for large scale TypeScript monorepos
- [@<!---->rushstack/eslint-plugin-packlets](https://www.npmjs.com/package/@rushstack/eslint-plugin-packlets):
  "Packlets" are a lightweight alternative to NPM packages for organizing source files within a single project
- [Lockfile Explorer](https://www.npmjs.com/package/@rushstack/lockfile-explorer): helps you investigate and solve version conflicts when working in a Rush monorepo
- [Rundown](https://www.npmjs.com/package/@rushstack/rundown): a tool for optimizing Node.js process startup times

The projects are built on a common framework of reusable library packages, which includes:

- [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line): a strict command-line parser
  whose options/docs can be augmented by toolchain packages with built-in support for tab-completion on PowerShell and Bash
- [node-core-library](https://www.npmjs.com/package/@rushstack/node-core-library): the core framework
  used by all our projects
- [package-deps-hash](https://www.npmjs.com/package/@rushstack/package-deps-hash): the incremental build engine
  used by Rush
- [rig-package](https://www.npmjs.com/package/@rushstack/rig-package): a system for sharing tool configurations between projects without duplicating config files
- [stream-collator](https://www.npmjs.com/package/@rushstack/stream-collator): the magic behind how Rush can
  display real-time log output from concurrent tasks, without ugly interleaving of the output
- [tree-pattern](https://www.npmjs.com/package/@rushstack/tree-pattern): a pattern matcher for JavaScript tree structures, used by our lint rules
- [a family of webpack plugins](https://github.com/microsoft/rushstack/tree/main/webpack) useful for building web applications

## What's the relationship to Rush?

The "Rush Stack" components are optional extras that you can use with [Rush](@rushjs/).

As a **build orchestrator,** Rush's job is to:

- Ensure deterministic and reliable package installations (using Yarn, PNPM, or NPM)
- Build your projects in the right order, as fast as possible
- Apply policies to keep your monorepo running smoothly
- Manage your publishing workflows
- Establish a standard repo layout and familiar CLI, to facilitate developers who contribute to many different monorepos

Beyond this role, Rush leaves the rest up to you. Individual projects can build with any tool chain you like.
This is very flexible!

But flexibility has its downsides. Node.js tooling is notorious for its bewildering array of options:
Choose your compiler. Choose your linter. Choose your bundler, your package manager, your task engine,
test runner, test assertion library, and so on. Once you've placed your bets, integrating all these pieces
turns out to be a software project of its own. As you scale up, these costs can add up fast!

In summer of 2019, we launched **Rush Stack** with the aim to provide a reusable solution for this broader set of problems. You can still use Rush by itself, of course. But if you're tired of going it alone, we invite you to:

- Trade your flexibility for an opinionated approach backed by tooling experts who run huge monorepos
- Join forces with the open community that's investing in this approach
- Help us to "go deep" with integrations, optimizations, documentation, and polish to achieve a world class developer experience
