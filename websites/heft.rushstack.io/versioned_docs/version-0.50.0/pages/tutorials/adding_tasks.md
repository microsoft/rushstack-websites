---
title: Adding more tasks
---

_This section continues the tutorial project from the [Getting started with Heft](../tutorials/getting_started.md) article._

Heft comes with a number of built-in tasks that become enabled automatically based on config files that you create.
All the tasks are documented in the [Heft tasks](../tasks/api-extractor.md) section.

Continuing our tutorial, let's enable the two most common tasks: [Jest](../tasks/jest.md)
and [ESlint](../tasks/eslint.md).

## Adding unit tests to your project

1. First, we need to install the TypeScript typings for Jest. These steps continue the **my-app** project from the [Getting started with Heft](../tutorials/getting_started.md) article. Recall that this project is not using Rush yet, so we will invoke PNPM directly to add the dependency to our **package.json** file (instead of using [rush add](@rushjs/pages/commands/rush_add/)):

   ```bash
   cd my-app

   # Typings should always use "--save-exact" version specifiers.
   pnpm install --save-dev --save-exact @types/heft-jest
   pnpm install --save-dev @rushstack/heft-jest-plugin
   ```

2. Register the plugin to heft.json and add it to the plugin statement.

```bash
 "heftPlugins": [
  {
    //  /**
    //   * The path to the plugin package.
    //   */
    "plugin": "@rushstack/heft-jest-plugin"
    //
    //  /**
    //   * An optional object that provides additional settings that may be defined by the plugin.
    //   */
    //  // "options": { }
  }
]
```

3. Since [Jest's API](https://jestjs.io/docs/en/api) consists of global variables, we need to load them globally (whereas most other `@types` packages are loaded via `import` statements in your source code). Update your **tsconfig.json** file to say `"types": ["heft-jest", "node"]` instead of just `"types": ["node"]`. The result should look like this:

   **my-app/tsconfig.json**

   ```js
   {
     "$schema": "http://json.schemastore.org/tsconfig",

     "compilerOptions": {
       "outDir": "lib",
       "rootDirs": ["src/"],

       "forceConsistentCasingInFileNames": true,
       "declaration": true,
       "sourceMap": true,
       "declarationMap": true,
       "inlineSources": true,
       "experimentalDecorators": true,
       "strict": true,
       "esModuleInterop": true,
       "types": ["heft-jest", "node"],

       "module": "commonjs",
       "target": "es2017",
       "lib": ["es2017"]
     },
     "include": ["src/**/*.ts"],
     "exclude": ["node_modules", "lib"]
   }
   ```

4. Next, we need to add the [jest.config.json](https://jestjs.io/docs/en/configuration) config file. The presence of this file causes Heft to invoke the Jest test runner. Heft expects a specific file path **config/jest.config.json**. For most cases, your Jest configuration should simply extend Heft's standard preset as shown below:

   **my-app/config/jest.config.json**

   ```js
   {
    "extends": "@rushstack/heft-jest-plugin/includes/jest-shared.config.json",
    "collectCoverage": true,
    "coverageThreshold": {
     "global": {
       "branches": 50,
       "functions": 50,
       "lines": 50,
       "statements": 50
       }
     }
   }
   ```

5. Now we need to add a unit test. Jest supports quite a lot of features, but for this tutorial we'll create a trivial test file. The `.test.ts` file extension causes Heft to look for unit tests in this file:

   **my-app/src/example.test.ts**

   ```ts
   describe('Example Test', () => {
     it('correctly runs a test', () => {
       expect(true).toBeTruthy();
     });
   });
   ```

6. To run the test, we need to use the `heft test` action, because `heft build` normally skips testing to speed up development.

   ```bash
   # For Windows, use backslashes for all these commands

   # View the command line help
   heft test --help

   # Build the project and run tests
   heft test
   ```

   We should update our **package.json** script to invoke `heft test` instead of `heft build` as well. That way `pnpm run build` will also run the Jest tests:

   **my-app/package.json**

   ```
   {
     . . .
     "scripts": {
       "build": "heft test --clean",
       "start": "node lib/start.js"
     },
     . . .
   }
   ```

> **Note:** Do not invoke the `jest` command line directly, since it only runs tests and will not perform Heft's other build steps.

That's it for setting up Jest! Further information, including instructions for debugging tests, can be found in the ["jest" task](../tasks/jest.md) reference and the [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) sample project.

## Enabling linting

1. To ensure best practices and catch common mistakes, let's also enable the [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) standard ruleset. First we need to add a few more NPM dependencies to our **package.json** file.

   ```bash
   cd my-app

   # Add the ESLint engine.
   pnpm install --save-dev eslint

   # Add Rush Stack's all-in-one ruleset
   pnpm install --save-dev @rushstack/eslint-config
   ```

2. Next, create the [.eslintrc.js](https://eslint.org/docs/user-guide/configuring) config file. The presence of this file causes Heft to invoke the ESLint task.:

   **my-app/.eslintrc.js**

   ```js
   // This is a workaround for https://github.com/eslint/eslint/issues/3458
   require('@rushstack/eslint-config/patch/modern-module-resolution');

   module.exports = {
     extends: ['@rushstack/eslint-config/profile/node'],
     parserOptions: { tsconfigRootDir: __dirname }
   };
   ```

   _Note: If your project uses the [React](https://reactjs.org/) framework, you should also extend from the `"@rushstack/eslint-config/mixins/react"` mixin. See [the documentation](https://www.npmjs.com/package/@rushstack/eslint-config) for details about `@rushstack/eslint-config` "profiles" and "mixins"._

3. To test it out, try updating your **start.ts** source file to introduce a lint issue:

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f() {
     // <--- oops
   }
   ```

   When you run `pnpm run build`, you should see a log message like this:

   ```
   . . .
   ---- Compile started ----
   [copy-static-assets] Copied 0 static assets in 0ms
   [typescript] Using TypeScript version 3.9.7
   [eslint] Using ESLint version 7.5.0
   [eslint] Encountered 1 ESLint error:
   [eslint]   ERROR: src\start.ts:3:8 - (@typescript-eslint/explicit-function-return-type) Missing return type on function.
   . . .
   ```

   To fix the problem, fix the code to add the missing return type, and it should now build successfully:

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f(): void {
     // <--- okay
   }
   ```

4. The `@rushstack/eslint-config` ruleset is designed to work together with the Prettier code formatter.
   To set that up, see the [Enabling Prettier](@rushjs/pages/maintainer/enabling_prettier/) article
   on the Rush website.

That's it for ESLint! More detail can be found in the [eslint task](../tasks/eslint.md) reference.
