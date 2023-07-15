---
title: Adding more tasks
---

_This section continues the tutorial project from the [Hello World](../tutorials/hello_world.md) tutorial._

Heft's [architecture](../intro/architecture.md) is designed around plugin packages. Heft ships with
a collection of [official plugin packages](../plugins/package_index.md) for the most common build tasks.
Their source code can be found in the [rushstack/heft-plugins](https://github.com/microsoft/rushstack/tree/main/heft-plugins)
which is a great reference, if you want to create your own Heft plugins.

Continuing our tutorial, let's enable the two most common plugins: [Jest](../plugins/jest.md) for unit tests
and [ESlint](../plugins/lint.md) for style checking.

## Adding unit tests to your project

1. First, we need to install the TypeScript typings for Jest. These steps continue the **my-app** project from the [Hello World](../tutorials/hello_world.md) tutorial. Recall that this project is not using Rush yet, so we will invoke PNPM directly to add the dependency to our **package.json** file (instead of using [rush add](@rushjs/pages/commands/rush_add/)):

   ```bash
   cd my-app

   # Because @types packages don't follow SemVer, it's a good idea to use --save-exact
   pnpm install --save-dev --save-exact @types/heft-jest
   pnpm install --save-dev @rushstack/heft-jest-plugin
   ```

2. Add a `"test"` section to your Heft config file, producing this result:

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

     "phasesByName": {
       // Define a phase whose name is "build"
       "build": {
         "phaseDescription": "This phase compiles the project source code.",

         // Before invoking the compiler, delete the "dist" and "lib" folders
         "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }],

         "tasksByName": {
           // Define a task whose name is "typescript"
           "typescript": {
             "taskPlugin": {
               // This task will invoke the TypeScript plugin
               "pluginPackage": "@rushstack/heft-typescript-plugin"
             }
           }
         }
       },

       // Define a phase whose name is "test"
       "test": {
         "phaseDescription": "This phase runs the project's unit tests.",

         // This phase requires the "build" phase to be run first
         "phaseDependencies": ["build"],

         "tasksByName": {
           // Define a task whose name is "jest"
           "jest": {
             "taskPlugin": {
                // This task will invoke the Jest plugin
                "pluginPackage": "@rushstack/heft-jest-plugin"
             }
           }
         }
       }
     }
   }
   ```

   _For complete descriptions of these settings, see [heft.json](../configs/heft_json.md) template._

   If you run `heft --help` you should now see `test` and `test-watch` command-line actions
   because our second phase was named `"test"`.

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
       "useUnknownInCatchVariables": false,
       "esModuleInterop": true,
       "noEmitOnError": false,
       "allowUnreachableCode": false,

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

   > **Note:** For web projects, you probably want to use
   > `@rushstack/heft-jest-plugin/includes/jest-web.config.json` instead of `jest-shared.config.json`
   > to support dual outputs as `lib-commonjs` and `lib` folders. See the [Jest plugin](../plugins/jest.md)
   > documentation for details.

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
   # View the command line help
   heft test --help

   # Build the project and run tests
   heft test --verbose

   # Run Jest in watch mode
   heft test-watch
   ```

   Wow, `heft test --help` has quite a lot of command-line parameters! Where did they come from?
   They were added by the Jest plugin's [heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/heft-plugin.json) manifest file because we loaded that plugin in our phase.

   (What happens if two different plugins define the same command-line parameter? Heft includes a sophisticated
   disambiguation mechanism, for example allowing you to use `--jest:update-snapshots` instead of `--update-snapshots`
   if some other plugin also defines a `--update-snapshots` parameter.)

7. We should update our **package.json** script so that `pnpm run test` will run the Jest tests:

   **my-app/package.json**

   ```
   {
     . . .
     "scripts": {
       "build": "heft build --clean",
       "test": "heft test --clean",
       "start": "node lib/start.js"
     },
     . . .
   }
   ```

> **Note:** Do not invoke the `jest` command line directly. Doing so would run the tests that it finds
> in `lib/**/*.js`, but it will not invoke Heft's other tasks needed to update those output files.

That's it for setting up Jest! Further information, including instructions for debugging tests, can be found in the [Jest plugin](../plugins/jest.md) reference and the [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) sample project.

## Enabling linting

1. To ensure best practices and catch common mistakes, let's also enable the [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) standard ruleset. First we need to add a few more NPM dependencies to our **package.json** file.

   ```bash
   cd my-app

   # Add the ESLint engine
   pnpm install --save-dev eslint

   # Add Heft's plugin for ESLint
   pnpm install --save-dev @rushstack/heft-lint-plugin

   # Add Rush Stack's all-in-one lint ruleset
   pnpm install --save-dev @rushstack/eslint-config
   ```

2. Update your Heft config file to add a task that loads `@rushstack/heft-lint-plugin` during the `heft build` phase:

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

     "phasesByName": {
       // Define a phase whose name is "build"
       "build": {
         "phaseDescription": "Compiles the project source code",

         // Before invoking the compiler, delete the "dist" and "lib" folders
         "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }],

         "tasksByName": {
           // Define a task whose name is "typescript"
           "typescript": {
             "taskPlugin": {
               // This task will invoke the TypeScript plugin
               "pluginPackage": "@rushstack/heft-typescript-plugin"
             }
           },

           // Define a task whose name is "lint"
           "lint": {
            // This task should run after "typescript" has completed
            // because Heft optimizes ESLint by reusing the TypeScript
            // compiler's AST analysis
            "taskDependencies": ["typescript"],
            "taskPlugin": {
              // This task will invoke the ESLint plugin
              "pluginPackage": "@rushstack/heft-lint-plugin"
            }
          }
         }
       },
       // Define a phase whose name is "test"
       "test": {
         // This phase requires the "build" phase to be run first
         "phaseDependencies": ["build"],
         "tasksByName": {
           // Define a task whose name is "jest"
           "jest": {
             "taskPlugin": {
                // This task will invoke the Jest plugin
                "pluginPackage": "@rushstack/heft-jest-plugin"
             }
           }
         }
       }
     }
   }
   ```

   _For complete descriptions of these settings, see [heft.json](../configs/heft_json.md) template._

3. Next, create the [.eslintrc.js](https://eslint.org/docs/user-guide/configuring) config file. For this tutorial we'll just use the official Rush Stack ruleset:

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

4. To test it out, try updating your **start.ts** source file to introduce a lint issue:

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f() {
     // <--- oops
   }
   ```

   When you run `pnpm run build`, you should see a log message like this:

   ```
   -------------------- Finished (3.555s) --------------------
   Encountered 1 warning
   [build:lint] src/start.ts:3:8 - (@typescript-eslint/explicit-function-return-type) Missing return type on function.
   ```

   To fix the problem, fix the code to add the missing return type, and it should now build successfully:

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f(): void {
     // <--- okay
   }
   ```

5. The `@rushstack/eslint-config` ruleset is designed to work together with the Prettier code formatter.
   To set that up, see the [Enabling Prettier](@rushjs/pages/maintainer/enabling_prettier/) article
   on the Rush website.

That's it for ESLint! More detail can be found in the [Lint plugin](../plugins/lint.md) reference.
