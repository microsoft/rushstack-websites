---
title: Adding more tasks
---

_本节将继续从[Hello World](../tutorials/hello_world.md)教程中的教程项目。_

Heft 的[架构](../intro/architecture.md)是围绕插件包设计的。Heft 带有一组[官方插件包](../plugins/package_index.md)，用于最常见的构建任务。它们的源代码可以在[rushstack/heft-plugins](https://github.com/microsoft/rushstack/tree/main/heft-plugins)中找到，如果你想创建自己的 Heft 插件，这是一个很好的参考。

在我们的教程中，让我们启用两个最常见的插件：[Jest](../plugins/jest.md)用于单元测试，和[ESlint](../plugins/lint.md)用于样式检查。

## 将单元测试添加到您的项目

1. 首先，我们需要安装 Jest 的 TypeScript 类型定义。这些步骤将继续从[Hello World](../tutorials/hello_world.md)教程中的**my-app**项目。请记住，该项目尚未使用 Rush，因此我们将直接调用 PNPM 将依赖项添加到我们的**package.json**文件中（而不是使用[rush add](@rushjs/pages/commands/rush_add/)）：

   ```bash
   cd my-app

   # 因为@types包不遵循SemVer，所以使用--save-exact是个好主意
   pnpm install --save-dev --save-exact @types/heft-jest
   pnpm install --save-dev @rushstack/heft-jest-plugin
   ```

2. 将`"test"`部分添加到您的 Heft 配置文件中，生成这个结果：

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

     "phasesByName": {
       // 定义一个名为"build"的phase
       "build": {
         "phaseDescription": "This phase compiles the project source code.",

         // 在调用编译器之前，删除"dist"和"lib"文件夹
         "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }],

         "tasksByName": {
           // 定义一个名为"typescript"的task
           "typescript": {
             "taskPlugin": {
               // 此task将调用TypeScript插件
               "pluginPackage": "@rushstack/heft-typescript-plugin"
             }
           }
         }
       },

       // 定义一个名为"test"的phase
       "test": {
         "phaseDescription": "This phase runs the project's unit tests.",

         // 此phase需要先运行"build"phase
         "phaseDependencies": ["build"],

         "tasksByName": {
           // 定义一个名为"jest"的task
           "jest": {
             "taskPlugin": {
                // 此task将调用Jest插件
                "pluginPackage": "@rushstack/heft-jest-plugin"
             }
           }
         }
       }
     }
   }
   ```

   _有关这些设置的完整描述，请参阅[heft.json](../configs/heft_json.md)模板。_

   如果你运行`heft --help`，你应该现在看到`test`和`test-watch`命令行 actions，因为我们的第二个 phase 被命名为`"test"`。

3. 由于[Jest 的 API](https://jestjs.io/docs/en/api)包括全局变量，我们需要在全局加载它们（而大多数其他`@types`包是通过在源代码中的`import`语句加载的）。更新你的**tsconfig.json**文件，将`"types": ["node"]`改为`"types": ["heft-jest", "node"]`。结果应该如下所示：

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

4. 接下来，我们需要添加[jest.config.json](https://jestjs.io/docs/en/configuration)配置文件。这个文件的存在使得 Heft 调用 Jest 测试运行器。Heft 期望一个特定的文件路径**config/jest.config.json**。在大多数情况下，你的 Jest 配置应该只是扩展 Heft 的标准预设，如下所示：

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

   > **注意：**对于 web 项目，你可能想要使用
   > `@rushstack/heft-jest-plugin/includes/jest-web.config.json`取代`jest-shared.config.json`
   > 以支持作为`lib-commonjs`和`lib`文件夹的双输出。详情请参阅[Jest 插件](../plugins/jest.md)
   > 文档。

5. 现在我们需要添加一个单元测试。Jest 支持相当多的功能，但对于这个教程，我们将创建一个简单的测试文件。`.test.ts`文件扩展名使 Heft 在这个文件中寻找单元测试：

   **my-app/src/example.test.ts**

   ```ts
   describe('Example Test', () => {
     it('correctly runs a test', () => {
       expect(true).toBeTruthy();
     });
   });
   ```

6. 为了运行测试，我们需要使用`heft test`action，因为`heft build`通常会跳过测试以加快开发。

   ```bash
   # 查看命令行帮助
   heft test --help

   # 构建项目并运行测试
   heft test --verbose

   # 在观察模式下运行Jest
   heft test-watch
   ```

   哇，`heft test --help`有很多命令行参数！它们从哪里来的？
   它们是由 Jest 插件的[heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/heft-plugin.json) manifest 文件添加的，因为我们在我们的 phase 中加载了那个插件。

   （如果两个不同的插件定义了相同的命令行参数会怎样？Heft 包含了一个复杂的
   区分机制，例如允许你使用`--jest:update-snapshots`代替`--update-snapshots`
   如果其他插件也定义了一个`--update-snapshots`参数。）

7. 我们应该更新我们的**package.json**脚本，以便`pnpm run test`会运行 Jest 测试：

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

> **注意：**不要直接调用`jest`命令行。这样做会运行它在`lib/**/*.js`中找到的测试，但它不会调用 Heft 的其他 task 需要更新那些输出文件。

这就是设置 Jest 的所有内容！更多信息，包括调试测试的说明，可以在[Jest 插件](../plugins/jest.md)参考和[heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial)样本项目中找到。

## 启用 linting

1. 为了确保最佳实践并捕捉常见错误，让我们也启用[@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config)标准规则集。首先，我们需要向我们的**package.json**文件添加一些更多的 NPM 依赖。

   ```bash
   cd my-app

   # 添加ESLint引擎
   pnpm install --save-dev eslint

   # 添加Heft的ESLint插件
   pnpm install --save-dev @rushstack/heft-lint-plugin

   # 添加Rush Stack的一体化lint规则集
   pnpm install --save-dev @rushstack/eslint-config
   ```

2. 更新你的 Heft 配置文件，添加一个在`heft build`阶段加载`@rushstack/heft-lint-plugin`的 task：

   **config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

     "phasesByName": {
       // 定义一个名为 "build" 的phase
       "build": {
         "phaseDescription": "Compiles the project source code",

         // 在调用编译器之前，删除 "dist" 和 "lib" 文件夹
         "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }],

         "tasksByName": {
           // 定义一个名为 "typescript" 的task
           "typescript": {
             "taskPlugin": {
               // 这个task将调用TypeScript插件
               "pluginPackage": "@rushstack/heft-typescript-plugin"
             }
           },

           // 定义一个名为 "lint" 的task
           "lint": {
            // 这个task应在 "typescript" 完成后运行
            // 因为Heft通过重用TypeScript
            // 编译器的AST分析来优化ESLint
            "taskDependencies": ["typescript"],
            "taskPlugin": {
              // 这个task将调用ESLint插件
              "pluginPackage": "@rushstack/heft-lint-plugin"
            }
          }
         }
       },
       // 定义一个名为 "test" 的phase
       "test": {
         // 这个phase需要 "build" phase首先运行
         "phaseDependencies": ["build"],
         "tasksByName": {
           // 定义一个名为 "jest" 的task
           "jest": {
             "taskPlugin": {
                // 这个task将调用Jest插件
                "pluginPackage": "@rushstack/heft-jest-plugin"
             }
           }
         }
       }
     }
   }
   ```

   _关于这些设置的完整描述，请参见[heft.json](../configs/heft_json.md)模板。_

