---
title: '"delete-globs" task'
---

该任务实现了 [heft.json] 文件内的 `"eventActions"` 字段下的 `"actionKind": "deleteGlobs"` 类型。

## 什么时候使用它

最常见的用法是通过 `heft clean` 来删除编译产物文件夹，例如 `lib`，`temp` 和 `dist`.

## package.json dependencies

无 - 这个功能被 Heft 内部实现。

## 配置文件

在 [heft.json](../configs/heft_json.md) 配置文件内注册事件，例如：

**&lt;project folder&gt;/config/heft.json**

```js
{
  . . .

  "eventActions": [
    {
      /**
       * （必须） 应该被执行的内置的操作种类
       * "deleteGlobs" 会删除满足 glob 匹配的文件或文件夹
       */
      "actionKind": "deleteGlobs",

      /**
       * （必须） 该 action 在 Heft 哪个阶段执行。
       * 注意，heft.json 注册的事件是在插件执行完后执行的
       * 例如，当 TypeScript 调用后，才会执行 "compile" 事件。
       *
       * 可选参数: "clean", "pre-compile", "compile", "bundle", "post-build"
       */
      "heftEvent": "clean",

      /**
       * （必须）用户自定义的标记，其作用是允许替换或者删除其他被添加的处理程序。
       *
       */
      "actionId": "my-example-action",

      /**
       * （必须）需要删除的 glob 匹配符号。
       * 该路径相对于项目根目录。
       * glob 语法可以参考文档：https:www.npmjs.com/package/fast-glob
       */
      "globsToDelete": [
        "dist",
        "lib",
        "lib-esnext",
        "temp"
      ]
    }
  ],

  . . .
}
```
