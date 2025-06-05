---
title: Rush 子空间
---

## 什么是子空间？

子空间是 Rush 的一个功能，使单一的 monorepo 能够使用多个 PNPM 锁定文件进行安装。例如，如果子空间名称是 `my-team`，则会有一个文件夹 `common/config/subspaces/my-team/`，其中包含 `pnpm-lock.yaml` 文件和相关配置。每个 Rush 项目都只属于一个子空间，monorepo 仍然保持一个统一的 "工作区"。因此，一个项目的 `package.json` 文件可以使用 `workspace:` 来指定对其他子空间项目的依赖。

## 有什么好处？

通常情况下，整个 monorepo 使用单个锁定文件是最好的，因为这可以优化安装时间，并最大限度地减少管理版本冲突的维护工作。然而，在某些情况下，允许多个锁定文件有其优势：

- **非常庞大的代码库**：锁定文件可以被视为一个庞大的多变量方程，我们通过在许多项目中协调 NPM 包版本选择来消除冲突并尽量减少重复。（[锁定文件浏览器](@lfx/) 文档对此有详细说明。）将 monorepo 的依赖关系分成较小的锁定文件确实使这些方程更小、更容易解决，但增加了管理版本的整体开销。对于庞大的工程团队来说，分工比减少工作总量更重要。

- **解耦的项目集合**：一个庞大的代码库中可能有一些项目集，它们的依赖关系与代码库的其他部分不一致。例如，假设有 50 个项目构成一个使用已弃用或过时框架的遗留应用程序，没有业务动机去现代化。将这些项目移入一个子空间可以使其版本管理独立。

- **安装测试**：在发布 NPM 包时，使用 `workspace:*` 符号链接无法重现某些错误。例如，幽灵依赖或错误的 `.npmignore` 通配符会导致外部消费者的包失败，但在 monorepo 中测试同一库时可能工作正常。将测试项目移入子空间（结合[注入依赖](./injected_deps.md)）会产生更准确的安装，从而发现此类问题，同时避免实际发布到测试 NPM 注册表的开销。

## 我需要多少个子空间？

我们通常建议 "尽可能少" 以尽量减少额外的版本管理开销。_每个团队一个子空间_ 是一个合理的最大上限。尽管如此，在一个包含超过 1000 个子空间的生产环境的 monorepo 中，该功能已被成功使用。

