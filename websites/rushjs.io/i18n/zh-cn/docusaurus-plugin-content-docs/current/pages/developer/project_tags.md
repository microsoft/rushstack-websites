---
title: 使用项目标签
---

Rush 的 **项目标签** 提供了一个很方便的办法来引用任意的 Rush 项目组，
在 **rush.json** 配置文件中使用 `"tags"` 属性可以将标签应用于项目中。

举个例子:

**rush.json**

```js
  . . .
  "projects": [
    {
      "packageName": "my-controls",
      "projectFolder": "libraries/my-controls",
      "reviewCategory": "production",

      /**
        * 设置一个可选的自定义标签可以用于筛选这个项目
        * 举例：添加 "my-custom-tag" 将允许这个项目
        * 被该命令选中 "rush list --only tag:my-custom-tag"
        */
      "tags": [ "1.0.0-release", "frontend-team" ]
    },

    {
      "packageName": "my-toolchain",
      "projectFolder": "tools/my-toolchain",
      "reviewCategory": "tools",
      "tags": [ "tools" ]
    }
  ]
  . . .
```

关于 `tag:my-custom-tag` 选择器语法的详细信息, 参考 [选择部分项目](../developer/selecting_subsets.md#selectors)。

## 标签语法

标签名称必须是一个或者多个由连字符或者斜杠分隔的单词, 单词可能包含小写 ASCII 字母、数字、`.` 和 `@` 字符。一些例子：

```bash
rush list --to tag:my-custom-tag
```

```bash
rush list --to tag:api-extractor.com
```

```bash
rush list --to tag:1.0.0
```

## 标签校验

在 **rush.json** 的 `"projects"` 数组中允许任意的 `"tags"` 字符串很容易出错。如果有人不小心拼错了标签，或者他们使用了现在已经过时的旧标签，那可能需要一段时间才能发现这个错误。你可以使用 `"allowedProjectTags"` 设置来定义一个在你的 monorepo 中要使用的固定标签列表，这也提供了一个集中的地方来记录它们的含义。

**rush.json**

```js
  . . .
  /**
    * 这是一个可以应用于 Rust 项目里的允许标签的可选但推荐的列表
    * 使用该文件中的 "tags" 设置，这个列表对于防止拼写等错误时很有用，
    * 并且它还提供了一个集中的地方来记录你的标签。如果 "allowedProjectTags" 列表是
    * 未指定的，那么允许任何有效的标签。标签名称必须是一个或者多个单词
    * 由连字符或者斜杠分隔, 单词可能包含小写 ASCII 字母、数字、
    * "." 和 "@" 字符。
    */
  "allowedProjectTags": [
    // 将此标签应用于所有是 CLI 工具的 Rust 项目
    "tools",

    // 将此标签应用于所有属于我们公司前端团队的项目
    "frontend-team",

    // 使用这个标签来标记包含 QA 测试通过的项目
    // 用于即将推出的产品。
    "1.0.0-release"
  ],  . . .
```
