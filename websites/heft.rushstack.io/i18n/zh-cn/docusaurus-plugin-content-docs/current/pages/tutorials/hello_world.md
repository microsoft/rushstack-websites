---
title: Hello world
---

This walkthrough will get you started with Heft by creating a basic Node.js console project from scratch,
adding each task step by step. In practice, **you would probably want to use a readymade rig instead.**
This tutorial's goal is to illustrate the fundamental concepts and architecture of Heft. With this foundation,
you can more easily understand complex configurations and troubleshoot any problems that arise.

> **_"Show me the code!"_**
>
> If you're in a hurry, the
> [heft-node-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-basic-tutorial)
> and [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial)
> folders illustrate a fully worked out example of a simple project that builds using Heft.
>
> The [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial)
> and [heft-web-rig-app-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-web-rig-app-tutorial)
> folders show how to accomplish the same result by using Rush Stack rigs, rather than a manual Heft configuration.
> Rigs enable many projects to share a standard configuration, which greatly reduces maintenance cost of upgrades.

We'll begin by creating a simple standalone project without Rush. (Later, the [Interfacing with Rush](../tutorials/heft_and_rush.md) tutorial will examine what's different when using Heft in a monorepo.)

1. We'll use the [PNPM package manager](https://pnpm.js.org/) for this demo. Its command line is very similar to NPM, so you could substitute `npm` for `pnpm` in these steps. There are [various ways](https://pnpm.io/installation) to install PNPM, but the simplest is like this:

   ```bash
   npm install --global pnpm
   ```

2. Create a new folder **my-app** with a **package.json** file for our project, like this:

   **my-app/package.json**

   ```
   {
     "name": "my-app",
     "version": "1.0.0",
     "description": "A Heft tutorial project",
     "license": "MIT",
     "main": "lib/start.js",
     "typings": "lib/start.d.ts",
     "scripts": {
       "start": "node lib/start.js"
     }
   }
   ```

3. Create a TypeScript source file that we'll compile.

   **my-app/src/start.ts**

   ```
   console.log("Hello, world!");
   ```

4. Install [@rushstack/heft](https://www.npmjs.com/package/@rushstack/heft), [@rushstack/heft-typescript-plugin](https://www.npmjs.com/package/@rushstack/heft-typescript-plugin), and [typescript](https://www.npmjs.com/package/typescript) as `devDependenices` for your project:

   ```bash
   cd my-app
   pnpm install --save-dev @rushstack/heft
   pnpm install --save-dev @rushstack/heft-typescript-plugin
   pnpm install --save-dev typescript

   # Since this project will use the console.log() API, we also need to add the TypeScript
   # typings for Node.js.  Typings should always use "--save-exact" version specifiers.
   pnpm install --save-dev --save-exact @types/node
   ```

5. Next we need to create the TypeScript [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file. The presence of this file causes Heft to invoke the TypeScript compiler. For now we'll create a simple standalone **tsconfig.json** file; later we'll demonstrate how to share a reusable configuration across many projects.

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

       "types": ["node"],
       "module": "commonjs",
       "target": "es2017",
       "lib": ["es2017"]
     },
     "include": ["src/**/*.ts"],
     "exclude": ["node_modules", "lib"]
   }
   ```

   Note that `"types": ["node"]` references the `@types/node` package that we installed above. This is needed
   because Node.js is a global environment, so its typings must be loaded globally. Most other `@types` packages
   can be loaded via `import` statements in your source code.

   See the [TypeScript plugin](../plugins/typescript.md) documentation for more background about
   TypeScript configuration with Heft.

6. You can invoke Heft using `./node_modules/.bin/heft`, but it's more convenient to also install it globally
   so that it's always available in your shell `PATH`:

   ```bash
   # Install the Heft tool globally
   npm install --global @rushstack/heft
   ```

   > What if the globally installed `heft` binary is the wrong version?
   >
   > Just like Rush, Heft implements a "version selector" feature that will automatically
   > discover your local `node_modules` folder and invoke `./node_modules/.bin/heft`, ensuring
   > that the correct version is used.

7. Heft is config-driven, which means its behavior within a project folder is defined by data
   (config files) not code (arbitrary scripts). If you need to extend your build process with program logic,
   we strongly encourage moving that code into a Heft plugin package, which should be developed as
   professional software using TypeScript, ESLint, and code reviews. This is more work, but as your
   monorepo grows in scale, it greatly simplifies maintenance.

   Heft's main config file is [config/heft.json](../configs/heft_json.md). Let's start with the
   simplest possible file:

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
   }
   ```

   If you run `heft --help` you should see output like this:

   ```
   usage: heft [-h] [--debug] [--unmanaged] <command> ...

   Heft is a pluggable build system designed for web projects.

   Positional arguments:
     <command>
       clean      Clean the project, removing temporary task folders and
                 specified clean paths.
       run        Run a provided selection of Heft phases.
       run-watch  Run a provided selection of Heft phases in watch mode..

   Optional arguments:
     -h, --help   Show this help message and exit.
   ```

