---
title: '"api-extractor" task'
---

该任务用于调用 [API Extractor](@api-extractor/) 工具，它负责读取 TypeScript 声明文件（.d.ts 文件）作为输入，并生成三种输出：

**1. API 报告** - API Extractor 可以从项目的入口追踪到所有的导出，并声称生成一个 API 报告作为审查流程的基础。

**2. .d.ts 产物** - 与 **webpack** 打包所有的 JavaScript 成单个 .js 文件进行发布类似， API Extractor 可以将所有的 TypeScript 声明文件打包到单个 .d.ts 文件中。

**3. API 文档** - API Extractor 可以为每个项目生成“文档模型”的 JSON 文件，该文件中包含了提取的类型签名和文档注释。**API 文档**配套工具可以使用这些文件来生成一个 API 索引站点，你也可以使用它们作为自定义文档的输入。

查询 [API Extractor 文档](@api-extractor/pages/overview/intro/)来了解它的工作细节。

## 什么时候使用

我们推荐在所有的 TypeScript 库项目中使用 API Extractor, 尤其是那些需要发布成 NPM 的库。

## package.json dependencies

你需要添加 `@microsoft/api-extractor` 到你的项目中：

```bash
$ rush add --package @microsoft/api-extractor --dev
```

另外，你也可以通过加载 rig 来避免添加依赖，其用法可以参考 [使用 rig 库](../intro/rig_packages.md) 一文。

## 配置

Heft 寻找 API Extractor 的配置文件 [config/api-extractor.json](@api-extractor/pages/configs/api-extractor_json/)。该文件可以通过调用 [api-extractor init](@api-extractor/pages/commands/api-extractor_init/) 命令来创建。这个文件是[riggable](../intro/rig_packages.md)。

对于更复杂的场景，[api-extractor-task.json](../configs/api-extractor-task_json.md)配置文件中的可选参数提供了一些额外的 Heft 配置。
