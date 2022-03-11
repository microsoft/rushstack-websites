---
title: 部署项目
---

假定你的 monrepo 项目含有一个 web 服务器的 Node.js 服务，举例来说，本地 Rush 仓库内的 Node.js 服务的项目名为 `app1`, 该仓库的组织如下：

- **apps/app1**:
  - dependencies 为 NPM 上的 `ext-lib7` 和本地 `lib3`
  - devDependencies 为 NPM 上的 `ext-tool8` 和本地 `tool6`
- **apps/app2**: 依赖 `lib3` 和 `lib4`
- **libraries/lib3**: 依赖 `lib5`
- **libraries/lib4**: 没有依赖
- **libraries/lib5**: 同级依赖 `ext-lib7`
- **tools/tool6**: 没有依赖

一个构建方式是执行 `rush install` 和 `rush build`, 但是该操作会将整个仓库传递到 Node 服务上，然而，这也会引入很多无关的文件和 NPM 包。相反，我们可以只处理 `app1` 和其依赖 `ext-lib7`, `lib3`, `lib5`, 我们并不想引入诸如 `ext-tool8` 等开发依赖。

[rush deploy](../../commands/rush_deploy) 指令可以将这组文件传入到指定的服务器上。

## 配置 "rush deploy"

`rush deploy` 指令从 [common/config/rush/deploy.json](../../configs/deploy_json) 中读取配置，该文件并不是 `rush init` 生成的，而是需要执行 [rush init-deploy](../../commands/rush_init-deploy) 来创建。

继续我们的示例，我们可以使用下面指令来创建文件

```shell
# 创建用于 "app1" 的配置文件：common/config/rush/deploy.json
$ rush init-deploy --project app1
```

当 **deploy.json** 配置完成后，需要对其执行 Git commit.

## 准备构建

为了将文件复制到构建目录中，需要执行：

```shell
# 安装依赖
$ rush install

# 构建 monorepo
$ rush build

# 拷贝 app1 及其依赖到默认的目录 common/deploy
$ rush deploy
```

这将通过复制 `app1` 及其依赖到目标目录下来准备部署环境，复制后的目录结构与 monorepo 的文件结构类似：

- **common/deploy/apps/app1/...**
- **common/deploy/common/temp/node_modules/ext-lib7/...**
- **common/deploy/libraries/lib3/...**
- **common/deploy/libraries/lib4/...**

你可以在构建产物的目录中执行 `app1` 来验证是否有问题。

```shell
# 将工作目录切换到产物下的 app1 路径
$ cd common/deploy/apps/app1

# 通过 package.json 中的脚本来唤起网络服务
$ rushx start
```

如果项目运行失败（但是原本 **apps/app1** 下可以正常运行），那么你可能需要配置下 **deploy.json**, 一旦可以运行，下依旧就是将 **common/deploy** 上传到服务器上。

## 处理链接

执行 `rush install` 会给 **common/deploy** 目录创建符号链接，例如，如果你使用 PNPM, 那么 **common/deploy/apps/app1/node_modules/ext-lib7** 可能是指向 **common/deploy/common/temp/node_modules/.pnpm/...** 目下的一个链接，使用诸如 `tar` 和 `ftp` 等工具上传时可能出现问题。

**deploy.json** 下中字段 `linkCreation` 下有三个处理链接的选项。

- `"default"`: 拷贝文件时创建链接，这是默认选项，如果你的上传工具可以正确处理这些链接，则可以使用该选项。
- `"scripts"`: 将会在目录下写入一个名为 **create-links.js** 的脚本，该配置会在上传后的服务器上创建链接。
- `"none"`: 什么都不会，一些其他基于 **deploy-metadata.json** 的脚本可能在随后创建链接。

**deploy-metadata.json** 被写入部署文件中，它包含一个需要被创建链接的清单，其实力如下：

```js
{
  "scenarioName": "deploy.json",
  "mainProjectName": "app1",
  "links": [
    {
      "kind": "folderLink",
      "linkPath": "common/deploy/apps/app1/node_modules/ext-lib7",
      "targetPath": "common/deploy/common/temp/node_modules/.pnpm/registry.npmjs.org/ext-lib7/1.0.0/node_modules/ext-lib7"
    },
    . . .
  ]
}
```

