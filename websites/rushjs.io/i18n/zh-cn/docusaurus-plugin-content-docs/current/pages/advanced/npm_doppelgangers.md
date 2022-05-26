---
title: NPM 分身
---

_首先建议先阅读 “[幻影依赖](../../advanced/phantom_deps)” 一文，因为这篇文章是其后续。_

## NPM 分身如何出现的

<img src="/images/home/card-doppel.svg" style={{ float: "right", paddingLeft: "30px" }} alt="NPM doppelganger" />

有时 **node_modules** 的数据结构会强制安装同一个包的两个**_相同版本的_**。真的吗？它是如何发生的？

假设我们有项目 **A**, 如下：

```json
{
  "name": "library-a",
  "version": "1.0.0",
  "dependencies": {
    "library-b": "^1.0.0",
    "library-c": "^1.0.0",
    "library-d": "^1.0.0",
    "library-e": "^1.0.0"
  }
}
```

然后 **B** 和 **C** 都依赖于 **F1**:

```json
{
  "name": "library-b",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^1.0.0"
  }
}
```

```json
{
  "name": "library-c",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^1.0.0"
  }
}
```

之后 **D** 和 **E** 都依赖 **F2**:

```json
{
  "name": "library-d",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^2.0.0"
  }
}
```

```json
{
  "name": "library-e",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^2.0.0"
  }
}
```

**node_modules** 树可以把 **F1** 放在树的顶部来实现共享，但是需要把 **F2** 拷贝到子目录中：

```
- library-a/
  - package.json
  - node_modules/
    - library-b/
      - package.json
    - library-c/
      - package.json
    - library-d/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@2.0.0
    - library-e/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@2.0.0
    - library-f/
      - package.json  <-- library-f@1.0.0
```

另外一种方式是包管理器将 **F2** 放在顶部，之后拷贝 **F1**:

```
- library-a/
  - package.json
  - node_modules/
    - library-b/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@1.0.0
    - library-c/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@1.0.0
    - library-d/
      - package.json
    - library-e/
      - package.json
    - library-f/
      - package.json  <-- library-f@2.0.0
```

无论哪种方式，我们都只能在树中拷贝两个相同版本的 **library-f**, 我们将其称之为“分身”。其他语言上的包管理器不会遇到这个问题，它是 NPM 的 **node_modules** 树的特性，是必然的，是由其设计导致，无法避免。

## 分身的结果

小项目内很少遇到分身，但是在大型的 monorepo 中很常见，这会导致一些问题。

- **更慢的安装时间：**如今磁盘空间非常宝贵，但是假设你有 20 个依赖于 **F1** 的库，这会导致 20 份拷贝。假设这里有一个安装脚本，它会下载和解压大型的压缩包（例如 PhantomJS），这会在每个分身中重复执行，最终显著影响你的安装时间。

- **增大包体积：**Web 项目经常使用诸如 [webpack](https://webpack.js.org/) 等打包工具，它们会静态分析 `require()` 语句，并将其收集到一个单一的打包产物中。这些产物应该尽可能保持小，因为它会直接影响页面应用的加载时间，假设出现了不符合预期的分身（例如由于 `npm install` 操作导致的 **node_modules** 树重排），这会导致一个库拷贝了两份之后被嵌入到产物中，进而极大增加了包体积。

- **非单一的：**假设 **library-f** 暴露了一个缓存对象的 API, 其目的是想让库那所有的消费者共享一个单例，当两个不同的组件调用 `require("library-f")` 时，它们可能获取到两个不同的库，这意味着这里会有两个实例（也就是说，“全局”变量会从两个不同的闭包中获取）。这可能会导致一些难以调试的奇怪问题。

- **多重类型：**假设 **library-f** 是一个 TypeScript 库，那么编译器会遇到多个 \*.d.ts 文件。例如，每个类的声明都会有两份拷贝，由于它们是两个分开的真实文件，导致不能被符号链接复用。通常而言，在 TypeScript 中，相同的类声明被视为是不可互换的，混合后会导致编译问题。TypeScript 2.x 引入了一种检测和比较重复的类声明的方法，但是它会引入额外的复杂度。其他的构建任务可能没有如此精明。

- **语义上的分身：**假设 **F** 有一个依赖 **G**, **G** 同样被其他库使用。在这棵树上，**F1** 的第一份拷贝将从 **B** 开始寻找 **G** , 第二个拷贝将从 **C** 开始寻找 **G**. 对于两个不同的起点而言，`require()` 算法可能寻找到不同的 **G** 版本。这意味着运行时两个 **F1** 的实例可能有一些不同。或者在编译阶段，如果 **F** 导出了 TypeScript 的类，该类继承自 **G** 中定义的基类，由于相同的类从相同包的相同版本到处，可能会导致非常有迷惑性的编译错误。

- **Rush 如何改善的：** Rush 的符号链接策略会删除仓库内依赖为本地项目的分身。不幸的是，如果你使用 NPM 或 Yarn 作为包管理器，那么任何间接依赖都还存在分身。如果你选择 Rush 和 PNPM, 那么分身问题会得到了完全性的解决（因为 PNPM 的安装模型模拟了一个真正的有向无环图）。
