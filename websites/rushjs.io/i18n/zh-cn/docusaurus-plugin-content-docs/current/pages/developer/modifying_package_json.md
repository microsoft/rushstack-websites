---
title: 修改 package.json
---

如果你需要在项目中添加一个名为 "**example-lib**" 的依赖。如果没有使用 Rush，你可以这样做：

```sh
# 请不要在 Rush 仓库内使用以下命令
~/my-repo$ cd apps/my-app
~/my-repo/apps/my-app$ npm install --save example-lib
```

在 Rush 仓库内，你应该使用 [rush add](../../commands/rush_add) 命令：

```sh
~/my-repo$ cd apps/my-app

# 在 "my-app" 项目中添加 "example-lib" 的依赖，随后会自动执行 "rush update"
~/my-repo/apps/my-app$ rush add --package example-lib
```

`rush add` 命令也可以用来更新某个已有依赖的版本：

```sh
# 将 "my-app" 中的 "example-lib" 版本更新为 "1.2.3"
~/my-repo/apps/my-app$ rush add --package example-lib@1.2.3

# 或者将 "example-lib" 版本更新为 "^1.2.3"
~/my-repo/apps/my-app$ rush add --package example-lib@1.2.3 --caret


# 这有一个更高级的示例：通过 NPM 源处查询兼容 "^1.2.0" 的最新语义化版本，然后将其添加为 "~1.5.3" 的依赖。
#
# 注意：当在命令行中指定符号字符时，请使用引号，避免与 shell 发生冲突。
~/my-repo/apps/my-app$ rush add --package "example-lib@^1.2.0"

# 如果仓库内的其他项目正在使用 "example-lib", 可以一次性将其更新为 "1.2.3" 版本
~/my-repo/apps/my-app$ rush add --package example-lib@1.2.3 --make-consistent
```

如果你想了解更多，可以查看[rush add](../../commands/rush_add).

> **提示：VS Code 内一个有趣的功能**
>
> 如果你正在使用 VSCode, 也可以直接编辑 **package.json** 文件，在 dependencies 或 depDependencies 下输入 `"example-lib":`, VS Code 将自动查询 NPM 源的版本，并提供补全建议。在某些情况下，这种方式比 `rush add` 更便捷。
>
> 当然，如果你手动修改了 **package.json**, 随后记得执行 `rush update`.

## 更新 NPM 包的版本

`rush update --full` 指令可以安装满足 **package.json** 的最新版本。然而，如果你想更新 **package.json** 文件中的版本到较新的版本，目前 Rush 还无法在全局范围内实现。

[npm-check-update](https://www.npmjs.com/package/npm-check-updates) 会升级 Rush 仓库中的单个项目下 package.json 内版本，记得随后执行 `rush update`（而不是 `npm install`)

_注意：PNPM workspace [已经推出](https://github.com/microsoft/rushstack/pull/1938), 启用此功能后，可以使用 [pnpm update](https://pnpm.js.org/en/cli/update) 指令进行批量更新。_
