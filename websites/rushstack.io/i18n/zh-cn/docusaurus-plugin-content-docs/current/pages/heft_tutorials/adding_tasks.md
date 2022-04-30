---
title: 添加更多的任务
---

_本文是[开始使用 Heft](../heft_tutorials/getting_started.md) 一文的后续。_

Heft 带有一些内置的 task, 这些 task 根据你的配置文件自动启用。所有的 task 都记录在 [Heft tasks](../heft_tasks/api-extractor.md) 一文中。

继续我们的教程，让我们使用两个最基本的 task: [Jest](../heft_tasks/jest.md) 和 [ESlint](../heft_tasks/eslint.md).

## 项目中增加单元测试

1. 首先，我们需要安装 Jest 的 TypeScript 类型。该步骤是[开始使用 Heft](../heft_tutorials/getting_started.md) 中创建好 **may-app** 的后续。回想起这个项目还没有使用 Rush, 所以依然直接调用 PNPM 来在 **package.json** 文件中添加依赖（而不是使用 [rush add](@rushjs/pages/commands/rush_add/)）:

   ```shell
   $ cd my-app

   # 类型应该使用 "--save-exact" 来获得准确的版本。
   $ pnpm install --save-dev --save-exact @types/heft-jest
   ```

2. 由于 [Jest's API](https://jestjs.io/docs/en/api) 由许多全局变量组成，我们需要将它们加载到全局（其他大多数包都是通过代码 `import` 引入），将 **tsconfig.json** 文件中 `"types": ["node"]` 更新为 `"types": ["heft-jest", "node"]`. 结果如下：

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

3. 接下来，我们需要创建 [jest.config.json](https://jestjs.io/docs/en/configuration) 配置文件。Heft 会通过该文件来调用 Jest. Heft 需要一个特定的文件路径 **config/jest.config.json**. 大多数情况下，你的 Jest 配置只需要基于 Heft 的预设来进行简单的扩展，例如：

   **my-app/config/jest.config.json**

   ```js
   {
     "preset": "./node_modules/@rushstack/heft/includes/jest-shared.config.json"
   }
   ```

4. 现在我们需要增加单元测试，Jest 支持大量的功能，但是此教程中我们只需要创建一个简单的测试文件。Heft 会在文件中寻找 `.test.ts` 的文件后缀。

   **my-app/src/example.test.ts**

   ```ts
   describe('Example Test', () => {
     it('correctly runs a test', () => {
       expect(true).toBeTruthy();
     });
   });
   ```

5. 为了运行测试，我们需要使用 `heft test` action, 因为 `heft build` 通常会跳过这些测试来加速构建。

   ```shell
   # Windows 中所有的命令都使用反斜线

   # 查看命令行帮助
   $ heft test --help

   # 构建项目并测试
   $ heft test
   ```

   我们需要更新 **package.json** 脚本来调用 `heft test` 同时替换 `heft build`. 此时，`pnpm run build` 会执行 Jest 测试用例。

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

> **注意：** 不要直接调用 `jest` 命令行，因为它仅仅执行测试而不会执行 Heft 的构建步骤。

这就是启用 Jest 的方法！诸如调试测试等更进一步的信息，可以参考 ["jest" task](../heft_tasks/jest.md) 一文和 [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) 示例项目。

## 启用格式化

1. 为了确保最好的体验、捕获常见的错误，让我们启动 [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) 规则集。首先我们需要在 **package.json** 文件中添加一些 NPM 库。

   ```shell
   $ cd my-app

   # 添加 ESLint 引擎
   $ pnpm install --save-dev eslint

   # 添加 Rush Stack 的多合一的规则集
   $ pnpm install --save-dev @rushstack/eslint-config
   ```

2. 接下来，创建 [.eslintrc.js](https://eslint.org/docs/user-guide/configuring) 配置文件。Heft 会通过该文件调用 ESLint 任务：

   **my-app/.eslintrc.js**

   ```js
   //解决 https://github.com/eslint/eslint/issues/3458
   require('@rushstack/eslint-config/patch/modern-module-resolution');

   module.exports = {
     extends: ['@rushstack/eslint-config/profile/node'],
     parserOptions: { tsconfigRootDir: __dirname }
   };
   ```

   _注意: 如果项目内使用了 [React](https://reactjs.org/), 那么应该从 `"@rushstack/eslint-config/mixins/react"` 进行拓展。 查看[该文档](https://www.npmjs.com/package/@rushstack/eslint-config) 来了解 `@rushstack/eslint-config` 中的 "profiles" and "mixins"._

3. 为了测试 ESLint，更新你的 **start.ts** 源文件，在其中引入一个格式问题。

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f() {
     // <--- oops
   }
   ```

   当你执行 `pnpm run build` 时，会发现以下输入日志：

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

   为了修复该问题，需要在带妈妈中添加上返回值类型，下面代码会成功构建。

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f(): void {
     // <--- okay
   }
   ```

4. `@rushstack/eslint-config` 的规则集被设定为与 Prettier 共同工作。可以参考 Rush 官网的[启用 Prettier](@rushjs/pages/maintainer/enabling_prettier/) 来完成设定。

这就是设定 ESLint 的步骤！更多细节可以参考 [eslint task](../heft_tasks/eslint.md) 一文。
