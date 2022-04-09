---
title: 启用构建缓存（实验性）
---

Rush 一直支持 [增量分析](../../advanced/incremental_builds) 功能，它允许 `rush build` 来跳过一些自上次构建后没有文件修改的项目（该优化同样适用于自定义指令，只要在 **custom-commands.json** 中开启 `incremental` 即可）。然而，构建产物并没有并时刻保存，因此当切换到另外一个分支时，通常需要执行 rebuild 来重新构建。

Rush 中实验性的**构建缓存**将在每个项目的构建产物中创建一个 tar 文件，该文件会被缓存，如果 `rush build` 可以匹配到缓存，则会从缓存中读取该文件，从而避免了重新构建。这就可以显著提高构建速度，例如将一个 30 分钟的构建耗时缩短到 30 秒。缓存的键值是源文件和 NPM 依赖的哈希值，与增量分析的[基本规则](../../advanced/incremental_builds)相同。

构建缓存的文件将保存在两个地方：

- **本地磁盘的缓存目录下。**这样做可以在切换分支时候不会丢掉数据，你甚至可以在机器上配置一个共享的缓存目录，其默认位置是 **common/temp/build-cache**.

- **云端（可选）。**一般而言，CI 系统可以配置成允许写入云端存储，同时每个用户只有可读权限。例如，每次 PR 被合并到 `main` 分支时，CI 系统会以此为基准进行构建并将其上传到云上。这样，对于即使是 `git clone` 的开发者而言，他们的 `rush build` 也是非常快的。

> 构建缓存被认为是跳过构建的替代方案，一旦被启动，支持增量构建的指令将从缓存中读取数据，而不是之前的“跳过”。
> 如果项目没有配置构建缓存，或者故意的禁止掉构建缓存，将会使用默认的跳过。

## 启用本地磁盘缓存

在 [build-cache.json](../../configs/build-cache_json) 中可以开启本地构建缓存，你可以从该页面拷贝或者使用 `rush init` 创建这个文件。

本地构建缓存有两个配置项：

**common/config/rush/build-cache.json**

```js
{
  . . .
  /**
   * （必须）实验性 -当该值为 true 时将会启动构建缓存。
   *
   * 可以查阅 https://rushjs.io/pages/maintainer/build_cache/ 了解更多
   */
  "buildCacheEnabled": true,

  /**
   * （必须）选择哪些项目的构建产物需要被缓存。
   *
   * 可能的值："local-only"，"azure-blob-storage"，"amazon-s3"
   */
  "cacheProvider": "local-only",

  . . .
}
```

> **升级提示：**早期版本的该功能需要在 **experiments.json** 中设定 `"buildCache": true`. 这个配置项已经被 **build-cache.json** 下的 `"buildCacheEnabled"` 替代。

## 配置项目的输出目录

当你运行 `rush rebuild --verbose` 时，会看到如下警告：

```
Project does not have a rush-project.json configuration file, or one provided by a rig, so it does not support caching.
```

构建缓存需要知道哪些目录需要被存储在 tar 的压缩包中，这些细节可能由于工具链的不同而不同，因此每个项目都需要使用 [rush-project.json](../../configs/rush-project_json) 来单独配置。

例如：

**&lt;your-project&gt;/config/rush-project.json**

```js
  . . .

  /**
   * 指定你的工具链的产物输出目录，如果此字段开启，Rush 构建缓存将从缓存中恢复这些目录。
   *
   * 字符串是项目根目录下的目录名，这些项目不应被 Git 记录到，并且必须不能包含符号链接。
   */
  "projectOutputFolderNames": ["lib", "dist"]
  . . .
}
```

