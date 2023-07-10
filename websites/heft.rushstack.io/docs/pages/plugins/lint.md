---
title: ESlint / TSLint plugins
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-lint-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-lint-plugin) |
| **Plugin name:** | [lint-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-lint-plugin/heft-plugin.json) implemented by [LintPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-lint-plugin/src/LintPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This plugin invokes the [ESLint](https://eslint.org/) or [TSLint](https://palantir.github.io/tslint/) linters, which check your code for stylistic issues and common mistakes.

## When to use it

TSLint is deprecated (see below). We recommend to use ESLint for all projects, as part of the following combined approach to code validation:

- [Prettier](@rushjs/pages/maintainer/enabling_prettier/): This tool manages trivial syntax aspects such as spaces, commas, and semicolons. Because these aspects normally don't affect code semantics, we never bother the developer with error messages about it, nor is it part of the build. Instead, Prettier reformats the code automatically via a `git commit` hook. To set this up, see the [Enabling Prettier](@rushjs/pages/maintainer/enabling_prettier/) tutorial on the Rush website.

- [TypeScript](../plugins/typescript.md): The TypeScript compiler performs sophisticated type checking and semantic analysis that is the most important safeguard for program correctness.

- **ESLint**: The lint rules supplement the compiler's checks with additional stylistic rules that are more subjective and highly customizable. Whereas TypeScript might detect that _"This function parameter is a string but was declared as a number"_, the linter might detect an issue such as _"This class name should use PascalCase instead of camelCase."_ However operationally ESLint's validation is very similar to type checking, and some ESLint rules require TypeScript semantic analysis, which may depend on project-specific compiler configurations. Therefore we recommend to run ESLint as part of the build, not as a Git commit hook or global analysis.

- [API Extractor](../plugins/api-extractor.md): This is an additional validation check for library packages only. It ensures their API contracts are well-formed and properly documented.

Although it's recommended to set up your build system in this way, Heft doesn't enforce a particular approach. Each of these components is optional, and other configurations are possible. For example, older code bases may need to use TSLint instead of ESLint.

## package.json dependencies

You will need to add the `eslint` package to your project:

```bash
rush add --package eslint --dev
```

Alternatively, you can avoid this dependency by loading it from a "rig package", as described in the [Interfacing with Rush](../tutorials/heft_and_rush.md) article. However, if you use the [ESLint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), it will try to resolve the `eslint` package from your project folder. Thus it may still be useful to add ESLint to your **package.json** file. (The extension is able to load a globally installed `eslint` package; however, its version may not match the version required by the local branch.)

## Config files

There isn't a Heft-specific file for this task. Heft looks for ESLint's config file. Although ESLint supports [7 different](https://eslint.org/docs/user-guide/configuring#configuration-file-formats) names/formats for this file, Heft requires it to be named **".eslintrc.js"**. This has a couple benefits:

- **Consistency:** Using one standard name **".eslintrc.js"** makes it easy to search for these files, perform bulk edits, and copy configuration recipes between projects.
- **Workarounds:** Using the `.js` file extension enables JavaScript expressions in the file. This practice is generally discouraged because code expressions are harder to validate, and expressions can depend on environmental inputs that are invisible to caches. However, for historical reasons, ESLint's config file format has some limitations that can only be solved with scripts (for example using `__dirname` to resolve file paths).

It's not recommended to place a centralized **.eslintrc.js** in the monorepo root folder. This violates Rush's principle that projects should be independent and easily movable between monorepos.

Instead, each project should have its own **.eslintrc.js** file. We recommend to use the [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) shared configuration, which is specifically tailored for large scale monorepos, and based on the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) parser and ruleset. If you need additional custom lint rules, it's recommended to create a custom NPM package that extends from `@rushstack/eslint-config`.

With this approach, a typical ESLint config file will have very minimal boilerplate. For example:

**&lt;project folder&gt;/.eslintrc.js**

```ts
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/node'],
  parserOptions: { tsconfigRootDir: __dirname }
};
```

### Profiles and mixins

The `@rushstack/eslint-config` package currently provides three different **lint profiles**. Choose one:

- `@rushstack/eslint-config/profile/node` - for Node.js services
- `@rushstack/eslint-config/profile/node-trusted-tool` - for Node.js tools
- `@rushstack/eslint-config/profile/web-app` - for web browser applications

It also supports **lint mixins**. Add as many as you like:

- `@rushstack/eslint-config/mixins/react` - if you use the React framework
- `@rushstack/eslint-config/mixins/friendly-locals` - if you prefer more verbose declarations to make
- `@rushstack/eslint-config/mixins/tsdoc` - if you are using API Extractor in your workspace

The [@rushstack/eslint-config documentation](https://www.npmjs.com/package/@rushstack/eslint-config) explains these options in more detail.

## TSLint

The [TSLint](https://palantir.github.io/tslint/) tool predates ESLint and is now deprecated, but may still be used in some older code bases.

The `lint-plugin` supports both tools: If `<project folder>/tslint.json` is found, then TSLint will be invoked. If both config files are present, then both TSLint and ESLint will be invoked.
