---
title: '"eslint" task'
---

This task invokes the [ESLint](https://eslint.org/) tool which reports errors about common coding problems.

## When to use it

ESLint fits together with several other tools as part of Rush Stack's recommended strategy for code validation:

- [Prettier](@rushjs/pages/maintainer/enabling_prettier/): This tool manages trivial syntax aspects such as spaces, commas, and semicolons. Because these aspects normally don't affect code semantics, we never bother the developer with error messages about it, nor is it part of the build. Instead, Prettier reformats the code automatically via a `git commit` hook. To se this up, see the [Enabling Prettier](@rushjs/pages/maintainer/enabling_prettier/) tutorial on the Rush website.

- [TypeScript](../heft_tasks/typescript.md): The TypeScript compiler performs sophisticated type checking and semantic analysis that is the most important safeguard for program correctness.

- **ESLint**: The lint rules supplement the compiler's checks with additional stylistic rules that are more subjective and highly customizable. Whereas TypeScript might detect that _"This function parameter is a string but was declared as a number"_, the linter might detect an issue such as _"This class name should use PascalCase instead of camelCase."_ Unlike Prettier issues, fixing an ESLint issue may involve a significant code change, and may even break an API contract.

- [API Extractor](../heft_tasks/api-extractor.md): This is an additional validation check for library packages only. It ensures their API contracts are well-formed and properly documented.

Although it's recommended to set up your build system in this way, Heft doesn't require a particular approach. Each of these components is optional, and other configurations are possible. For example, older code bases may need to use [TSLint](../heft_tasks/tslint.md) instead of ESLint.

## package.json dependencies

You will need to add the `eslint` package to your project:

```bash
rush add --package eslint --dev
```

Alternatively, you can avoid this dependency by loading it from a "rig package", as described in the [Interfacing with Rush](../heft_tutorials/heft_and_rush.md) article. However, if you use the [ESLint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), it will try to resolve the `eslint` package from your project folder. Thus it may still be useful to add ESLint to your **package.json** file. (The extension is able to load a globally installed `eslint` package; however, its version may not match the version required by the local branch.)

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
