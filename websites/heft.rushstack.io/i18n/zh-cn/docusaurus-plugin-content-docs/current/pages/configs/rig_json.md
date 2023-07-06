---
title: rig.json
---

|                                          |                                            |
| ---------------------------------------- | ------------------------------------------ |
| **File path:**                           | **&lt;project folder&gt;/config/rig.json** |
| [**Riggable?**](../heft/rig_packages.md) | No                                         |
| **Associated plugins:**                  |                                            |

## Template

```js
// "rig.json" 文件来指导不同的工具在外部包中寻找它们的对应配置文件。package.
// 关于该系统的文档可参考： https://www.npmjs.com/package/@rushstack/rig-package
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  /**
   * （必须）继承的 rig 包的名字。
   * 它要求 NPM 包必须带有 "-rig" 的后缀。
   */
  "rigPackageName": "example-rig",
  /**
   * （可选） 从 rig 包的配置文件中选择一个。of
   * 该命名要求是一个小写字母，用连字符分割，例如 "sample-profile".
   * 如果省略，则使用 "default" 配置项
   */
  "rigProfile": "web-library"
}
```

## 参考

- 在 Rush 中[使用 rig packages](../heft/rig_packages.md)
- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) 文档
