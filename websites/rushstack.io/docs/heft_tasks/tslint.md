---
title: '"tslint" task'
---

This task invokes the [TSLint](https://palantir.github.io/tslint/) tool for linting TypeScript code.


## When to use it

**TSLint is deprecated and should only be used for legacy projects.**  In 2019, the groups that maintain the TypeScript compiler, ESLint, and TSLint got together and agreed [to deprecate TSLint](https://medium.com/palantir/tslint-in-2019-1a144c2317a9).  Instead, a TypeScript parser has been integrated into ESLint, which provides a single unified solution for linting JavaScript and TypeScript source files.

New projects should use the [eslint](/heft_tasks/eslint) task instead.


## package.json dependencies

You will need to add the `tslint` package to your project:

```bash
$ rush add --package tslint --dev
```

Alternatively, you can avoid this dependency by loading it from a "rig package", as described in the [Using rig packages](/heft/rig_packages) article.


## Config files

There isn't a Heft-specific file for this task.  Heft looks for TSLint's config file [tslint.json](https://palantir.github.io/tslint/usage/configuration/).
