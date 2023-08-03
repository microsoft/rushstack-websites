---
title: Hello world
---

此教程将通过从头开始创建一个基础的 Node.js 控制台项目，逐步添加每个任务来帮助你开始使用 Heft。实际上，**你可能更倾向于使用预制的 rig**。此教程的目标是阐述 Heft 的基础概念和架构。有了这个基础，你可以更轻松地理解复杂的配置，并解决任何出现的问题。

> **_"给我看代码！"_**
>
> 如果你赶时间，可以查看
> [heft-node-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-basic-tutorial)
> 和 [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial)
> 文件夹，这些文件夹展示了一个简单的使用 Heft 构建的完全实例化的项目。
>
> [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial)
> 和 [heft-web-rig-app-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-web-rig-app-tutorial)
> 文件夹展示了如何使用 Rush Stack rigs 而不是手动 Heft 配置来实现相同的结果。
> Rig 允许多个项目共享标准配置，大大降低了升级的维护成本。

我们首先创建一个不使用 Rush 的简单独立项目。（稍后，[与 Rush 交互](../tutorials/heft_and_rush.md) 教程将探讨在 monorepo 中使用 Heft 有何不同。）

1. 我们将使用 [PNPM 包管理器](https://pnpm.js.org/) 来进行此演示。它的命令行和 NPM 非常相似，所以你可以在这些步骤中用 `npm` 替换 `pnpm`。有[各种方法](https://pnpm.io/installation)可以安装 PNPM，但最简单的方法是这样的：

   ```bash
   npm install --global pnpm
   ```

2. 创建一个新文件夹 **my-app** 并为我们的项目创建一个 **package.json** 文件，如下：

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

3. 创建一个我们将要编译的 TypeScript 源文件。

   **my-app/src/start.ts**

   ```
   console.log("Hello, world!");
   ```

4. 为你的项目安装 [@rushstack/heft](https://www.npmjs.com/package/@rushstack/heft), [@rushstack/heft-typescript-plugin](https://www.npmjs.com/package/@rushstack/heft-typescript-plugin), 和 [typescript](https://www.npmjs.com/package/typescript) 作为 `devDependenices`：

   ```bash
   cd my-app
   pnpm install --save-dev @rushstack/heft
   pnpm install --save-dev @rushstack/heft-typescript-plugin
   pnpm install --save-dev typescript

   # 由于此项目将使用 console.log() API，我们还需要添加 TypeScript
   # 的 Node.js 类型定义。类型定义应始终使用 "--save-exact" 版本规范。
   pnpm install --save-dev --save-exact @types/node
   ```

5. 接下来我们需要创建 TypeScript [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 文件。此文件的存在会使 Heft 调用 TypeScript 编译器。现在我们将创建一个简单的独立 **tsconfig.json** 文件；稍后我们将演示如何在多个项目之间共享可复用的配置。

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

注意 `"types": ["node"]` 引用了我们之前安装的 `@types/node` 包。因为 Node.js 是全局环境，所以它的类型定义必须全局加载。大多数其他的 `@types` 包可以通过您的源代码中的 `import` 语句加载。

更多关于 TypeScript 配置和 Heft 的信息，请参阅 [TypeScript 插件](../plugins/typescript.md) 文档。

6. 您可以使用 `./node_modules/.bin/heft` 来调用 Heft，但是将其全局安装更方便，因为这样它将始终在您的 shell `PATH` 中可用：

   ```bash
   # 全局安装 Heft 工具
   npm install --global @rushstack/heft
   ```

   > 如果全局安装的 `heft` 二进制文件的版本是错误的怎么办？
   >
   > 就像 Rush 一样，Heft 实现了一个 "version selector" 特性，它会自动发现您的本地 `node_modules` 文件夹并调用 `./node_modules/.bin/heft`，以确保使用正确的版本。

7. Heft 是基于配置驱动的，这意味着它在项目文件夹中的行为由数据（配置文件）定义，而不是代码（任意脚本）。如果您需要使用程序逻辑扩展您的构建过程，我们强烈建议将该代码移入 Heft 插件包中，该插件应作为使用 TypeScript、ESLint 和代码审查的专业软件开发。这需要更多的工作，但是随着您的 monorepo 规模的扩大，它极大地简化了维护。

   Heft 的主要配置文件是 [config/heft.json](../configs/heft_json.md)。让我们从最简单的文件开始：

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
   }
   ```

   如果你运行 `heft --help`，你应该会看到如下输出：

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

8. 现在，让我们通过添加一个名为 `"build"` 的简单阶段来扩展我们的配置，该阶段调用一个名为 `"typescript"` 的任务来编译您的代码。（关于这些术语的定义，参见 [architecture](../intro/architecture.md) 笔记。）

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

     "phasesByName": {
       // 定义一个名为 "build" 的阶段
       "build": {
         "phaseDescription": "This phase compiles the project source code.",

         // 在调用编译器之前，删除 "dist" 和 "lib" 文件夹
         "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }],

         "tasksByName": {
           // 定义一个名为 "typescript" 的任务
           "typescript": {
             "taskPlugin": {
               // 此任务将调用 TypeScript 插件
               "pluginPackage": "@rushstack/heft-typescript-plugin"
             }
           }
         }
       }
     }
   }
   ```

   _对于这些设置的完整描述，请参见 [heft.json](../configs/heft_json.md) 模板。_

   如果你运行 `heft --help`，你现在会看到一个 `build` 和 `build-watch`
   动作已被添加到你的命令行中，因为我们的阶段被称为 `"build"`：

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

   如果你运行 `heft build --help`， `"phaseDescription"` 将被打印出来。

9. 我们尝试调用 Heft 的[命令行](../intro/cli.md)来构建我们的项目。

   ```bash
   # 确保我们在你的项目文件夹中
   cd my-app

   # 查看命令行帮助
   heft --help
   heft build --help

   # 构建项目
   heft build

   # 为了查看更多关于 Heft 在做什么的详细信息，你可以添加 "--verbose" 标志
   heft build --verbose
   ```

   执行 `heft build --verbose` 应该会产生类似这样的控制台输出：

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

   > 注意：当报告诊断信息，如编译错误时，Heft 会打印相对于项目文件夹的文件路径。这可以使用
   > [RUSHSTACK_FILE_ERROR_BASE_FOLDER](../configs/environment_vars.md#rushstack_file_error_base_folder)
   > 环境变量进行自定义。

   构建完成后，确认它在你的 `lib` 文件夹中产生了几个输出文件：

   - **start.js** - 编译后的 JavaScript 代码
   - **start.d.ts** - TypeScript 的类型定义，用于可能导入此模块的外部库
   - **start.js.map** 和 **start.d.ts.map** - Source map 文件，可以帮助像调试器这样的工具找到对应输出文件中的某个项的源代码文件/行。

10. 如果你还记得，我们的 **package.json** 文件有一个 `"scripts"` 部分，指定了 `"start": "node lib/start.js"`。我们试试用 `pnpm run` 来运行编译后的代码。

    ```bash
    # 调用 package.json 中的 "start" 脚本
    pnpm run start

    # 如果你已经安装了 Rush，你也可以使用这个稍微短一点的等价命令
    rushx start
    ```

    你应该会看到像这样的输出：

    ```
    > my-app@1.0.0 start C:\my-app
    > node lib/start.js

    Hello, world!
    ```

11. 我们还可以在我们的 **package.json** 文件中添加一个 `"build"` 脚本：

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

    有了这个改变，你也可以通过调用 `pnpm run build`（或 `rushx build`）来进行构建。这个工具链无关的约定使得新手更容易猜到如何构建你的项目。当我们稍后与 Rush 集成时，它也会变得非常有用。
