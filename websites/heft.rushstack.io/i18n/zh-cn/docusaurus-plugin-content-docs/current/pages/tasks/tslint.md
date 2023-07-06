---
title: '"tslint" task'
---

这个任务使用 [TSLint](https://palantir.github.io/tslint/) 来格式化 TypeScript 代码。

## When to use it

**TSLint 已被废弃，只应用于遗留项目。**2019 年，TypeScript 编译器团队、ESLint 团队 和 TSLint 的团体聚在一起，同意[废弃 TSLint](https://medium.com/palantir/tslint-in-2019-1a144c2317a9). 转而在 ESLint 中集成 TypeScript, 它提供了统一的解决方案，用于格式化 JavaScript 和 TypeScript 源文件。

新项目建议使用 [eslint](../tasks/eslint.md) 任务。

## package.json dependencies

你需要在项目中添加 `tslint` 包：

```bash
$ rush add --package tslint --dev
```

另外，你可以通过加载 "rig" 来避免添加依赖，正如在 [使用 rig 包](../intro/rig_packages.md) 一文中描述的那样。

## 配置文件

这个任务并没有一个 Heft 专用配置文件。Heft 会寻找 TSLint 的配置文件 [tslint.json](https://palantir.github.io/tslint/usage/configuration/).
