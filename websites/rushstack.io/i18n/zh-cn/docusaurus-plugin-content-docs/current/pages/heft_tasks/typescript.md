---
title: '"typescript" task'
---

该任务用于调用 [TypeScript](https://www.typescriptlang.org/) 编译器。

## 何时使用

TypeScript 是 Rush Stack 的标准编程语言。在所有程序中使用“通用语言”有很多好处，它不需要给不同的语言维护不同的专业知识和库。

我们推荐 TypeScript 的原因是：

- **应用开发：**它在原型开发和小型项目中是一个很好的选择
- **工具基础设施：**良好的开体验可以让生产力成倍提高，所以构建工具应该是顶尖的软件，它应该有自己的设计、文档和测试。
- **客户端应用：**TypeScript 也可以通过 [React Native](https://reactnative.dev/) 等运行时用于客户端开发。
- **桌面应用程序：**也有桌面运行时，如 [Electron](https://www.electronjs.org/).

显然，某些组件可能不可避免地需要 Java、C++、Swift 等。但理想情况下，开发者不应该被要求安装原生 SDK，除非开发者正在处理这些原声 SDK. [Expo 客户端](https://expo.io/features)将这一概念发挥到了极致，它使你根本不需要安装本地工具就能编译和运行手机应用。当然，这种理想在实践中并不总是可行的。这是一种心态，而不是一种教条。这样处理好处是可以规范代码库，确保工程师可以轻松地对任目做出贡献，另外的好处是项目都可以加载任何库。

## package.json dependencies

你需要将 `typescript` 安装到你的项目中：

```bash
$ rush add --package typescript --dev
```

另外，你可以通过加载 "rig" 来避免添加依赖，正如在 [使用 rig 包](../heft/rig_packages.md) 一文中描述的那样。

如果你的 **tsconfig.json** 启用了 `"importHelpers": true` 来实现更高效的转译, 那么你也许可能需要 **tslib** 依赖：

```bash
$ rush add --package tslib
```

## 配置文件

主要配置来自 TypeScript 的 [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

对于复杂场景，Heft 还提供了一个可选的 [typescript.json](../heft_configs/typescript_json.md) 配置文件，它可用于配置工具链功能，如 TypeScript 的多个编译输出格式。
