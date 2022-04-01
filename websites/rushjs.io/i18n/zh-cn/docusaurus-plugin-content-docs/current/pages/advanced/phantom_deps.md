---
title: 幻影依赖
---

Rush 的文章中时不时提及“幻影”和“复制体”，你是否想更多了解 JavaScript 的包管理器是如何工作的？

## 一些历史和理论

大家都知道软件**包**可以依赖其他的**包**，其生成的[依赖图](https://en.wikipedia.org/wiki/Dependency_graph)是一种[有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph)。不同于树状结构，有向无环图可以用菱形分支链接。例如，库 **A** 可能导入 **B** 和 **C**, 之后 **B** 和 **C** 被 **D** 引入, 这四个库中创建了一个**菱形依赖**。通常，编程语言的**模块解析**会沿着图的边向上查找，并且（在其他系统中）包本身被放在一个中央的存储库中，可以被多个项目共享。

由于历史原因，NodeJS 和 NPM 使用了一个不同的方法来在磁盘上组织图的物理形式，NPM 使用库的副本来表示图的顶点，以及图的边被子目录所替代。但是树状的文件夹不能组成菱形，为了解决该问题，NodeJS 增加了一个[特殊的解析规则](https://nodejs.org/api/modules.html#all-together)，起作用是引入额外的边（指向所有父亲目录的直接子文件夹）。从计算机科学的视角来看，这套规则以两种方式轻松地改变了文件系统的[树状结构](<https://en.wikipedia.org/wiki/Tree_(data_structure)>)：(1) 它可以表示一些（但不是所有）有向无环图；(2) 我们捕获了一些额外的边，它们不属于任何声明的包依赖。这些额外的边便是“幻影依赖”。

NPM 中用到的方法与传统的包管理方式有很多不同点：

- 每一个（根级）目录的 **node_module** 树来存储大量的库文件夹副本，甚至一个很小的 NodeJS 项目的文件夹下可能有超过 10,000 个文件。

- 在 NPM 2.x 版本中，**node_modules** 文件树非常深，而且存在很多重复，这可以消除换依赖。NPM 3.x 的安装算法改成了将树扁平化，这消除了大量重复想，但代价是引入了幻影依赖（图上额外的边），在某些情况下这个新算法会选择一个更久的版本的包（虽然依旧符合语义化规范）来消除包文件夹的重复。

- 安装后的 **node_modules** 树并不唯一，有很多种可能来重新组织文件夹来使得其接近菱形，并没有独一无二的“标准化”排列。安装后的树依赖于你的包管理器使用了哪种算法，NPM 自身的算法甚至对[你添加的包的次序](http://npm.github.io/how-npm-works-docs/npm3/non-determinism.html)有关。

**node_modules** 树是一个奇特的数据结构，让我们关注三个可能造成麻烦的问题，这些问题可能会导致在大型项目和 monorepo 中导致问题，我们也会展示 Rush 如何改善这些 —— 解决这些问题是 Rush 创立的动机之一。

## 幻影依赖

<img src="/images/home/card-phantom.svg" style={{ float: "right", paddingLeft: "30px" }} alt="NPM phantom dependency" />

当项目中使用了一个没有在 **package.json** 文件中定义的包时，幻影依赖便出现了。示例如下：

**my-library/package.json**

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "lib/index.js",
  "dependencies": {
    "minimatch": "^3.0.4"
  },
  "devDependencies": {
    "rimraf": "^2.6.2"
  }
}
```

代码代码可能会长成下面的样子：

**my-library/lib/index.js**

```javascript
var minimatch = require('minimatch');
var expand = require('brace-expansion'); // ???
var glob = require('glob'); // ???

// (使用这些库的代码)
```

等一下 —— 这有两个库 `brace-expansion` 和 `glob` 两个库并没在 **package.json** 文件中声明为依赖。那它们是如何运行的呢？结论是 **brace-expansion** 是 **minimatch** 的依赖，**glob** 是 **rimraf** 的依赖。安装时，NPM 会将 **my-library/node_modules** 下的文件夹铺平，由于 NodeJS 的 `require()` 函数不需要考虑 **package.json** 文件，所以它找到这些库。这也许有一些违反直觉，但是这看起来没有问题，也许这不是个 bug?

不幸的是，项目中缺少声明的依赖最好被视作一个 bug, 它可能导致一些不符合预期错误：

- **不兼容的版本：**尽管我们库的 **package.json** 明确需要 **minimatch** 的版本为 3, 我们并没有声明 **brace-expansion** 的版本，[语义化系统](https://semver.org/) 会使得当 **minimatch** 的 API 没发生变动时，**minimatch** 的 PATCH 版本完美的兼容了 **brace-expansion** 的 MAJOR 版本。在实际开发 **my-library** 时，可能永远不会遇到这种情况，相反，当随后有人以相较于我们平日测试时更新（更旧）的版本约束方式来约束 **node_modules** 排列方式来安装了我们发布的库，这个人就会变成一个受害者。

- **缺少依赖：**库 **glob** 来自于 `devDependencies` 中，这意味着只有开发 **my-library** 的开发者才会安装这些库。对于其他人，`require("glob")` 将会因 **glob** 未安装而立即抛错。只要我们发布了 **my-library**, 就会立即听到这个反馈，对吧？并不是，实际情况中，由于某些原因（例如自身使用了 **rimraf**），绝大部分用户都有 **glob** 这个库，所以看起来可以运行。只有一小部分用户会遇到导入失败的问题，这使得它看起来像是一个难以重现的问题。

**Rush 如何解决问题的：** Rush 的符号链接策略能确保每个项目下的 **node_modules** 可仅仅包含它直接的依赖。这会在构建阶段捕获到幻影依赖的问题。如果你使用 PNPM, 相同保护措施也会应用到所有间接依赖上（可以通过 **pnpmfile.js** 来解决任何“不良”的包）。

## 幻影 node_modules 文件夹

假定我们有一个 monorepo, 有人在根目录下的 **package.json** 文件增加了以下内容：

**my-monorepo/package.json**:

```json
{
  "name": "my-monorepo",
  "version": "0.0.0",
  "scripts": {
    "deploy-app": "node ./deploy-app.js"
  },
  "devDependencies": {
    "semver": "~5.6.0"
  }
}
```

这会允许人们执行 `npm run deploy-app`, 该脚本会被自动部署 monorepo 中的所有项目（不要再 Rush 中使用这种方式，请使用[自定义指令](../../maintainer/custom_commands)）。注意，这个幻想的脚本需要使用 **semver** 这个库，所以它被添加到 `devDependencies` 列表中，在项目根目录中，开发者可以在执行 `npm run deploy-app` 之前执行 `npm install`.

安装目录的结构如下：

```
- my-monorepo/
  - package.json
  - node_modules/
    - semver/
    - ...
  - my-library/
    - package.json
    - lib/
      - index.js
    - node_modules/
      - brace-expansion
      - minimatch
      - ...
```

NodeJS 的模块解析器会在父目录下寻找依赖，这意味着 **my-library/lib/index.js** 可以执行 `require("semver")` 并寻找到 **semver** 包，甚至它不会出现在 **my-library/node_modules** 下。这是一种更隐蔽的方式来捕获幻影依赖 —— 它甚至可以找到不在你的 Git 工作目录下的 **node_modules** 文件夹。

**Rush 如何解决问题的：** `rush install` 指令可以扫描所有潜在的父目录并在发现 **node_modules** 中存在幻影依赖时发出警告。
