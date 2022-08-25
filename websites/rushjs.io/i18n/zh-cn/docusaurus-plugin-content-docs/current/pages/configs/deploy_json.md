---
title: deploy.json
---

这是 [rush init-deploy](../commands/rush_init-deploy.md) 为 **deploy.json** 和 **deploy-&lt;scenario name&gt;>.json** 生成的模版文件：

**common/config/rush/deploy.json**

```js
/**
 * 这个配置文件约定了使用 "rush deploy" 时的部署场景。
 * 默认的文件是 "deploy.json"; 其他的文件名匹配 "deploy-<scenario-name>.json".
 * 更全的文档可以参考：https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/deploy-scenario.schema.json",

  /**
   * "rush deploy" 命令准备了一个构建文件夹，用于从主项目开始收集其所
   * 有依赖（包括 NPM 包和 Rush 工程）， 主项目被 "--project" 参数指定。
   * "deploymentProjectNames" 列出了 "--project" 参数可选的列表，它
   * 记录了仓库内想要部署的项目，并帮助 "rush deploy" 正确的调用。如果
   * "deploymentProjectNames" 列表内只有一个项目，那么 "--project"
   * 参数可以被忽略，同时，其列表内的项目名应该是是 rush.json 中声明的包
   * 名。
   *
   * 如果住项目包含其他无关的 Rush 工程，那么添加它们到 "projectSettings"
   * 中，之后在 "additionalProjectsToInclude" 指定它们。
   */
  "deploymentProjectNames": [ /* 在这添加你的工程 */ ],

  /**
   * 当部署一个本地 Rush 工程时，package.json 中的 "devDependencies"
   * 会被排除在外。如果你想包含它们，则设定 "includeDevDependencies" 为
   * true.
   *
   * 该参数默认值为 false.
   */
  // "includeDevDependencies": true,

  /**
   * 当部署一个本地 Rush 项目，通常将过滤 .npmignore 中内容，所以 Rush
   * 只会复制哪些被 "npm pack" 打包的文件。设定 "includeNpmIgnoreFiles"
   * 为 true 会禁止掉这些过滤，以至于所有文件都会被复制（诸如 "node_modules"
   * 等例外）。
   *
   * 该参数默认值为 false.
   */
  // "includeNpmIgnoreFiles": true,

  /**
   * 为了提高遗留包的后向兼容性，PNPm 会在 node_modules 中下载额外的链接
   * 来使得包可以引入没被声明的链接。某些情况下这种方式可能会创建双倍的链接。
   * 如果你的部署不需要这种变通方式，可以设定 "omitPnpmWorkaroundLinks"
   * 为 true 来避免创建额外的链接。
   *
   * 该参数默认值为 false.
   */
  // "omitPnpmWorkaroundLinks": true,

  /**
   * 指定创建部署目录时如何链接（符号连接，硬链接，或者 NTFS 链接）：
   *
   * - "default": 默认行为是创建文件时创建链接。
   * - "script": 写入一个名为 "create-links.js" 的 Node.js 脚本。执行时，这个脚本会创建 "deploy-metadata.json" 中描述的链接。
   * - "none": 什么都不做，稍后使用其他工具创建链接。
   */
  // "linkCreation": "script",

  /**
   * 一旦指定改参数，那么 "rush deploy" 会递归地将文件夹中的文件复制到
   * 部署的目标文件夹中 (common/deploy). 这可以用来提供额外的配置文件
   * 或者部署时所需的脚本。该路径相对于仓库根目录。
   */
  //  "folderToCopy": "repo-tools/assets/deploy-config",

  /**
   * 自定义 Rush 项目在部署阶段如何处理。
   */
  "projectSettings": [
    // {
    //   /**
    //    * 项目的包名，必须在 rush.json 中声明。
    //    */
    //   "projectName": "@my-scope/my-project",
    //
    //   /**
    //    * 一系列与该项目一起部署的 本地 项目（除了 package.json
    //    * dependencies)。指定在 rush.json 中声明的完整包名。
    //    */
    //   "additionalProjectsToInclude": [
    //     // "@my-scope/my-project2"
    //   ],
    //
    //   /**
    //    * 当部署一个项目时，其包含的依赖通常基于 package.json 中的
    //    * "dependencies", "peerDependencies" 和 "optionalDependencies"
    //    *  字段自动决定，受制于 "includeDevDependencies" 等部署设置。
    //    * 然而，当某些信息不准确时，可以使用 "additionalDependenciesToInclude"
    //    * 来在这个列表中加更多的包  However, in cases where
    //    *
    //    * 这个列表包含了 Rush 安装，Node.js 模块解析的所有包。
    //    * 如果指向本地 Rush 项目， "additionalProjectsToInclude"
    //    * 字段不会递归地应用。
    //    */
    //   "additionalDependenciesToInclude": [
    //     // "@rushstack/node-core-library"
    //   ],
    //
    //   /**
    //    * 此设置可以防止部署特定的依赖。它只会过滤项目中 package.json
    //    * 中明确声明的依赖关系。不会影响通过 "additionalProjectsToInclude"
    //    * "additionalDependenciesToInclude" 添加的依赖，也不会影响见解
    //    * 依赖。
    //    *
    //    * "*" 用于匹配任意字符。例如，如果你的项目将依赖打包，那么指定
    //    *  "dependenciesToExclude": [ "*" ] 排除 package.json
    //    * 中的所有依赖。
    //    */
    //   "dependenciesToExclude": [
    //     // "@types/*"
    //   ]
    // }
  ]
}
```

## 参考

- [构建项目](../maintainer/deploying.md)
- [rush deploy](../commands/rush_deploy.md) command-line parameters
