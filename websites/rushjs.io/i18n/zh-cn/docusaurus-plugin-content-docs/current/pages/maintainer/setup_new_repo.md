---
title: 创建一个新的仓库
---

创建一个新的仓库该教程讲述了将几个项目合并成一个新的 Rush monorepo 的过程（如果你想看最终结果，可以在 GitHub 上查看 [rush 示例](https://github.com/microsoft/rush-example)）。

假设我们有三个项目目录：

- **my-app**: 一个页面应用。

- **my-controls**: 页面应用使用的控件库。

- **my-toolchain**: NodeJS 实现的用于编译其他项目的工具。

起初每个项目在自身的目录下，它们都是通过这样的繁琐的方式来构建的：

```
~$ cd my-toolchain
~/my-toolchain$ npm run build
~/my-toolchain$ npm link
~/my-toolchain$ cd ../my-controls
~/my-controls$ npm link my-toolchain
~/my-controls$ npm run build
~/my-controls$ npm link
~/my-app$ cd ../my-app
~/my-app$ npm link my-toolchain
~/my-app$ npm link my-controls
~/my-app$ npm run build
```

现在让我们将其打造为 Rush 项目

## 步骤 1: 检查你的 Rush 版本

开始之前，首先确定全局安装了最新的 Rush 版本：

```
~$ npm install -g @microsoft/rush
```

_注意：如果由于缺少权限而导致访问 NPM 全局目录失败，可以查阅 [修复 NPM 配置](https://docs.npmjs.com/getting-started/fixing-npm-permissions)。_

## 步骤 2: 使用 "rush init" 初始化你的仓库

假定你已经创建了一个空的 GitHub 仓库，该仓库用于拷贝上述项目。先将仓库克隆到本地，然后运行 `rush init` 来生成 Rush 的配置文件：

```
~$ git clone https://github.com/my-team/my-repo
~$ cd my-repo
~/my-repo$ rush init
```

它将会生成以下文件：（更多信息可查阅 [配置文件参考](../../advanced/config_files)）

| 文件                                         | 用途                                                                                                 |
| :------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **rush.json**                                | Rush 内主要的配置文件                                                                                |
| **.gitattributes**                           | _(如果你不用 Git 可以删除)_ <br/>告诉 Git 不要对哪些 shrinkwrap 文件进行合并，因为该操作并不安全     |
| **.gitignore**                               | _(如果你不用 Git 可以删除)_ <br/>告知 Git 不要跟踪哪些文件                                           |
| **.travis.yml**                              | _(如果你不用 Travis 可以删除)_ <br/>配置 [Travis CI](https://travis-ci.com/) 服务来在 PR 中使用 Rush |
| **common/config/rush/.npmrc**                | Rush 用该文件配置源，无论是 PNPM, NPM 或者 Yarn                                                      |
| **common/config/rush/command-line.json**     | 用于自定义 Rush 的命令行命令或参数                                                                   |
| **common/config/rush/common-versions.json**  | 用于指定 NPM 包的版本，它影响 Rush 仓库下所有项目                                                    |
| **common/config/rush/pnpmfile.js**           | _(如果不使用 PNPM 可以删除)_ <br/>用于解决 package.json 文件下错误的依赖关系                         |
| **common/config/rush/version-policies.json** | 用于定义发布配置                                                                                     |

**注意：**如果你的分支中已经存在这些文件，`rush init` 将会发出警告并且不会覆盖已有的文件。

接着，将生成的文件添加到 Git 仓库并且提交到你的分支：

```
~/my-repo$ git add .
~/my-repo$ git commit -m "Initialize Rush repo"
```

## 步骤 3: 自定义配置

这些模版文件有大量的文档和注释的示例。我们建议你仔细查看它们，以便于你能够理解基本的选项和功能。

你可以随时修改你的选项，但是 **rush.json** 中有一些配置项需要一些了解：

- **选择包管理器**: 模版默认使用 PNPM，但是你也可以使用 NPM 或者 Yarn. 可以参考 [NPM vs PNPM vs Yarn](../../maintainer/package_managers).

- **检查你的 Rush 版本**：确保 `rushVersion` 是最新版本，版本列表可查看 [NPM 源](https://www.npmjs.com/package/@microsoft/rush).

- **检查其他的版本属性**: 同样需要检查下其他的版本字段，例如 `pnpmVersion`, `npmVersion`, `yarnVersion`, `nodeSupportedVersionRange`

- **是否使用“类别目录”模型**：参考 **rush.json** 中的 `projectFolderMinDepth` 和 `projectFolderMaxDepth` 的注释，并计划好 monorepo 内的项目目录如何组织。

- **配置源的访问权限**：初始的 **.npmrc** 被配置为使用公开的 NPM 源。如果你将要使用[私有源](../../maintainer/npm_registry_auth)，你应该更新 **common/config/rush/.npmrc** 文件。
