---
title: rig.json
---

## 模板

**&lt;项目文件夹&gt;/config/rig.json**

```js
// "rig.json" 文件指导工具在外部包中查找其配置文件。
// 这个系统的文档：https://www.npmjs.com/package/@rushstack/rig-package
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  /**
   * （必填）要继承的 rig 包的名称。
   * 它应该是带有 "-rig" 后缀的 NPM 包名称。
   */
  "rigPackageName": "example-rig",
  /**
   * （可选）从 rig 包中选择一个配置文件。名称必须由
   * 用连字符分隔的小写字母数字单词组成，例如 "sample-profile"。
   * 如果省略，则将使用 "default" 配置文件。
   */
  "rigProfile": "web-library"
}
```

## 参见

- 使用 Heft 的 [rig 包](../intro/rig_packages.md)
- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) 文档
