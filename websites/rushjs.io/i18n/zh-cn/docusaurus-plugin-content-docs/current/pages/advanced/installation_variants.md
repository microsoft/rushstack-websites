---
title: 安装变种
---

有时你也许想要使用修改后的依赖来构建整个项目。例如，假设你刚刚完成一个框架的主版本升级工作，但是你想在迁移过程中保持与之前版本的兼容性。开发人员应该使用新版本的依赖，但是提交 PR 时，你想要让 CI 任务构建整个项目两次，一次是使用旧版本的依赖，一次是使用新版本的依赖。

你可以通过编写简单的脚本来搜索和替换 **package.json** 下的版本号来解决这个问题，但是你很快发现其他的文件被影响了：

- **shrinkwrap 文件**: 除非你保持两个变量的独立的 shrinkwrap 文件，否则构建不可预知。
- **common-versions.json**: `preferredVersions` 或 `allowedAlternativeVersions` 可能需要不同的版本号。
- **pnpmfile.js**: 如果你对某些有问题的包有解决方案，那么可能需要两个版本号。

这个问题看起来需要使用单独的、并行的配置文件来解决。从 Rush 5.4.0 版本，现在有开箱即用的解决方式。

## 开始一个变种

假定 "**widget-sdk**" 是刚刚发布了主版本 3 的库，我们将其升级到版本 3, 但是我们想要维持与版本 2 的兼容性，我们可以在 **package.json** 中使用语义化版本来指定一个范围：

**libraries/my-controls/package.json**

```json
{
  "name": "my-controls",
  "version": "1.0.0",
  "description": "An example library project",
  "license": "MIT",
  "main": "lib/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    "build": "node_modules/.bin/my-build"
  },
  "dependencies": {
    "widget-sdk": "^2.3.4 || ^3.0.2"
  },
  "devDependencies": {
    "my-toolchain": "^1.0.0",
    "typescript": "^3.0.3"
  }
}
```

范围 `"^2.3.4 || ^3.0.2"` 表示我们的库可以接受 **widget-sdk** 2.x 版本（但不能旧于 2.3.4 版本）或者 3.x 版本（但是不能旧于 3.0.2 版本），当你执行 `rush update` 时，你可以得到最新的兼容版本。那么如何构建和测试与旧版本 2 的库？请设置一个安装变种！

**1. 定义你的安装变种** 在 rush.json 配置文件中，我们添加了如下定义：

**\*rush.json** 摘录\*

```js
  "variants": [
    // {
    //   /**
    //    * 变种名.
    //    */
    //   "variantName": "example-variant",
    //
    //   /**
    //    * 描述信息
    //    */
    //   "description": "Build this repo using the previous release of the SDK"
    // }

    {
      "variantName": "old-widget-sdk",
      "description": "Build this repo using version 2 of the widget-sdk"
    }
  ],
```

**2, 拷贝配置文件。**为了开始这个变量，首先要将 **common/config/rush**下的配置文件拷贝到变量目录 **common/config/rush/variants/old-widget-sdk** 下。目前支持三个配置文件（将来可能会添加更多）：

- **shrinkwrap.yaml**, **npm-shrinkwrap.json**, 或者 **yarn.lock**, 由你的包管理器决定。
- **common-versions.json**
- **pnpmfile.js**, 如果你使用 PNPM.

确保已经将拷贝的文件添加到 Git 中：

```shell
$ git add .
$ git commit -m "Creating a new variant"
```

**3. 重写变种的依赖版本。**例如，我们将会将 **widget-sdk** 降级到使用 2.x 版本。这可以通过使用 Rush 的[偏好版本](../advanced/preferred_versions.md)功能实现。我们使用通配符，这样 `rush update --full` 仍然会抓取 minor/patch 版本：

**\*common-versions.json** 摘录\*

```js
  /**
   * 一个明确“偏好版本”的依赖包列表，“编号版本”通常用于保持间接依赖到特定版本，但是它通常可以是一个语义化版本范围（例如 "~1.2.3"）。
   * 同时他也会窄化任何（兼容的）语义化繁为。可以参考 Rush 文档来了解该功能的更多细节。
   */
  "preferredVersions": {

    /**
     * 当某些人请求 "^1.0.0" 是需要确保 "1.2.3" 在这个项目里可以正常工作，而不是最新版本。
     */
    // "some-library": "1.2.3"

    "widget-sdk": "^2.3.9"
  },
```

注意，`^2.3.9` 满足 **package.json** 中指定的 SemVer 范围 `^2.3.4 || ^3.0.2`.(如果不是这样，那么偏好版本将不会有任何效果。)

4. **安装你的变种并测试。**假设我们想要在变种中运行 `rush update`，来安装新的依赖版本：

```shell
$ rush update --full --variant old-widget-sdk
```

这会更新 **common/config/rush/old-widget-sdk/shrinkwrap.yaml** 文件，安装这些依赖到 **common/temp/node_modules** 下，同时在每个项目下链接这些依赖。`rush install` 命令同样支持 `--variant` 选项。当 CI 任务使用老版本的 **widget-sdk** 构建时，可以使用此命令。

现在你可以构建和测试你的安装变种：

```shell
$ rush rebuild
```

⏵ 如果你经常使用 `--variant`，你也可以使用 [RUSH_PREVIEW_VERSION](../configs/environment_vars.md).

**5. 恢复原始状态。**当你测试完变种后，你通过不带有 `--variant` 参数的 `rush install` 返回到原始状态。我们称其为“**默认变种**”，因为它与一个没有定义安装变种的仓库的默认行为相同：

```shell
# 通过不带有 `--variant` 参数的 `rush install` 恢复原始状态：
$ rush install
```

> **提示：**如果你忘记了安装变种是否被激活，你可以使用 `common/temp/current-variant.json` 文件来查看。如果你在文本编辑器中打开此文件，你应该看到一行如下：
>
> ```
> {
>  "variant": "old-widget-sdk"
> }
> ```
