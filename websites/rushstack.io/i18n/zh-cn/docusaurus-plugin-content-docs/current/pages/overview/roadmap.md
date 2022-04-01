---
title: 项目规划
---

通过[新闻页](./pages/news.md)和推特是了解当下正在做哪些事的最佳途径。路线图只是对未来方向的补充。

**_最后更新：2021 年 9 月_**

## 最近完成

最近完成的里程碑：

<!-- latest events go on the bottom -->

- Rush 在 Shell 内的自动补全
- Rush 与[BuildXL](https://github.com/microsoft/BuildXL) 的整合。
- 优化 Rush 的启动时间，增加新的工具 [@rushstack/rundown](https://www.npmjs.com/package/@rushstack/rundown)
- 基于 [@rushstack/terminal](https://www.npmjs.com/package/@rushstack/terminal) 重新设计 "rush build" 的日志
- 为 [rig packages](https://www.npmjs.com/package/@rushstack/rig-package) 引入新的 model
- 将 TSDoc 项目文档移动到 [https://tsdoc.org/](@tsdoc/)
- 实现 [build 缓存](@rushjs/pages/maintainer/build_cache/) 功能和文档
- Rush 内集成 [Artifactory](@rushjs/pages/maintainer/npm_registry_auth/)
- 合并 API Extractor 来支持 `import * as ___ from "___";` namespaces ([issue #1029](https://github.com/microsoft/rushstack/issues/1029))
- 合并 API Extractor 来支持 `import()` 类型表达式 ([issue #1050](https://github.com/microsoft/rushstack/issues/1050))
- 开始一个新包 [@rushstack/eslint-plugin-security](https://www.npmjs.com/package/@rushstack/eslint-plugin-security)
- 提高 Heft 对 [Node.js 服务](https://rushstack.io/pages/heft_tasks/node-service/)的支持

## 进行中

贡献的代码的可用性很难预测，因此我们尽量不承诺某个功能何时（能否）被实现。换句话说，这里有一些正在从事的工作：

<!-- things we expect to get to sooner go at the top -->

- 创建 StorybookJS 的 Heft 插件
- 提高 Heft 内 Jest 版本
- 提高 TypeScript 版本到 4.x
- 建立 [rushstack-samples](https://github.com/microsoft/rushstack-samples/), 该仓库用于说明实际情况下的使用方式。
- 分享一些在 Rush+PNPM 下使用 ReactNative 的示例
- Rush 的[多项目监听模式](@rushjs/pages/advanced/watch_mode/).
- 朝发布 Heft 1.0 而努力，尝试稳定配置文件和插件 API.

## 很有可能马上到来

目前 Rush Stack 的维护者认为需要优先处理的事情：

<!-- things we expect to get to sooner go at the top -->

- Rush 的多阶段构建
- 提高 Rush 发布的设计(`rush publish`, `rush version`, `rush change`)

如果某个功能对你特别重要，你可以在 [Zulip chat room](https://rushstack.zulipchat.com/) 告知我们。当然，即使不在路线图中，也欢迎你提交 PR.
