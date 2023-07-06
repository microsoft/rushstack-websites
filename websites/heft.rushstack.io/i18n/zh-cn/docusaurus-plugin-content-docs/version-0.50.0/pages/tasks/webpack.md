---
title: '"webpack" task'
---

<!-- No we are not going to use branded capitalization like "webpack" or "npm". ;-) -->

这个任务调用 [Webpack](https://webpack.js.org/) 来打包代码，它提供的功能有：

- 将许多小的 .js 文件合并成一个大文件，以加快下载速度
- 通过诸如内联和死代码消除 (tree shaking) 等多种方式优化编译器性能。
- 默认使用 [Terser](https://terser.org/) 来实现缩短标识符来压缩和混淆代码。
- 将诸如 .css 或甚至图片等资源嵌入成 JavaScript 的对象

Webpack 也有能力作为一个通用的构建系统，例如调用一个编译器或格式化工具，然而 Heft 并不以这种方式使用它。Heft 调用 TypeScript 编译器来生成中间的 .js 文件，这些文件成为其他任务（如 Jest 或 Webpack）的输入。这种方法减少了编译器的传递次数，避免了编译器在不同的上下文下（`ts-loader`, `ts-jest`）被重新优化。

> [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial) 示例展示了使用 Webpack 和 React.

## 何时使用

Webpack 应该被用于输出为用于 Web 的打包项目，它也可以用来打包 Node.js 工具或服务，但这并不常见。

## package.json dependencies

Heft 直接依赖 Webpack, 因此你通常不需要在 **package.json** 文件中添加 Webpack. 相反，需要为你想使用的 Webpack 版本安装 Heft 的插件包：

```shell
# （选择一个）

# 如果使用 Webpack 5
$ rush add --package @rushstack/heft-webpack5-plugin --dev

# 如果使用 Webpack 4
$ rush add --package @rushstack/heft-webpack4-plugin --dev
```

你也需要在项目下安装 `@types/webpack-env`, 它提供了 Webpack 环境对应的 TypeScript 类型。

```shell
$ rush add --package @types/webpack-env --exact  --dev
```

## 配置

由于 `@types/webpack-env` 定义了全局 API（因此不能用常规的 `import` 语句访问），所以必须添加到你的 TypeScript 配置中：

**&lt;project folder&gt;/tsconfig.json**

```js
{
  "extends": "./node_modules/@rushstack/heft-web-rig/profiles/library/tsconfig-base.json",
  "compilerOptions": {
    "types": [
      "webpack-env" // <---- ADD THIS
    ]
  }
}
```

上面安装的 Heft 插件需要使用 [heft.json 配置文件](../configs/heft_json.md)加载。

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  . . .

  "heftPlugins": [
    { "plugin": "@rushstack/heft-webpack5-plugin" }  // <---- ADD THIS
  ]
}
```

接下来，在项目目录下创建一个 **webpack.config.js** 文件。这是一个简单的示例：

**&lt;project folder&gt;/webpack.config.js**

```js
'use strict';

const path = require('path');

const webpackConfig = {
  mode: 'development',
  resolve: {
    // 注意：不要在这里指定 '.ts' 或 '.tsx'. Heft 调用 Webpack 作为后处理。
    extensions: ['.js', '.jsx', '.json']
  },
  entry: {
    app: path.join(__dirname, 'lib', 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[contenthash].js'
  }
};

module.exports = webpackConfig;
```

当你在本地开发时，如果你想使用一些不同的配置，可以选择性地创建第二个文件 **webpack.dev.config.js**.

使用 `heft start` 命令来开启本地服务。

### 与 Jest 交互

Webpack 最好使用 `esnext` 格式，然而由于 Jest 的测试在 Node.js 中执行，因此 Jest 必须使用 `commonjs` 模块格式。因此，为了同时运行 Webpack 和 Jest, 你需要生成两种格式。一个简单的方法是使用 `additionalModuleKindsToEmit` 来配置一个二级输出文件夹，然后使用 `emitFolderNameForTests` 来告知 Jest 使用 CommonJS 输出。例如：

**config/typescript.json**

```js
/**
 * 配置 Heft 的 TypeScript 插件。该插件也负责管理格式化。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/typescript.schema.json",

  /**
   *
   * 可以设置为 "copy "或 "hardlink"。如果设置为 "copy", 从缓冲区复制文件。
   * 生成压缩包时该选项很有用，因为压缩文件不能很好的处理硬链接。
   * 默认值为 "hardlink"
   */
  // "copyFromCacheMode": "copy",

  /**
   * 一旦指定，还会生成 tsconfig 中指定的模块类型。
   * 注意，这些选项仅仅适用于 tsconfig.json 配置文件。
   */
  "additionalModuleKindsToEmit": [
    // {
    //   /**
    //    * （必须）必须是 "commonjs", "amd", "umd", "system", "es2015", "esnext" 之一
    //    */
    //  "moduleKind": "amd",
    //
    //   /**
    //    * （必须）输出的文件名将被重写
    //    */
    //    "outFolderName": "lib-amd"
    // }
    {
      "moduleKind": "commonjs",
      "outFolderName": "lib-commonjs"
    }
  ],

  /**
   * 指定测试将使用的中间文件夹。
   * 因为 Jest 使用 Node.js 来执行测试，模块格式必须是CommonJS。
   *
   * 默认值是"lib".
   */
  "emitFolderNameForTests": "lib-commonjs",

  /**
   * 如果设定为 "true", 则不会调用 TSlint.
   */
  // "disableTslint": true,

  /**
   * 同时写文件的最大并发数
   * 默认值为 50.
   */
  // "maxWriteParallelism": 50,

  /**
   * 描述将静态文件从 src 拷贝到 TS 输出文件夹的方式，
   * 例如它们可以被 import 语句解析。
   */
  "staticAssetsToCopy": {
    /**
     * 指定从 src 拷贝到目标文件夹下的文件扩展符。
     */
    "fileExtensions": [".css", ".png"]

    /**
     * 显式被拷贝文件的 glob 通配符
     */
    // "includeGlobs": [
    //   "some/path/*.js"
    // ],

    /**
     * 显式排出的文件的 glob 通配符
     * 它优先于 "includeGlobs" 和 "fileExtensions" 匹配的文件。
     */
    // "excludeGlobs": [
    //   "some/path/*.css"
    // ]
  }
}
```

查阅 [typescript.json](../configs/typescript_json.md) 配置文件来观察更多细节。
