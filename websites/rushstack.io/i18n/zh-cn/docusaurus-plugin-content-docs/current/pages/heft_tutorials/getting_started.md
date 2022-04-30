---
title: 开始使用 Heft
---

本文将使用 Heft 来创建一个基本的 Node.js 控制台项目。

> 如果你比较着忙，可以查看 [heft-node-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-basic-tutorial)
> 和 [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial)
> 项目，它们展示了使用 Heft 构建的简单示例项目。

We'll begin by creating a simple standalone project without Rush. (Later, the [Interfacing with Rush](../heft_tutorials/heft_and_rush.md) tutorial will examine what's different when using Heft in a monorepo.)

我们以创建一个没有 Rush 的独立项目作为起点（稍后，[与 Rush 交互](../heft_tutorials/heft_and_rush.md) 一文将展示在 monorepo 内使用 Heft 有哪些不同）。

1. 这个示例中，我们将使用 [PNPM 包管理器](https://pnpm.js.org/). （它的命令行与 NPM 十分类似，所以在接下来的步骤中使用 `npm` 替换 `pnpm`), 这里有[多种方法](https://pnpm.io/installation) 来安装 PNPM，但最简单的方法是：

   ```shell
   $ npm install --global pnpm
   ```

2. 为我们的项目创建一个新文件夹 **my-app**，并在其中创建一个 **package.json** 文件：

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

3. 创建需要编译的 TypeScript 源文件：

   **my-app/src/start.ts**

   ```
   console.log("Hello, world!");
   ```

4. 以 `devDependencies` 的形式安装 [@rushstack/heft](https://www.npmjs.com/package/@rushstack/heft) 和 [typescript](https://www.npmjs.com/package/typescript):

   ```shell
   $ cd my-app
   $ pnpm install --save-dev @rushstack/heft
   $ pnpm install --save-dev typescript

   # 因为项目内使用了 console.log() API, 所以需要添加 Node.js 在 TypeScript 中对应的类型
   # 类型应该使用 "--save-exact" 来指定版本。
   $ pnpm install --save-dev --save-exact @types/node
   ```

5. 接下来创建 TypeScript 的配置文件 [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。Heft 会使用该文件来调用 TypeScript 编译器。现在我们创建了一个简单、独立的 **tsconfig.json** 文件；稍后我们将展示如何在多个项目之间共享一个可重用的配置。

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
       "types": ["node"],

       "module": "commonjs",
       "target": "es2017",
       "lib": ["es2017"]
     },
     "include": ["src/**/*.ts"],
     "exclude": ["node_modules", "lib"]
   }
   ```

   注意，`"types": ["node"]` 指向了上面安装的 `@types/node` 包。该步骤是必须的，因为 Node.js 放到了全局环境下，所以它的类型也需要在全局环境中加载。其他大多数 `@types` 包可以通过在源代码中使用 `import` 语句来加载。

   [typescript task](../heft_tasks/typescript.md) 一文描述了 Heft 下 TypeScript 配置的相关背景。

6. 你可以通过 `./node_modules/.bin/heft` 来调用 Heft, 但是更方便的是将它安装到全局，这样就可以在你的 shell 环境中调用它。

   ```shell
   # 全局安装 Heft
   $ pnpm install --global @rushstack/heft
   ```

   > 如果全局安装的 `heft` 版本有问题怎么办？
   >
   > 与 Rush 类似，Heft 实现了“版本选择”功能，它可以自动地在本地的 `node_modules` 文件夹中
   > 查找并调用 `./node_modules/.bin/heft`，以确保使用正确的版本。

7. 下面尝试调用 Heft 的 [命令行](../heft/cli.md) 来构建我们的项目：

   ```shell
   # Windows 中所有的命令都使用反斜线

   # 确保在工程目录下
   $ cd my-app

   # 查看命令行帮助
   $ heft --help
   $ heft build --help

   # 构建项目
   $ heft build

   # 通过 "--verbose" 来查看 Heft 运行的更多细节
   $ heft build --verbose
   ```

   调用 `heft build` 产生的输出日志类似于：

   ```
   Project build folder is "/path/to/my-app"
   Starting build
   ---- Compile started ----
   [copy-static-assets] Copied 0 static assets in 0ms
   [typescript] Using TypeScript version 3.9.7
   ---- Compile finished (1494ms) ----
   ---- Bundle started ----
   ---- Bundle finished (0ms) ----
   -------------------- Finished (2.408s) --------------------
   Project: my-app@1.0.0
   Heft version: 0.3.0
   Node version: v12.17.0
   ```

   > 一些术语：当在 shell 中调用 `heft build` 命令时，动词 "build" 就被视为一个 **action**. action 是一个类似于宏的用户交互的概念。action 可以使 Heft 调用多个诸如 `[typescript]` 或 `[copy-static-assets]` 的任务。这些任务经常以并行的方式运行。这些任务被分组到不同的 "stage" 中，诸如上面日志中的“编译”和“打包”。stage 表明整操作的主要步骤，这些概念在 [Heft 架构](../heft/architecture.md) 一文中有更详细的解释。

   构建完成后，你的 `lib` 文件夹中将会以下输出文件：

   - **start.js** - 编译好的 JavaScript 代码
   - **start.d.ts** - TypeScript 的类型，用于外部库引入该模块
   - **start.js.map** 和 **start.d.ts.map** - sourcemap 文件，用于调试等功能时找到输出文件内对应的源代码和行数。
     &nbsp;

8. 如果你还记得，我们的 **package.json** 文件内有 `"scripts"` 字段，其中有一个 `"start": "node lib/start.js"`. 下面尝试使用 `pnpm run` 来运行编译好的代码：

   ```shell
   # 调用 package.json 下 "start" 脚本
   $ pnpm run start

   # 如果你安装了 Rush, 那么也可以使用等价但字符更少的命令
   $ rushx start
   ```

   你的输出如下：

   ```
   > my-app@1.0.0 start C:\my-app
   > node lib/start.js

   Hello, world!
   ```

9. 也可以在 **package.json** 文件中添加 `"build"` 脚本：

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

   改完后，也可以调用 `pnpm run build`（或 `rushx build`）进行构建。与工具链无关的特性可以使新手更快的构建项目，对于之后集成 Rush 也很有帮助。

10. 为了完成这个项目，我们需要创建一些配置文件来确保 `heft clean` 可以正确删除输出文件。

    **my-app/config/heft.json**

    ```
    /**
     * 定义了 Heft 使用的配置
     */
    {
      "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

      "eventActions": [
        {
          /**
           * 内置操作的种类。
           * "deleteGlobs" 表明删除那些满足 glob 匹配的文件和文件夹。
           */
          "actionKind": "deleteGlobs",

          /**
           * 这个 action 应该发生在 Heft 运行的哪个阶段。
           * 注意，在 heft.json 中指定的 action 会在 Heft 运行的阶段结束时触发。
           */
          "heftEvent": "clean",

          /**
           * 一个用户定义的标签，其目的是允许替换/删除由其他配置引入的处理程序。
           */
          "actionId": "defaultClean",

          /**
           * 应该删除的 glob 匹配符。这些路径相对于项目根目录。
           */
          "globsToDelete": ["dist", "lib", "temp"]
        }
      ],

      /**
       * 一系列需要加在的 Heft 插件。
       */
      "heftPlugins": [
        // {
        //  /**
        //   * 插件的位置。
        //   */
        //  "plugin": "path/to/my-plugin",
        //
        //  /**
        //   * 插件暴露的可选的参数。
        //   */
        //  // "options": { }
        // }
      ]
    }
    ```
