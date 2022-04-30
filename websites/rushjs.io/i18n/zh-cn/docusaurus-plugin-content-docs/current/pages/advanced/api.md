---
title: 使用 Rush 库的 API
---

Rush 通过 API 提供了自动化脚本使用的接口。它在 Rush 工程中的竭诚 API 可以参考以下文档：

&nbsp;&nbsp;&nbsp;&nbsp; [接口手册： @microsoft/rush-lib package](https://api.rushstack.io/pages/rush-lib/)

下面是一些用法示例：

> 虽然这些示例为 JavaScript 代码，但我们强烈建议使用 TypeScript. 起初需要花费些时间，但是长时间运行时，它可以节省时间和减少维护的工作。

## 读取 rush.json 配置

建议使用提供了很多数据信息的 [RushConfiguration](https://api.rushstack.io/pages/rush-lib.rushconfiguration/) 类来读取 rush.json, 而不是直接读取 rush.json 文件。

例如，以下脚本展示了 Rush 内所有的项目和它们的文件夹：

```ts
const rushLib = require('@microsoft/rush-lib');

// loadFromDefaultLocation() 会搜索父亲文件来寻找 "rush.json", 之后会解析它并加载相关的配置文件。
const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
  startingFolder: process.cwd()
});

for (const project of rushConfiguration.projects) {
  console.log(project.packageName + ':');
  console.log('  ' + project.projectRelativeFolder);
}
```

## 修改 package.json 文件

如果你想修改 **package.json** 文件，[PackageJsonEditor](https://api.rushstack.io/pages/rush-lib.packagejsoneditor/) 类提供了一些有用的校验和标准化方法：

```ts
const rushLib = require('@microsoft/rush-lib');

const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
  startingFolder: process.cwd()
});

// 它将寻找在 rush.json 中的 "@rushstack/ts-command-line", 而不需要指定 NPM 包的作用域
const project = rushConfiguration.findProjectByShorthandName('ts-command-line');

// 将 lodash 作为一个可选依赖
project.packageJsonEditor.addOrUpdateDependency('lodash', '4.17.15', 'optionalDependencies');

// 保存修改过的 package.json 文件
project.packageJsonEditor.saveIfModified();
```

## 生成 README.md 摘要

作为一个更实际的例子，[repo-toolbox/src/ReadmeAction.ts](https://github.com/microsoft/rushstack/blob/main/repo-scripts/repo-toolbox/src/ReadmeAction.ts) 展示了如何使用这些 API 来生成 Rush Stack 库的 [README.md](https://github.com/microsoft/rushstack/blob/main/README.md#published-packages).
