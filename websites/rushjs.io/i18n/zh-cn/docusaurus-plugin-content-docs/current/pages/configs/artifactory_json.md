---
title: artifactory.json（实验性）
---

这是 [rush init](../commands/rush_init.md) 为 monorepo 生成的模版下的 **artifactory.json** 文件：

**common/config/rush/artifactory.json**

```js
/**
 * 该配置项用于管理 Rush 和 JFrog Artifactory 服务集成。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/artifactory.schema.json",

  "packageRegistry": {
    /**
     * (Required) Set this to "true" to enable Rush to manage tokens for an Artifactory NPM registry.
     * When enabled, "rush install" will automatically detect when the user's ~/.npmrc
     * authentication token is missing or expired.  And "rush setup" will prompt the user to
     * renew their token.
     * （必须）设定该值为 "true" 来使得 Rush 管理 Artifactory NPM 的口令。当开启后，"rush install" 会自动检测
     * 用户的 ~/.npmrc 认证令牌是否缺失或过期，并且 "rush setup" 将会提示用户更新令牌。
     *
     * 默认值为 false.
     */
    "enabled": false,

    /**
     * （必须）给 NPM 源指定 URL, 它与 .npmrc 文件中的 URL 相同，应该像这样：
     *
     *   https://your-company.jfrog.io/your-project/api/npm/npm-private/
     */
    // "registryUrl": "",

    /**
     * 一系列自定义字符串，当口令更新后 "rush setup" 将其添加到用户的 ~/.npmrc 文件中。例如，这可以配置公司源，以便
     * NPM 作为一个独立命令（但是对于 "rush add" 和 "rush install" 等操作没有必要，因为它们会从 monorepo 的
     * common/config/rush/.npmrc 获取）
     *
     * 注意： ~/.npmrc 设定在给定机器上是全局的，所以添加设定时要小心，防止与其他工作区冲突。
     */
    "userNpmrcLinesToAdd": [
      // "@example:registry=https://your-company.jfrog.io/your-project/api/npm/npm-private/"
    ],

    /**
     * （必须）指定 Artifactory 控制面板的 URL, 用户在此处生成一个 API 密钥。
     * 该 URL 在 "visitWebsite" 后打印。其示例如： https://your-company.jfrog.io/
     * 指定一个空字符串来覆盖这一行。
     */
    // "artifactoryWebsiteUrl": "",

    /**
     * 该配置项允许自定义 "rush setup" 交互，例如为您的团队或配置提供消息。
     * 指定一个空字符串来覆盖这一行。
     */
    "messageOverrides": {
      /**
       * 覆盖通常所输出的消息：
       * “这个 monorepo 使用来自 Artifactory 私有 NPM 源的包”
       */
      // "introduction": "",

      /**
       * 覆盖通常所输出的消息：
       * “请联系版本库维护者，以获得设置 Artifactory 用户账户的帮助。”
       */
      // "obtainAnAccount": "",

      /**
       * 覆盖通常所输出的消息：
       * “请在浏览器中打开这个 URL：”
       *
       * 这条信息后，"artifactoryWebsiteUrl" 会打印。
       */
      // "visitWebsite": "",

      /**
       * 覆盖通常所输出的消息：
       * “您的用户名出现在 JFrog 网站的右上角”
       */
      // "locateUserName": "",

      /**
       * 覆盖通常所输出的消息：
       *
       * “在 JFrog 网站上点击 “编辑资料”。 如果还没生成米要的话，
       * 请点击“生成API密钥”按钮。”
       *
       */
      // "locateApiKey": ""
    }
  }
}
```

## 参考

- [NPM 源认证](../maintainer/npm_registry_auth.md)
