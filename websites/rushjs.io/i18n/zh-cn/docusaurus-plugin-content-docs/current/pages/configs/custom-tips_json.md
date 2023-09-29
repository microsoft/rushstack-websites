---
title: custom-tips.json (实验性功能)
---

这是 [rush init](../commands/rush_init.md) 为 [Custom tips](../maintainer/custom_tips.md) 功能生成的模板配置文件。

**common/config/rush/custom-tips.json**

```js
/**
 * 这个配置文件允许仓库维护者配置与某些 Rush 消息一起打印的额外详细信息。更多文档可在
 * Rush 官方网站上找到：https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/custom-tips.schema.json",

  /**
   * 指定 Rush 要显示的 custom tips。
   */
  "customTips": [
    // {
    //   /**
    //    * (必须) 一个标识符，表示 Rush 可能打印的消息。
    //    * 如果打印了该消息，则将显示此 custom tip。
    //    * 请参阅 Rush 文档以获取可能的标识符的当前列表。
    //    */
    //   "tipId": "TIP_RUSH_INCONSISTENT_VERSIONS",
    //
    //   /**
    //    * (必须) 要为此提示显示的消息文本。
    //    */
    //   "message": "要获取额外的故障排除信息，请参阅此 wiki 文章：\n\nhttps://intranet.contoso.com/docs/pnpm-mismatch"
    // }
  ]
}
```

## 另请参阅

- [Custom tips](../maintainer/custom_tips.md)
