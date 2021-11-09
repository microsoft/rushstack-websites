---
title: '"typescript" task'
---

This task invokes the compiler for the [TypeScript](https://www.typescriptlang.org/) programming language.


## When to use it

TypeScript is the standard programming language for Rush Stack.  There are many benefits to having one "lingua franca" across all coding investments, rather than having to maintain different expertise and libraries for different languages.

We recommend TypeScript for:

- **Application development:** It's even a good choice for prototypes and small experiments.
- **Tooling infrastructure:** A great developer experience multiplies everyone's productivity, so build tools should be treated as first-class software projects with their own designs, documentation, and tests.
- **Device apps:** Where possible, TypeScript can also be used for native development via runtime hosts such as [React Native](https://reactnative.dev/).
- **Desktop apps:** There are also runtime hosts such as [Electron](https://www.electronjs.org/) for making desktop apps.

Obviously certain components may inevitably require Java, C++, Swift, etc.  But ideally developers should not be required to install native SDKs unless they're working on those components.  The [Expo client](https://expo.io/features) takes this concept to an extreme, enabling you to compile and run a phone app without installing native tools at all.  This ideal isn't always feasible in practice, of course.  It's a mentality, not a dogma.  The main point is that there are significant benefits to normalizing the code base so that any engineer can easily contribute to any project, and any project can load any library.


## package.json dependencies

You will need to add the `typescript` package to your project:

```bash
$ rush add --package typescript --dev
```

Alternatively, you can avoid this dependency by loading it from a "rig package", as described in the [Interfacing with Rush](../heft_tutorials/heft_and_rush) article.

If your **tsconfig.json** enables `"importHelpers": true` for more efficient transpiler output, you may also need a dependency on **tslib**:

```bash
$ rush add --package tslib
```


## Config files

The primary configuration comes from TypeScript's [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file.

For advanced scenarios, Heft also provides an optional [typescript.json](../heft_configs/typescript_json) config file that can be used to configure toolchain features such as multiple emit targets for the TypeScript compiler.