如果你使用 `"linkCreation": "script"` 之后执行 `rush deploy` 会创建没有链接的 **common/deploy** 的目录，当你将这些文件上传到服务器后，你可以调用下面脚本来创建链接：

```shell
# 当文件被上传后在服务器上执行下面命令
$ node create-links.js create
```

> 注意：当使用 `"linkCreation": "script"` 时，目前的实现还没在 **node_modules/.bin** 下生成可执行命令，如果你对该问题有兴趣，请参考该 [PR](https://github.com/microsoft/rushstack/pull/2010#issuecomment-656900649).

## 引入另外的项目

继续我们的示例，假设我们想要将 `app1` 和 `app2` 合并成一个部署，由于 `app2` 并不是 `app1` 的依赖，因此不会被自动包含进去。我们可以考虑将 `app1` 放到“主项目”中（在 `deploymentProjectNames` 内配置），之后创建 `app2` 为“额外的项目”，配置文件如下：

**common/config/rush/deploy.json**

```js
{
  . . .
  // 主项目
  "deploymentProjectNames": ["app1"],
  . . .
  "projectSettings": [
    {
      "projectName": "app1",

      // 当部署 "app1" 时同时部署 "app2",
      // 我们需要明确指明它，因为 "app2" 不是 "app1" 的依赖
      "additionalProjectsToInclude": [ "app2" ]
    }
  ]
}
```

## 使用同一个配置文件进行多部署

继续我们的示例，假定我们想要 `app1` 和 `app2` 分别部署到两个不同的 web 服务器上。如果设置相同，我们可以简单地将它们添加到 `deploymentProjectNames` 数组中，如下：

**common/config/rush/deploy.json**

```js
  . . .
  "deploymentProjectNames": [ "app1", "app2" ],
  . . .
```

部署时，使用 `--project` 参数选择需要被部署的项目。例如：

```shell
# 将 app1 和其依赖项复制到 /mnt/deploy/app1
$ rush deploy --project app1 --target-folder /mnt/deploy/app1

# 将 app2 和其依赖项复制到 /mnt/deploy/app2
$ rush deploy --project app2 --target-folder /mnt/deploy/app2
```

`--target-folder` 参数用于将文件复制到自定义目录下，其默认值为 **common/deploy/**.

## 使用不同的配置文件进行多部署

继续我们的示例，假定 `app2` 单独部署，同时它的设置与 `app1` 不同。例如，假设 `app1` 的 `"linkCreation": "default"`, 但是 `app2` 的 `"linkCreation": "script"`. 我们创建两个配置文件：

- **common/config/rush/deploy.json** - 默认配置文件，它将被用于 `app1`.
- **common/config/rush/deploy-app2-example.json** - 适用于 `app2-example` 的配置文件, 它将被用于 `app2`.

上述文件都可以被 `rush init-deploy` 创建：

```shell
# 创建 common/config/rush/deploy.json
$ rush init-deploy --project app1

# 创建 common/config/rush/deploy-app2-example.json
$ rush init-deploy --project app2 --scenario app2-example
```

在 **deploy-app2-example.json** 中指定 `"linkCreation": "script"`, 然后同时使用 `--scenario` 和 `rush deploy`:

```shell
# 使用 common/config/rush/deploy.json 将 app1 和其依赖复制到 /mnt/deploy/app1
$ rush deploy --target-folder /mnt/deploy/app1

# 使用 common/config/rush/deploy-app2-example.json 将 app2 和其依赖复制到 /mnt/deploy/app2
$ rush deploy --target-folder /mnt/deploy/app2 --scenario app2-example
```

注意，`rush deploy` 不需要 `--project` 参数，因为每个配置文件中只有一个项目在 `"deploymentProjectNames"` 数组中。

## 参考

- [common/config/rush/deploy.json](../../configs/deploy_json) 配置文件
- [rush deploy](../../commands/rush_deploy) 命令行参数
- [rush init-deploy](../../commands/rush_init-deploy) 命令行参数
