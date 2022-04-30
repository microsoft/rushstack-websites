---
title: '"copy-static-assets" task'
---

这个任务是对 TypeScript 转译器的补充，它将资源复制到输出文件夹，因此可以直接通过 .js 文件引入。

## 何时使用它

当源代码使用 `import` 或 `require()` 引入资源文件时，`copy-static-assets` 任务会被调用。例如，React 项目以下面形式引入了 **src/style.css** 文件：

**src/index.tsx**

```ts
import './styles.css';

. . .
```

在 Heft 的标准配置中，TypeScript 编译器读取 **src/\*\*/.ts** 作为输入并将 **lib/\*\*/.js** 作为输出。当 Webpack 在 **lib/index.js** 中被调用时，它将处理其中的 `require("./styles.css");` 并把文件路径为 **lib/styles.css** 的文件打包。（而不是 TypeScript 代码中的 **src/styles.css**）。

## package.json dependencies

无 - 这个功能被 Heft 内部实现。

## 配置文件

接着上面的例子，我们可以通过 [typescript.json](../heft_configs/typescript_json.md) 下的 `"staticAssetsToCopy"` 字段复制 `style.css` 文件，例如：

**&lt;project folder&gt;/config/typescript.json**

```js
  . . .

  /**
   * 配置需要拷贝到 TypeScript 产物目录下的额外配置文件，
   * 例如被 import 语句解析到的文件。
   */
  "staticAssetsToCopy": {
    /**
     * 应该从源目录拷贝到目标目录的文件扩展名。
     */
    // "fileExtensions": [
    //   ".json", ".css"
    // ],

    "fileExtensions": [
      ".css"
    ],

    /**
     * 应该被包含的 Glob 语法
     */
    // "includeGlobs": [
    //   "some/path/*.js"
    // ],

    /**
     * 应该被排除的 Glob 语法，
     * 它排除了 "includeGlobs" 和 "fileExtensions" 中的匹配项。
     */
    // "excludeGlobs": [
    //   "some/path/*.css"
    // ]
  }

. . .
```
