---
# The CLI help refers to this article title:
title: 选择部分项目
---

诸如 `rush build` 和 `rush rebuild` 等 [Bulk 指令](../../maintainer/custom_commands) 默认会操作该 monorepo 内的所有项目。当你的项目越来越多时，这种操作变得十分耗时，为了加速这一过程，Rush 提供了一系列命令行参数来选择部分项目。

假设我们的 Rush 工程形式如下图：

<img src="/images/docs/selection-intro.svg" alt="a sample monorepo" style={{ height: "150px" }} />

上图中圆圈表示本地项目，并没有 NPM 依赖，从 `D` 到 `C` 的箭头表示 `D` 依赖 `C`, 这意味着如果想要构建 `D`, 则 `C` 要首先被构建。我们会在下面的示例中使用 `rush build` 命令，但这些参数可以用于任何 Bulk 指令。

## --to

**场景：**假设我们刚刚克隆了 monorepo 仓库，现在想在项目 `B` 中进行开发，则需要构建 `B` 和 `B` 依赖的所有项目。

我们可以这样做：

```shell
# 构建项目 B 以及 B 依赖的所有项目
$ rush build --to B
```

上面的命令选择了 `A`, `B` 和 `E` 三个项目：

<img src="/images/docs/selection-to.svg" alt="rush build --to B" style={{ height: "150px" }} />

## --to-except

**场景：**很多时候我们不需要使用 `rush build` 来处理项目 `B`, 因为我们的下一步将会是在调用 Webpack 或者 Jest 的 "watch mode" 模式来处理项目 `B`. 此时可以使用 `--to-except` 来代替 `--to`, 该参数会仅构建项目 `B` 的依赖。

```shell
# 构建 B 依赖的所有项目，但不包括项目 `B`
$ rush build --to-except B

# 在项目 `B` 中调用 Jest 的 watch 模式来构建
$ heft test --watch
```

该指令选择了 `A` 和 `E` 两个项目：

<img src="/images/docs/selection-to-except.svg" alt="rush build --to-except B" style={{ height: "150px" }} />

## --from

**场景：**假设现在我们完成了对项目 `B` 的修改，我们想要构建下游的 `C` 和 `D` 项目来保证没有破坏性的变动。为了构建项目 `D`, 我们同样需要构建其依赖 `G`. `--from` 的作用就是这样，它也会包括 `A` 和 `E`，因为它们是 `B` 的依赖。(因为 `rush build` 是增量构建，所以 `A` 和 `E` 可能会被跳过，因为它们可能还没有变化)

```shell
# 构建 B 下游的所有项目，包括任何潜在的依赖
$ rush build --from B
```

该命令选中了除 `F` 的所有项目。

<img src="/images/docs/selection-from.svg" alt="rush build --from B" style={{ height: "150px" }} />

> **兼容性提示：** 如何在 **rush.json** 中设定的 `rushVersion` 小于 5.38.0, 则 `--from` 的行为类似于 `--impacted-by`,
> 在 Rush 5.38.0 版本中，该命令的含义有些变化，因为许多用户预期 `--from` 包含它的依赖。

## --impacted-by （不安全）

**场景：**假如为完成 `B` 内所需的工作需要改动对项目 `E`, 那么 Rush 的增量构建会假设 `E` 内的所有下游项目都需要被重新构建，例如 `F`. 这影响面可能会很大。也许你自己对他们了解更多——也许你稍后会撤回在 `E` 上的修改，也或者你会手动调用 `E` 的工具链，也许你对 `E` 的变动与现阶段所需无关。

这种情况下 `--impacted-by` 便可发挥作用：它意味着 _“只选择那些可能带给 B 破坏性变动的项目，信任那些依赖处于可用状态下的依赖。”_

```shell
# 构建 B 以及 B 下游的项目，但不包括这些项目的依赖
$ rush build --impacted-by B
```

该命令选中的项目是 `B`, `C` 和 `D`.

<img src="/images/docs/selection-impact.svg" alt="rush build --impacted-by B" style={{ height: "150px" }} />

## --impacted-by-expect （不安全）

**场景：**与 `--impacted-by` 相同，但是不包括 `B` 本身。

```shell
# 构建 B 下游的项目，但不包括这些项目的依赖
$ rush build --impacted-by-except B
```

该命令会选中 `C` 和 `D` 两个项目。

<img src="/images/docs/selection-impact-except.svg" alt="rush build --impacted-by-except B" style={{ height: "150px" }} />

## --only （不安全）

**场景：**正如该参数名所示：`--only` 参数只会选择指定的一个项目，忽略依赖。

```shell
# 只构建 B
$ rush build --only B
```

<img src="/images/docs/selection-only.svg" alt="rush build --only B" style={{ height: "150px" }} />

`--only` 可以与其他参数一起使用。例如在上文中，当我们使用 `rush build --impacted-by B` 时，可能还没有构建 `G`, 我们可以通过 `rush build --impacted-by B --only G` 来包含它。

> **“不安全”参数：** 如果所需的依赖没有被构建，那么诸如 `--only`, `--impacted-by` 和 `--impacted-by-except ` 等命令可能执行失败
> 当你比 Rush 更了解哪些项目需要构建时，可以通过上述三个参数来节省时间。如果该前提不存在，则可以使用 `rush build`.

## 选择器格式

当你指定上述参数之一时，你可以使用各种不同的格式来指定你需要的项目。

### 项目名

最直接的方式是使用项目名（在 `rush.json` 文件中所列）。

示例：

```console
rush build --to my-project-name

rush build --from my-project-name

rush list --impacted-by my-project-name
```

### 在当前项目下使用 `.`

如果你的的终端位于某个项目目录下，可以使用 `.`来表示当前项目。

示例：

```console
rush build --to .

rush list --to-except .
```

### commit 之后发生变动的项目

你通过提供一个 git （分支、标签或 commit 哈希）来指定该节点以来所有修改过的项目。这种查询的类型与 `rush change` 使用了相同的逻辑来记录变化。

```console
rush build --to git:origin/main

rush list --impacted-by git:release/v3.0.0
```

## 组合参数

- 你可以在指令中组合任何参数，其结果是所有参数的并集。

- 相同的参数可以重复多次，例如 `rush build --only A --only B --only C` 会选中 `A`, `B`, `C`.

- 注意 Rush 不会提供任何可能会减少选中项目的参数。在 [#1241](https://github.com/microsoft/rushstack/issues/1241) 中我们会实现更复杂的选择。

这里有一些复杂的组合指令：

```shell
$ rush build --only A --impacted-by-except B --to F
```

```shell
$ rush build --only A --impacted-by-except B --to F
```

上述示例中选中的项目为 `A`, `C`, `D`, `E` 以及 `F`:

<img src="/images/docs/selection-multi.svg" alt="rush build --only A --impacted-by-except B --to F" style={{ height: "150px" }} />

## 更多

- [增量构建](../../advanced/incremental_builds)

- [watch 模式](../../advanced/incremental_builds)

- [rush build](../../commands/rush_build)

- [rush rebuild](../../commands/rush_rebuild)
