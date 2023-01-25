---
title: rush-pnpm
---

When using the PNPM package manager, Rush relocates the PNPM workspace under the `common/temp/` path.
It also injects some configuration hooks to support Rush-specific enhancements such as
[preferred versions](../advanced/preferred_versions.md) and faster incremental installation.

As a result, if you try to invoke the `pnpm` command directly in a Rush repo, it may fail because
it cannot find the `pnpm-workspace.yaml` file. Some operations may malfunction if they are
incompatible with Rush's enhancements.

To avoid these problems, use `rush-pnpm` in your Rush repo wherever you would normally use `pnpm`.
The `@microsoft/rush` NPM package includes the `rush-pnpm` binary, which is a drop-in replacement
for the `pnpm` command. It provides the following features:

- sets up the correct context/environment so that PNPM commands work correctly
- reports an error for operations that are known to be incompatible with Rush
- reports a warning for operations that may be unsafe with Rush