建议使用 [rig 包](https://rushstack.io/pages/heft/rig_packages/) 来避免每个项目目录中都拷贝一份。

## 测试构建缓存

当开启缓存后项目的输出日志示例为：

```shell
$ rush rebuild --verbose

. . .

==[ example-project ]==============================================[ 1 of 5 ]==

This project was not found in the build cache.

Invoking: heft test --clean

. . .

Caching build output folders: lib

Successfully set cache entry.

"example-project" completed successfully in 11.27 seconds.
```

当第二次执行相同的命令时，Rush 会将压缩包解压，而不是再次执行构建任务。

```shell
$ rush rebuild --verbose

. . .

==[ example-project ]==============================================[ 1 of 5 ]==

Build cache hit.

Clearing cached folders: lib, dist

Successfully restored output from the build cache.

example-project was restored from the build cache.
```

注意 `rush rebuild` 将不会再读取缓存。将 [`RUSH_BUILD_CACHE_WRITE_ALLOWED`](../../configs/environment_vars) 的环境变量设置为 `0` 可以禁止在 `rush rebuild` 时阶段写入缓存，

默认而言，缓存的 tar 压缩包存储在 **common/temp/build-cache** 目录中，因此可以被 `rush purge` 删除。

## 启用云端存储

## 目前 `cacheProvider` 有三个选项：

- `"local-only"`：不启用云端存储，压缩包只保存在本地磁盘上
- `"azure-blob-storage"`：Microsoft Azure [blob storage container](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- `"amazon-s3"`：Amazon [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html)

（以上能力由 [modeled as Rush plugins](https://github.com/microsoft/rushstack/tree/main/rush-plugins). 自定义的云存储服务可参考该插件实现）

例如，这里是如何配置 Azure blob 容器的方法：

**common/config/rush/build-cache.json**

```js
{
  . . .
  /**
   * （必须）实验性的 - 设定为 true 启用构建缓存功能。
   *
   * 更多信息可参考 https://rushjs.io/pages/maintainer/build_cache/
   */
  "buildCacheEnabled": true,

  /**
   * （必须）选择哪些项目的构建产物需要被缓存。
   *
   * 可能的值："local-only"，"azure-blob-storage"，"amazon-s3"
   */
  "cacheProvider": "azure-blob-storage",

  /**
   * 设定 "azure-blob-storage" 时使用此配置
   */
  "azureBlobStorageConfiguration": {
    /**
     * (必须) Azure 账户名
     */
    "storageAccountName": "example",

    /**
     * Azure 存储账户中的容器名称
     */
    "storageContainerName": "my-container"

    /**
     * 当其值为 true 时候，允许像 cache 中写入
     * 默认为 false
     */
    "isCacheWriteAllowed": false

  . . .
```

注意，当设定 `"isCacheWriteAllowed": false` 时，可以防止普通用户写入容器。(稍后会使用环境变量覆盖此配置，以便 CI 任务能够写入容器。)

## 用户权限

如果你的仓库并不关心安全性，那么你可以简单地配置容器以允许匿名访问。容器可以通过包含随机字符串的 HTTPS 协议的 URL 来访问，这个 URL 很难背猜到，除非其他人可以在 Git 仓库中查看。这点通过[隐蔽性来保障安全](https://en.wikipedia.org/wiki/Security_through_obscurity)。

更安全的组织方式是对于即使只读的情况也要用户认证，Rush 提供了 [rush update-cloud-credentials](../../commands/rush_update-cloud-credentials)指令来让用户进行更简单的配置：

```shell
$ rush update-cloud-credentials --interactive


Rush Multi-Project Build Tool 5.45.6 (unmanaged) - https://rushjs.io
Node.js version is 12.20.1 (LTS)


Starting "rush update-cloud-credentials"

 ╔═════════════════════════════════════════════════════════════════════════╗
 ║             To sign in, use a web browser to open the page              ║
 ║     https://microsoft.com/devicelogin and enter the code XAYBQEGRK      ║
 ║                            to authenticate.                             ║
 ╚═════════════════════════════════════════════════════════════════════════╝
```

认证信息会被保存在用户的主目录下的 `~/.rush-user/credentials.json`.

## CI 设置

通常配置下，用户只有只读权限，缓存通常被一个账号自动更新。例如，每次 PR 被合并到 `main` 后会执行一个 CI 任务。在上述事例中，`"isCacheWriteAllowed": false` 是为了防止了用户写入缓存。CI 任务可以通过设置 [RUSH_BUILD_CACHE_WRITE_ALLOWED](../../configs/environment_vars) 环境变量来覆盖此配置，并通过 [RUSH_BUILD_CACHE_CREDENTIAL](../../configs/environment_vars) 环境变量来提供认证信息。

对于 Azure 而言，必须使用序列化的 SAS 口令来充当一个 query 参数，可以查看[此篇文章](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview) 来获取更多信息，你可以通过 [设置 > 访问密钥](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal) 页面来获取你的存储账号的访问密钥。

如果你的 CI 使用了自定义的构建系统（例如 [BuildXL](https://github.com/Microsoft/BuildXL))，那么 [rush write-build-cache](../../commands/rush_write-build-cache) 指令可以从某个项目的输出文件夹中更新缓存。

> 构建缓存功能依然在开发中，有意见或者建议请联系我们！
>
> 一些相关的 GitHub 提问：
>
> - [Build cache feature #2393](https://github.com/microsoft/rushstack/issues/2393) - the original feature spec
> - [Build Cache: split apart RUSH_BUILD_CACHE_WRITE_CREDENTIAL #2642](https://github.com/microsoft/rushstack/issues/2642)
> - [Allow project config to specify non-build-related files #2618](https://github.com/microsoft/rushstack/issues/2618)
> - ["tar" exited with code 1 while attempting to create the cache entry #2622](https://github.com/microsoft/rushstack/issues/2622)