3. 接下来，创建[.eslintrc.js](https://eslint.org/docs/user-guide/configuring)配置文件。对于本教程，我们将只使用官方的 Rush Stack 规则集：

   **my-app/.eslintrc.js**

   ```js
   // 这是对https://github.com/eslint/eslint/issues/3458的解决方案
   require('@rushstack/eslint-config/patch/modern-module-resolution');

   module.exports = {
     extends: ['@rushstack/eslint-config/profile/node'],
     parserOptions: { tsconfigRootDir: __dirname }
   };
   ```

   _注意：如果你的项目使用[React](https://reactjs.org/)框架，你也应该从`"@rushstack/eslint-config/mixins/react"`混入扩展。关于`@rushstack/eslint-config`的"profiles"和"mixins"的详细信息，请参见[文档](https://www.npmjs.com/package/@rushstack/eslint-config)。_

4. 为了测试它，尝试更新你的**start.ts**源文件以引入一个 lint 问题：

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f() {
     // <--- oops
   }
   ```

   当你运行`pnpm run build`时，你应该看到像这样的日志信息：

   ```
   -------------------- Finished (3.555s) --------------------
   Encountered 1 warning
   [build:lint] src/start.ts:3:8 - (@typescript-eslint/explicit-function-return-type) Missing return type on function.
   ```

   要解决这个问题，修复代码以添加缺失的返回类型，现在它应该能成功构建：

   **my-app/src/start.ts**

   ```ts
   console.log('Hello, world!');

   export function f(): void {
     // <--- okay
   }
   ```

5. `@rushstack/eslint-config`规则集旨在与 Prettier 代码格式化工具一起使用。
   要设置它，请参见 Rush 网站上的[启用 Prettier](@rushjs/pages/maintainer/enabling_prettier/)文章。

至此，ESLint 的设置就完成了！在[Lint 插件](../plugins/lint.md)参考中可以找到更多详细信息。