8. Now let's expand our configuration by adding a simple phase called `"build"` that invokes
   a task called `"typescript"` to compile your code. (For definitions of these terms,
   refer to the [architecture](../intro/architecture.md) notes.)

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
       }
     }
   }
   ```

   _For complete descriptions of these settings, see [heft.json](../configs/heft_json.md) template._

   If you run `heft --help`, you will now see that a `build` and `build-watch`
   action have been added to your command line, since our phase was called `"build"`:

   ```
   usage: heft [-h] [--debug] [--unmanaged] <command> ...

   Heft is a pluggable build system designed for web projects.

   Positional arguments:
     <command>
       clean      Clean the project, removing temporary task folders and
                 specified clean paths.
       run        Run a provided selection of Heft phases.
       build      Runs to the build phase, including all transitive dependencies.
       run-watch  Run a provided selection of Heft phases in watch mode..
       build-watch
                 Runs to the build phase, including all transitive dependencies,
                   in watch mode.

   Optional arguments:
     -h, --help   Show this help message and exit.
   ```

   The `"phaseDescription"` is printed if you run `heft build --help`.

9. Let's try invoking Heft's [command line](../intro/cli.md) to build our project.

   ```bash
   # Make sure we're in your project folder
   cd my-app

   # View the command line help
   heft --help
   heft build --help

   # Build the project
   heft build

   # To see more detail about what Heft is doing, add you can the "--verbose" flag
   heft build --verbose
   ```

   Invoking `heft build --verbose` should produce console output like this:

   ```
   Project: my-app@1.0.0
   Project build folder: C:\my-app
   Heft version: 0.56.2
   Node version: v16.15.1

   Executing a maximum of 4 simultaneous tasks...
   ---- lifecycle started ----
   [lifecycle:start] Applying lifecycle plugins
   ---- build started ----
   [build] Applying task plugins
   [build:typescript] Loaded plugin from "C:\my-app\node_modules\...\@rushstack\heft-typescript-plugin\lib\TypeScriptPlugin"
   [build:typescript] Starting task execution
   [build:typescript] Looking for tsconfig at C:/my-app/tsconfig.json
   [build:typescript] Resolved "typescript" as a direct devDependency of the project.
   [build:typescript] Using TypeScript version 5.1.6
   [build:typescript] Configure: 17.34340000152588ms
   [build:typescript] I/O Read: 16.67810034751892ms (98 files)
   [build:typescript] Parse: 491.7621006965637ms (98 files)
   [build:typescript] Program (includes Read + Parse): 581.9542999267578ms
   [build:typescript] Analyze: 1135.4448999166489ms
   [build:typescript] Bind: 189.5981993675232ms
   [build:typescript] Check: 929.5596989393234ms
   [build:typescript] Transform: 4.200200080871582ms (2 files)
   [build:typescript] Print: 12.058799982070923ms (1 files) (Includes Transform)
   [build:typescript] Emit: 12.5ms (Includes Print)
   [build:typescript] I/O Write: 0ms (0 files)
   [build:typescript] Finished task execution (1964.6486999988556ms)
   ---- build finished (2.014s) ----
   ---- lifecycle finished (2.018s) ----
   -------------------- Finished (2.02s) --------------------
   ```

   > NOTE: When reporting diagnostic messages such as a compile error, Heft prints file paths relative
   > to the project folder. This can be customized using the
   > [RUSHSTACK_FILE_ERROR_BASE_FOLDER](../configs/environment_vars.md#rushstack_file_error_base_folder)
   > environment variable.

   After the build finishes, confirm that it produced several output files in your `lib` folder:

   - **start.js** - the compiled JavaScript code
   - **start.d.ts** - the TypeScript typings, for external libraries that might import this module
   - **start.js.map** and **start.d.ts.map** - Source map files, which enable tools like debuggers to find the corresponding source code file/line, for a given item in an output file

10. If you recall, our **package.json** file has a `"scripts"` section that specifies `"start": "node lib/start.js"`. Let's try running the compiled code using `pnpm run`.

    ```bash
    # Invoke the "start" script from package.json
    pnpm run start

    # If you have Rush installed, you can also use this slightly shorter equivalent
    rushx start
    ```

    You should see output like this:

    ```
    > my-app@1.0.0 start C:\my-app
    > node lib/start.js

    Hello, world!
    ```

11. We can also add a `"build"` script to our **package.json** file:

    **my-app/package.json**

    ```
    {
      . . .
      "scripts": {
        "build": "heft build --clean",
        "start": "node lib/start.js"
      },
      . . .
    }
    ```

    With this change, you can also build by invoking `pnpm run build` (or `rushx build`). This toolchain-agnostic
    convention makes it easier for newcomers to guess how to build your project. It will also be useful later when
    we integrate with Rush.
