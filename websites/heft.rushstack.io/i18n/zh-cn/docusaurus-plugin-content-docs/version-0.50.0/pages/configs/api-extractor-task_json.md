---
title: api-extractor-task.json
---

|                                           |                                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **File path:**                            | **&lt;project folder&gt;/config/api-extractor-task.json**                                                                               |
| [**Riggable?**](../intro/rig_packages.md) | Yes                                                                                                                                     |
| **Associated plugins:**                   | [ApiExtractorPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/ApiExtractorPlugin/ApiExtractorPlugin.ts) |

## Template

```js
/**
 * Heft 构建系统中 API Extractor 的配置项
 * 这个可选的文件定义了 Heft 的调用方式，主要由 API Extractor 的配置文件 "api-extractor.json" 控制。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/api-extractor-task.schema.json"

  /**
   * 可选地指定另一个用于继承配置的 JSON 配置文件。
   * 这是多项目之间共享配置的一种方法。
   */
  // "extends": "base-project/config/api-extractor-task.json",

  /**
   * 如果设置为 "true"，则使用项目的 TypeScript 编译器版本进行 API Extractor
   * 分析。API Extractor 内 TypeScript 编译器通常可以正确地分析由旧版本译器生成
   * 的类型，但是引用项目的编译器可能会导致问题。
   * 如果在使用 API Extractor 的内置编译器时遇到问题，请将此选项设置为 "true"。
   *
   * 它对应于 API Extractor CLI 中 "--typescript-compiler-folder" 和
   * "IExtractorInvokeOptions.typescriptCompilerFolder" 字段。该字段默认值是false。
   */
  // "useProjectTypescriptVersion": true
}
```

## 参考

- [api-extractor](../tasks/api-extractor.md) task
- [API Extractor](@api-extractor/) 官网