> **真实世界示例**
>
> Rush Stack 在 GitHub 上的自有仓库目前配置了两个子空间：
>
> - [common/config/subspaces/build-tests-subspace](https://github.com/microsoft/rushstack/tree/main/common/config/subspaces/build-tests-subspace): 用于测试发布的 NPM 包的安装
> - [common/config/subspaces/default](https://github.com/microsoft/rushstack/tree/main/common/config/subspaces/default): 包含所有其他项目

## 功能设计

每个子空间必须在 [common/config/subspaces.json](../configs/subspaces_json.md) 配置文件中进行集中注册。项目通过 [rush.json](../configs/rush_json.md) 中的 `subspaceName` 字段添加到子空间。

每个子空间的配置位于文件夹 `common/config/subspaces/<subspace-name>/` 中，可能包含以下文件：

| 子空间文件                                                   | 作用                                          |
| :----------------------------------------------------------- | :-------------------------------------------- |
| [`common-versions.json`](../configs/common-versions_json.md) | Rush 版本覆盖                                 |
| [`pnpm-config.json`](../configs/pnpm-config_json.md)         | PNPM 版本覆盖                                 |
| `pnpm-lock.yaml`                                             | PNPM 锁定文件                                 |
| `repo-state.json`                                            | Rush 生成的配置文件，用于防止手动更改锁定文件 |
| [`.npmrc`](../configs/npmrc.md)                              | 包管理器配置                                  |
| [`.pnpmfile.cjs`](../configs/pnpmfile_cjs.md)                | 程序化版本覆盖                                |

> 注意：`common/config/.npmrc-publish` 并不适用于子空间。包发布通常与包安装无关。

以下部分文件既可以在子空间中定义，也可以在 monorepo 配置中定义，继承关系如下表所示：

- 子空间配置目录：`common/config/subspaces/<subspace-name>/`
- monorepo 配置目录：`common/config/rush/`

| 子空间文件                                                       | monorepo 文件                                                | 继承关系                                                                                                        |
| :--------------------------------------------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| <code style={{whiteSpace: 'nowrap'}}>common-versions.json</code> | 无                                                           | _启用子空间时禁止使用 monorepo 的该文件。_                                                                      |
| `pnpm-config.json`                                               | <code style={{whiteSpace: 'nowrap'}}>pnpm-config.json</code> | **回退机制**：仅当子空间中不存在该文件时才使用 monorepo 文件。                                                  |
| `pnpm-lock.yaml`                                                 | 无                                                           | _启用子空间时禁止使用 monorepo 的该文件。_                                                                      |
| `repo-state.json`                                                | 无                                                           | _启用子空间时禁止使用 monorepo 的该文件。_                                                                      |
| `.npmrc`                                                         | `.npmrc`                                                     | **合并**：两个文件合并使用，子空间设置具有优先权。（Rush 在操作的工作目录中生成临时 `.npmrc` 文件时进行合并。） |
| `.pnpmfile.cjs`                                                  | 无                                                           | _启用子空间时禁止使用 monorepo 的该文件。_                                                                      |

在未启用子空间的情况下，Rush 会在 `common/temp/` 文件夹中生成并安装 PNPM 工作区。启用子空间后，则会分别在如 `common/temp/<subspace-name>/` 的文件夹中进行安装。

有两种基本的操作模式：

1. **只有几个子空间：** 你可以在 `subspaces.json` 中设置 `"preventSelectingAllSubspaces": false`，并且默认情况下，`rush install` 将安装所有子空间。

2. **大量子空间：** 如果安装所有子空间会消耗过多的时间和磁盘空间，那么你可以设置 `"preventSelectingAllSubspaces": true`。在此模式下，调用 `rush install` 或 `rush update` 等命令时，用户必须以某种方式过滤子空间，例如：
   - 使用 `rush install --to my-project` 只安装指定项目的依赖
   - 使用 `rush install --subspace my-subspace` 只安装特定子空间
   - 使用 [项目选择器](../developer/selecting_subsets.md#subspace-members-subspace) 中的 `rush install --to subspace:my-subspace` 为属于某个子空间的项目安装

## 如何启用子空间

1. 确保你的 **rush.json** 文件中指定了 `"rushVersion": "5.122.0"` 或更新版本，`"pnpmVersion": "8.7.6"` 或更新版本。

2. 使用 **subspaces.json** 启用此功能并定义子空间。你可以从 [subspaces.json](../configs/subspaces_json.md) 文档中复制此文件的模板，或者使用 `rush init` 生成它。在本教程中，我们将创建一个名为 `install-test` 的子空间，用于测试 NPM 包：

   **common/config/rush/subspaces.json**

   ```json
   {
     "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/subspaces.schema.json",

     /**
      * 设置此标志为 "true" 以启用子空间。
      */
     "subspacesEnabled": false,

     /**
      * 当执行类似 "rush update" 的命令且没有使用 "--subspace" 或 "--to" 参数时，Rush 会安装所有子空间。
      * 在拥有大量子空间的庞大 monorepo 中，这样做会非常缓慢。
      * 通过始终要求选择参数来执行类似 "rush update" 之类的命令，可以设置 "preventSelectingAllSubspaces" 为 true 以避免此类错误。
      */
     "preventSelectingAllSubspaces": false,

     /**
      * 子空间名称列表，应为小写的字母数字单词并用连字符分隔，例如 "my-subspace"。
      * 对应的配置文件路径可能为 "common/config/subspaces/my-subspace/package-lock.yaml"。
      */
     "subspaceNames": [
       // "default" 子空间即使你没有定义它也总是存在，但为了清晰起见，让我们将其包含在内
       "default",

       "install-test" // 👈👈👈 我们的第二个子空间名称
     ]
   }
   ```

3. 创建 `default` 子空间文件夹并将现有配置文件移动到那里：

   ```bash
   cd my-repo
   mkdir --parents common/config/subspaces/default

   # 移动这些文件：
   mv common/config/rush/common-versions.json  common/config/subspaces/default/
   mv common/config/rush/pnpm-lock.yaml        common/config/subspaces/default/
   mv common/config/rush/.npmrc                common/config/subspaces/default/

   # 重命名此文件：
   mv common/config/rush/.pnpmfile.cjs  common/config/subspaces/default/.pnpmfile.cjs
   ```

4. 创建 `install-test` 子空间文件夹：

   ```bash
   cd my-repo
   mkdir --parents common/config/subspaces/install-test
   ```

5. 通过编辑 `rush.json` 将项目分配到子空间。例如：

   **rush.json**

   ```json
   . . .

     "projects": [
       {
         "packageName": "my-library-test",
         "projectFolder": "test-projects/my-library-test",
         "subspaceName": "install-test"
       }

   . . .
   ```

   如果任何项目省略了 `"subspaceName"`，它们将属于 `default` 子空间。

6. 更新新子空间的锁定文件：

   ```bash
   # 清理之前的 common/temp 文件夹
   rush purge

   # 重新生成 "default" 子空间：
   rush update --full --subspace default

   # 重新生成 "install-test" 子空间：
   rush update --full --subspace install-test
   ```

   > **注意：** 你可以在不使用 `--full` 重新生成任何锁定文件的情况下迁移到子空间，
   > 但这是一个更复杂的过程，可能需要使用脚本重写 `pnpm-lock.yaml` 文件中的某些路径。

## 另见

- [subspaces.json](../configs/subspaces_json.md) 配置文件
- [rfc-4230-rush-subspaces.md](https://github.com/microsoft/rushstack/blob/main/common/docs/rfcs/rfc-4230-rush-subspaces.md)：此功能的原始规范，其中更详细地解释了动机和设计
