---
title: build-cache.json（实验性）
---

这是 [rush init](../../commands/rush_init) 为 monorepo 生成的模版下的 **build-cache.json** 文件：

**common/config/rush/build-cache.json**

```js
/**
 * 该配置项用于管理 Rush 的构建缓存功能。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
 {
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/build-cache.schema.json",

  /**
   * （必须）实验性 - 设定该值为 true 来开启构建缓存功能。
   *
   * 参考 https://rushjs.io/pages/maintainer/build_cache/ 来获取该实验性功能的更多细节。
   */
  "buildCacheEnabled": false,

  /**
   * （必须）选择把构建缓存放到哪里。
   *
   * 可选的值： "local-only", "azure-blob-storage", "amazon-s3"
   */
  "cacheProvider": "local-only",

  /**
   * 设定该值覆盖缓存入口 ID.
   * 如果设定该值，那么它必须包含一个 [hash] 占位符，
   * 它也可以包含 [projectName], [projectName:normalize], [phaseName], [phaseName:normalize], [phaseName:trimPrefix]
   */
  // "cacheEntryNamePattern": "[projectName:normalize]-[hash]"

  /**
   * 该配置项用于配置 "cacheProvider"="azure-blob-storage"
   */
  "azureBlobStorageConfiguration": {
    /**
     * （必须）用于构建缓存的 Azure storage 账户。
     */
    // "storageAccountName": "my-account",

    /**
     * （必须）用于构建缓存的容器名。
     */
    // "storageContainerName": "my-container",

    /**
     * Azure 环境内的账户。默认为 AzurePublicCloud.
     *
     * 可选的值： "AzurePublicCloud", "AzureChina", "AzureGermany", "AzureGovernment"
     */
    // "azureEnvironment": "AzurePublicCloud",

    /**
     * 缓存项目的前缀名。
     */
    // "blobPrefix": "my-prefix",

    /**
     * 如果设定为 true, 允许写入到缓存中。
     * 默认为 false.
     */
    // "isCacheWriteAllowed": true
  },

  /**
   * 该配置项用于配置 "cacheProvider"="amazon-s3"
   */
  "amazonS3Configuration": {
    /**
     * （必备） 用于建立缓存的亚马逊 S3 的桶（例如 "us-east-1"）。
     */
    // "s3Region": "us-east-1",

    /**
     * 用于建立缓存的Amazon S3中的桶的名称。
     */
    // (Required) "s3Bucket": "my-bucket",

    /**
     * 缓存项目的可选前缀（"文件夹"）。
     */
    // "s3Prefix": "my-prefix",

    /**
     * 如果设置为true，允许写入缓存。
     * 默认为false。
     */
    // "isCacheWriteAllowed": true
  }
}
```

## 参考

- [开启构建缓存](../../maintainer/build_cache)
