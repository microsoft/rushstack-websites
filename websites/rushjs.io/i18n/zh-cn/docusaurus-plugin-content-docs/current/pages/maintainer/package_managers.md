---
title: NPM vs PNPM vs Yarn
---

当你安装 JavaScript 库之前，你需要选择一个包管理工具（由于 JavaScript 社区非常自由活跃，因此包管理工具不止一个）。Rush 支持目前最流行的三种包管理工具，按照时间顺序依次为：

- [NPM](https://docs.npmjs.com/getting-started/what-is-npm): 它是当今最广泛的 JavaScript 包管理工具，它开创了包管理标准，起开发者还维护了世界上最多人使用的分布式开源 JavaScript 包管理网站 npmjs.com.

- [Yarn](https://yarnpkg.com/en/): 它重新实现了 NPM, 与之相比，Yarn 具有相同的管理方式，但是安装速度更快，稳定性更好，而且提供了一些新特性（例如 Yarn workspaces），用于大型开发。

- [PNPM](https:pnpm.js.org/): 它提供了一个全新的包管理模式，该模式解决了[“幻影依赖”和“ NPM 分身”](../../advanced/phantom_deps)的问题，同时[符号链接](https://en.wikipedia.org/wiki/Symbolic_link)使之与 NodeJS 模块解析标准保持 100% 兼容。

## 当使用 Rush 时应该选择哪个？

看你需求而定，Rush 开发者并不宣传特定的包管理工具，但是基于 monorepo 的管理经验而言，我们有以下观点：

#### 关于 NPM 的思考

- NPM 是最具兼容性的选择，并且一些“不友好”的库也可以得到处理。

- 如果你选择 NPM, 如果你选择使用旧版本，NPM 5.x 和 6.x 都可能导致 Rush 仓库出现问题。NPM **4.5.0** 是最新的可靠版本，但是它实在是太旧了（我们使用 [GitHub issue #886](https://github.com/microsoft/rushstack/issues/886) 来记录进展，非常欢迎并感谢大家来帮助解决目前的问题）。

_如果使用 Rush 与 NPM 结合出现问题时，首先尝试下降级到 `"npmVersion": "4.5.0`, 如果这样解决了问题，那么你的问题可能就是 NPM 导致的，并且不太方便在 Rush 中解决，我们仍然处理这些问题，但追踪这些问题的方式不同。_

#### 关于 PNPM 的思考

- PNPM 是解决 [NPM 分身](../../advanced/npm_doppelgangers) 的唯一选择。在复杂的 monorepo 项目中，NPM 分身 可能会导致很多麻烦，PNPM 在这方面有一个重要的优势。

- 尽管 PNPM 的链接策略遵循了当下 NodeJS 版本解析辨准，但是很多老包并没有，这可能存在一些兼容性问题。当尝试从 Yarn/NPM 迁移到 PNPM 时，团队需要对一些存在“问题的包”进行一些处理。不兼容性问题经常会出现在：(1) 忘记在 **package.json** 中列出依赖项；(2) 不以标准的方式实现符号链接。这些“问题”包有非常直接的解决方式，但是对于小团队而言可能比较艰难（[PNPM Discord 聊天室](https://discord.gg/mThkzAT) 是一个很好寻求帮助的地方）。

- PNPM 比 NPM 或 Yarn 更新，更少人用，但是它是一个很优秀的软件，微软内有上百个仓库使用了 Rush + PNPM 的组合，我们发现它迅速且可靠。

- PNPM 是目前唯一支持 `--strict-peer-dependencies` 的包管理器（参考 **rush.json** 中的 `"strictPeerDependencies"` 在 **rush.json** 中）的选择。

#### 关于 Yarn 的思考

- Rush 对 Yarn 的支持尚处于起步阶段，我们非常希望看到一些反馈并解决它们。

- Yarn 的安装速度比 NPM 更快（但是比 PNPM 要慢）。

- Yarn 的 "workspaces" 并没有被 Rush 采用，因为它们的安装方式并没有解决幻影依赖，然而 Rush 链接策略与 workspaces 相似。

## 指定你的包管理器

在 **rush.json** 中可以选定包管理器，可以通过编辑三个字段中的一个来指定（(`npmVersion`, `pnpmVersion`, 或 `yarnVersion`）：

**rush.json**

```
/**
  * 以下字段是用来选定包选择器及其版本。
  * Rush 会安装适用于自身版本的包管理器，这可以保证构建过程和本地环境隔离。
  *
  * 选中一个包选择器："pnpmVersion", "npmVersion", 或 "yarnVersion"。详细信息请参考 Rush 文档。
  */
"pnpmVersion": "2.15.1",

// "npmVersion": "4.5.0",
// "yarnVersion": "1.9.4",
```

选完后，删除 **common/config/rush** 中之前的 shrinkwrap 文件和其他包管理器相关文件。（否则 Rush 将会报告不支持配置文件），然后运行 `rush update --full --purge`.
