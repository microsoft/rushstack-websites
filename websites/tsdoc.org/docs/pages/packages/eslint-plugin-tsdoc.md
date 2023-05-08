---
layout: page
title: eslint-plugin-tsdoc
navigation_source: docs_nav
---

[NPM package](https://www.npmjs.com/package/eslint-plugin-tsdoc)<br/>
[CHANGELOG.md](https://github.com/microsoft/tsdoc/blob/main/eslint-plugin/CHANGELOG.md)

This ESLint plugin provides a rule for validating that TypeScript doc comments conform to the
[TSDoc specification](https://github.com/microsoft/tsdoc).

## Usage

1.  Configure ESLint for your TypeScript project. See the instructions provided by the
    [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) project.
    You will end up with some dependencies like this:

    **my-project/package.json** (example)

    ```ts
    {
      "name": "my-project",
      "version": "1.0.0",
      "dependencies": {},
      "devDependencies": {
        "@typescript-eslint/eslint-plugin": "~2.6.1",
        "@typescript-eslint/parser": "~2.6.1",
        "eslint": "~6.6.0",
        "typescript": "~3.7.2"
      },
      "scripts": {
        "lint": "eslint -f unix \"src/**/*.{ts,tsx}\""
      }
    }
    ```

2.  Add the **eslint-plugin-tsdoc** dependency to your project:

    ```bash
    $ cd my-project
    $ npm install --save-dev eslint-plugin-tsdoc
    ```

3.  In your ESLint config file, add the `"eslint-plugin-tsdoc"` package to your `plugins` field,
    and enable the `"tsdoc/syntax"` rule. For example:

    **my-project/.eslintrc.js** (example)

    ```ts
    module.exports = {
      plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      rules: {
        'tsdoc/syntax': 'warn'
      }
    };
    ```
