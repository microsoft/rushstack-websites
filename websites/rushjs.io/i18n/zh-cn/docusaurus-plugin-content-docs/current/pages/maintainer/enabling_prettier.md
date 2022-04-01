---
title: 启用 Prettier
---

Rush 中的[格式化策略](https://rushstack.io/pages/heft_tasks/eslint/) 推荐使用 [Prettier](https://prettier.io/) 来确保代码的一致性，该方法下，ESLint 和 Prettier 具有互补的作用：

推荐的 ESLint 使用方式：

- ESLint 通过一组规则来保障代码的规范性。<br/>_例如：“函数名应该使用骆驼式命名”。_
- 修复这些问题可能会导致测试失败或者 API 不符合约定，ESLint 可能会导致构建失败。
- 规则是高度可定制的，不同的项目可能需要不同的规则。
- 因此，我们建议在不同的项目中分开调用 ESLint，作为构建该项目的一部分。

推荐的 Prettier 使用方式：

- Prettier 可以优化代码格式。<br/>_例如：缩进和逗号放置_
- 修复这些问题永远不应该影响代码含义，Prettier 可以自动运行并且不可见。
- Prettier 不建议自定义，一个规范就够了。
- 因此，我们建议将 Prettier 应用到整个项目中。

在这篇文章中，我们将说明如何配置 Prettier, 最终让它在 `git commit` 时自动运行。我们也建议开发者安装 [Prettier 的 VS Code 插件](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), 它会在每次保存时自动格式化文件。

## 准备 Prettier

我们处理 Git 钩子之前，首先配置 Prettier, 并以此让你的文件格式化。

1. 由于 Prettier 的运行范围是所有文件，它的[配置文件](https://prettier.io/docs/en/configuration.html)应该放到仓库的根目录上，Prettier 允许多个不同的配置文件名，但 JSON 不能写注释，因此推荐使用 `.js` 文件扩展名：

   **&lt;repo root&gt;/.prettierrc.js**

   ```js
   // 配置可参考 https://prettier.io/en/configuration.html
   module.exports = {
     // 使用较大的打印宽度，因为 Prettier 的换行设置似乎是针对没有注释的 JavaScript.
     printWidth: 110,

     // 使用 .gitattributes 来管理换行
     endOfLine: 'auto',

     // 单引号代替双引号
     singleQuote: true,

     // 对于 ES5 而言, 尾逗号不能用于函数参数，因此使用它们只能用于数组
     trailingComma: 'none'
   };
   ```

2. 你也可以使用 `.prettierignore` 来告知 Prettier 跳过哪些文件，注意，Git 钩子将会自动过滤掉哪些没有被 commit 的文件，然而诸如 [Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 等其他工具并不是如此，因此建议将 `.prettierignore` 中的内容与 `.gitingore` 一致：

   **&lt;repo root&gt;/.prettierignore**

   ```shell
   #-------------------------------------------------------------------------------------------------------------------
   # 保持与 .gitignore 同步
   #-------------------------------------------------------------------------------------------------------------------

   👋 (此处将你的 .gitignore 文件内容复制粘贴过来) 👋

   #-------------------------------------------------------------------------------------------------------------------
   # Prettier 通用配置
   #-------------------------------------------------------------------------------------------------------------------

   # Rush 文件
   common/changes/
   common/scripts/
   common/config/
   CHANGELOG.*

   # 包管理文件
   pnpm-lock.yaml
   yarn.lock
   package-lock.json
   shrinkwrap.json

   # 构建产物
   dist
   lib

   # 在 Markdown 中，Prettier 将会对代码块进行格式化，这会影响输出
   *.md
   ```

3. 配置完后，下一步需要手动调用 Prettier 并将代码格式化，你可以通过查看 Git diff 来调整 `.prettierignore` 配置，如下：

   ```shell
   # 安装 prettier
   $ npm install --global prettier

   # 进入仓库根目录
   $ cd my-repo

   # 查看 Prettier 会操作哪些文件；并据此该个命令来调整你的 .prettierignore 规则
   $ prettier . --list-different

   # 当你准备好时，这个命令将会批量修复所有的源文件
   $ prettier . --write
   ```

如果你的仓库有很多文件，那么第一次执行 Prettier 时，可能会生成一个巨大的 diff. 在这种情况下，你可以将这些变更合并到一个 PR 中，这样可以方便下一步的审核。

## Git 钩子的要求

这次我们将实现一个 [Git 钩子](../../maintainer/git_hooks)，它会在 commit 时自动调用 Prettier。

注意，`git commit` 是最关键的操作，因此需要保持它快速且可靠，开发者也许想在没有运行 `rush install` 前提交更改。在某些情况下，`rush install` 不能被执行，因为分支可能处于工作状态，因此我们的 Git 钩子不应该依赖于 monorepo 的安装机制。

我们可以使用 Rush 的 [install-run.js](../../maintainer/enabling_ci_builds) 脚本来启动按需 Prettier, 但是它会涉及到一些依赖：

- `pretty-quick`: 为了加速操作，我们使用 [pretty-quick](https://www.npmjs.com/package/pretty-quick) 来计算出需要 commit 的文件，只有这些文件需要处理，Prettier 不能处理这一部分，因为它不能与 Git 交互。
- `prettier`: `pretty-quick` 的依赖 Prettier.
- **可选插件：**如果你使用了 Prettier 的任何插件，它们需要被 `prettier` 解析到。

对于上述情况，Rush 的 "autoisntaller" 功能提供了一个替代 **install-run.js** 的方案。

## 启用 Git 钩子

1. 首先，使用 [rush init-autoinstaller](../../commands/rush_init-autoinstaller) 来创建一个自动安装程序：

   ```shell
   # 下面指令会创建 common/autoinstallers/rush-prettier/package.json 文件
   $ rush init-autoinstaller --name rush-prettier
   ```

2. 安装依赖并创建 **pnpm-lock.yaml** 文件：

   ```shell
   $ cd common/autoinstallers/rush-prettier

   # 可以不过下面指令来安装依赖， 也可以直接编辑 package.json 中 'dependencies" 字段
   $ pnpm install prettier
   $ pnpm install pretty-quick

   # （如果你需要插件，也可以安装它们）

   # 完成上面步骤后，执行以下步骤来确保 common/autoinstallers/rush-prettier/ppnpm-lock.yaml 文件是最新的
   $ rush update-autoinstaller --name rush-prettier
   ```

3. 现在，在 **common/autoinstallers/rush-prettier** 应该有两个文件：**package.json** 和 **pnpm-lock.yaml**, 将它们添加到 Git 仓库中，并且提交。

   ```shell
   $ git add package.json
   $ git add pnpm-lock.yaml
   $ git commit -m "Create rush-prettier autoinstaller"
   ```

4. 之后，我们可以创建自定义指令 `rush prettier` 来唤起 `pretty-quick`, 将这些指令添加到 **command-line.json** 文件中：

   **common/config/rush/command-line.json**

   ```js
     . . .
     "commands": [
       {
         "name": "prettier",
         "commandKind": "global",
         "summary": "Used by the pre-commit Git hook. This command invokes Prettier to reformat staged changes.",
         "safeForSimultaneousRushProcesses": true,

         "autoinstallerName": "rush-prettier",

         // 它将会唤起 common/autoinstallers/rush-prettier/node_modules/.bin/pretty-quick
         "shellCommand": "pretty-quick --staged"
       }
       . . .
   ```

   `"autoinstallerName": "rush-prettier"` 确保在执行 shell 命令之前安装 Prettier, `pretty-quick --staged` 将会在 **common/autoinstallers/rush-prettier** 目录中执行。

5. 保存完变化后，来通过执行 `rush prettier` 来测试自定义指令，你可以看到 Rush 会在第一次运行时自动执行一些步骤：(1) 安装正确的 Rush 版本；(2) 安装正确的 PNPM 版本；(3) 安装 **rush-prettier/package.json** 和它的依赖；(4) 调用 `pretty-quick --staged`。但当第二次运行时，第一步和第二步已经完成，所以步骤 (4) 不会有任何延迟。

6. 最后一步是添加一个 Git 钩子，该钩子在 `git commit` 执行完后自动调用 `rush prettier`, 为了实现该功能，在 **common/git-hooks** 目录下创建 **pre-commit** 文件：

   **common/git-hooks/pre-commit**

   ```
   #!/bin/sh
   # 在 "git commit" 执行时，该钩子会被调用，并且没有参数。如果该钩子想要阻止提交，那么它应该以返回非零状态推出。

   # Invoke the "rush prettier" custom command to reformat files whenever they
   # are committed. The command is defined in common/config/rush/command-line.json
   # and uses the "rush-prettier" autoinstaller.
   # 当 commit 时调用自定义指令 "rush prettier" 来重新格式化文件。该指令定义在 common/config/rush/command-line.json, 并通过 "rush-prettier" 自动安装并使用。
   node common/scripts/install-run-rush.js prettier || exit $?
   ```

7. 安装钩子，运行 `rush install`。

8. 在最后合并 PR 之前，你可能想运行 `prettier . --write` 来重新格式化安装钩子之前的所有文件。

完成！当 Git 中的更改被提交时，它们将被自动格式化。
