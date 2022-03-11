---
title: NPM 仓库认证
---

**私有 NPM 源**可以让你的 NPM 包在内部发布并使用，除了私有源需要授权外，其工作方式与公开的 [https://www.npmjs.com/](https://www.npmjs.com/) 类似。每个用户需要获取一个访问口令，通常口令会被保存在 [~/.npmrc 文件](https://docs.npmjs.com/cli/v6/configuring-npm/npmrc)内。

需要私有 NPM 源的大型项目往往有利于：

- 在团队内以私有的形式分享代码
- 代理公开仓库的代码来提高可靠性，并审计公开库，并进行安全筛选
- 通过安装预编译的工具包加速 CI 操作，而不是在每次调用工具前执行 `rush install && rush build`
- 在发布到公开的 NPM 仓库前进行安装测试
- 发布包装后的第三方库<br/>
  (与 [GitHub URL dependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#github-urls) 相比，NPM 包提供了更好的 SemVer 版本管理和更好的缓存机制。)

常用的提供商有：

对于以测试为目的的私有源头，[Verdaccio](https://verdaccio.org/)是一个基于 Node.js 的轻量级 Node.js 服务器，可以运行在 `http://localhost` 上，并实现了完整的私有仓库功能。

## 源的映射

私有源的映射被定义在 [monorepo .npmrc 文件](../../configs/npmrc)中。

下面的示例将从私有源中安装公司的库，从公共源中获取其他包，公司的库的 NPM scope 为 `@example`.

**common/config/rush/.npmrc**

```shell
# 将公司的 NPM scope ("@example")映射到私有源：
@example:registry=https://my-registry.example.com/npm-private/

# 否则，使用公共 NPM 仓库
registry=https://registry.npmjs.org/
always-auth=false

# 此处介绍如何在私有源中进行身份校验。
# 出于安全性的考虑，CI 任务需要从环境变量中获取口令，具体内容由私有源决定。
# 如果某一行的环境变量时未定义的，那么 Rush 会忽略这一行，这是为了避免从 ~/.npmrc. 中获取口令时产生一个无效的字符串。
//my-registry.example.com/npm-private/:_password=${MY_CI_TOKEN}
//my-registry.example.com/npm-private/:username=${MY_CI_USER}
//my-registry.example.com/npm-private/:always-auth=true
```

普遍的是，私有源会有**缓存代理**，它可以从公共仓库中拿到包，此时，就不需要 NPM scopes 映射了，你的配置项就会是如下：

**common/config/rush/.npmrc**

```shell
# 将所有都映射到私有源
registry=https://my-registry.example.com/npm-private/
always-auth=true

# 此处介绍如何在私有源中进行身份校验。
# 出于安全性的考虑，CI 任务需要从环境变量中获取口令，具体内容由私有源决定。
# 如果某一行的环境变量时未定义的，那么 Rush 会忽略这一行，这是为了避免从 ~/.npmrc. 中获取口令时产生一个无效的字符串。
//my-registry.example.com/npm-private/:_password=${MY_CI_TOKEN}
//my-registry.example.com/npm-private/:username=${MY_CI_USER}
```

> 可以通过 [.npmrc](../../configs/npmrc) 页来了解一些比 **.npmrc** 优先级更高的配置。

## 使用 "rush setup" 来获取口令

Rush 近期引入了一个实验性的功能：`rush install` 可以检测用户的源权限缺失或过期，如果过期，则会询问是否执行 "rush setup", 该命令会引导用户来获取口令，然后更新他们的 **~/.npmrc** 文件，新的配置会被合并到以前的配置中。

"rush setup" 交互示例如下：

```
NPM credentials are missing or expired

==> Fix this problem now? (y/N) Yes

This monorepo consumes packages from an Artifactory private NPM registry.

==> Do you already have an Artifactory user account? (y/n) Yes

Please open this URL in your web browser:

  https://my-company.jfrog.io/

Your user name appears in the upper-right corner of the JFrog website.

==> What is your Artifactory user name? example-user

Click "Edit Profile" on the JFrog website.  Click the "Generate API Key" button if you haven't already done so
previously.

==> What is your Artifactory API key? ***************

Fetching an NPM token from the Artifactory service...

Adding Artifactory token to: /home/example-user/.npmrc
```

该实现目前只支持 [JFrog Artifactory](https://jfrog.com/artifactory/), 其他服务将在未来支持。

需要在 `artifactory.json` 配置文件中设置 `"registryUrl"` 字段，并设置 `"enabled": true` 后就可以使用该功能。文件模版包含其他可选配置的文档，这些可以用来自定义该交互。

## 参考更多

- [rush setup](../../commands/rush_setup)
- [artifactory.json](../../configs/artifactory_json) 配置文件
- [.npmrc](../../configs/npmrc) 配置文件
- [.npmrc-publish](../../configs/npmrc-publish) 配置文件
