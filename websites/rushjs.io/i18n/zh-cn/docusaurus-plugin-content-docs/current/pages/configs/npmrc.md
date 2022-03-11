---
title: .npmrc
---

这是 [rush init](../../commands/rush_init) 为 monorepo 生成的模版下的 **.npmrc** 文件：

**common/config/rush/.npmrc**

```shell
# Rush 使用该文件来配置安装阶段的 NPM 源，它可以用 PNPM, NPM 或者 Yarn. 它被诸如 "rush install",
# "rush update", "install-run.js" 脚本等使用。
#
# 注意： "rush publish" 命令使用 .npmrc-publish 文件。
#
# 在调用包管理器之前，Rush 会拷贝该文件到执行安装命令的目录中。拷贝的文件会忽略没有在该会话中定义的环境变量；
# 这避免了一些因为缺少变量而导致的问题。
#
# * * * 安全警告 * * *
#
# 不建议在机器上存储身份验证令牌，因为其他无关进程可能会读取文件。同样，该文件也可能永久存储，例如如果机器断电。
# 更安全的方式是通过环境变量来传递口令，可以通过 ${} 扩展引用到 .npmrc 中。例如：
#
#   //registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
#
registry=https://registry.npmjs.org/
always-auth=false
```

## .npmrc 文件优先

普通 Rush 操作执行如下查找：

1. 为了支持不规范的情况，NPM 配置的环境变量优先于任何 **.npmrc** 配置。环境变量名以 `npm_config_` 开头，例如设置 `npm_config_registry` 可以覆盖 **.npmrc** 中的 `registry` 设置。NPM 的设计中也可以 i 接受不规范的命名，例如 `npm_config_@example:registry`.
2. 通常的配置刚来自于 Rush 拷贝到工作目录的临时文件 **.npmrc**, 这个文件拷贝自 **common/config/rush/.npmrc**, 但是省略了很多没有定义的环境变量（解释如上）。对于更多操作。工作目录是 **common/temp**。
3. 如果包管理器没有从方法 1 或方法 2 中找到配置项，将使用用户中的 **～/.npmrc**. 用户通常存储自己的身份验证令牌在这个文件中。

以上规则同样适用于诸如 **install-run.js** 等辅助脚本。

`rush publish` 可以使用不同 **.npmrc-publish**, 。详细请参考[此文档](../../configs/npmrc-publish)。

当包管理器直接被调用时（而不是通过 Rush），那么上述规则不适用。例如，从 shell 中调用 `npm publish`, 之后将使用[包管理器的通常优先级](https://docs.npmjs.com/cli/v7/using-npm/config#npmrc-files)。通常不鼓励上述行为，你可以创建额外的 **.npmrc** 文件。

## 参考

- [NPM 源认证](../../maintainer/npm_registry_auth)
- [.npmrc-publish](../../configs/npmrc-publish) 配置文件
