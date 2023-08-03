---
title: api-extractor-task.json
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **File path:** | **&lt;project folder&gt;/config/api-extractor-task.json** |
| [**Riggable?**](../intro/rig_packages.md) | Yes |
| **Associated plugin:** | [API Extractor plugin](../plugins/api-extractor.md) |
<!-- prettier-ignore-end -->

## 模板

```js
/**
 * 为 Heft 构建系统配置 API Extractor 任务。
 *
 * 这个可选的额外文件自定义了如何调用 Heft 任务。主要的分析由 API Extractor 自己的 "api-extractor.json" 配置文件控制。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/api-extractor-task.schema.json"

  /**
   * 可选地指定另一个此文件扩展自的 JSON 配置文件。这为跨多个项目共享标准设置提供了一种方式。
   */
  // "extends": "base-project/config/api-extractor-task.json",

  /**
   * 如果设置为 true，使用项目的 TypeScript 编译器版本进行 API Extractor 的分析。
   * API Extractor 包含的 TypeScript 编译器通常可以正确分析由旧编译器生成的类型定义，引用项目的编译器可能会导致问题。
   * 如果遇到了 API Extractor 包含的编译器的问题，将此选项设置为 true。
   *
   * 这对应于 API Extractor 的 "--typescript-compiler-folder" CLI 选项和
   * "IExtractorInvokeOptions.typescriptCompilerFolder" API 选项。此选项默认为 false。
   */
  // "useProjectTypescriptVersion": true
}
```

## 参见

- [API Extractor 插件](../plugins/api-extractor.md)
- [API Extractor](@api-extractor/)
