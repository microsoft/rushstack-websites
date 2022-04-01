---
title: .npmrc-publish
---

这是 [rush init](../../commands/rush_init) 为 monorepo 生成的模版下的 **.npmrc-publish** 文件：

**common/config/rush/.npmrc-publish**

```shell
# 该配置文件与 common/config/rush/.npmrc, 除了 .npmrc-publish 文件适用于 "rush publish" 指令，因为
# 发布时可能需要不同于其他操作的凭据和源。
#
# this avoids problems that would otherwise result due to a missing variable being replaced by
# an empty string.
# 在调用包管理器之前，Rush 将复制此文件到 "common/temp/publish-home/.npmrc"，然后暂时架将该文件夹映射为用户的
# “主目录”。这使得在每个发布的项目中应用相同的设置。复制的文件将忽略在会话中没有定义的环境变量，这是为了避免由于空字符
# 串而导致的变量缺失的问题。
#
#
# * * * 安全警告 * * *
#
# 不建议在机器上存储身份验证令牌，因为其他无关进程可能会读取文件。同样，该文件也可能永久存储，例如如果机器断电。
# 更安全的方式是通过环境变量来传递口令，可以通过 ${} 扩展引用到 .npmrc 中。例如：
#
#   //registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
#
```

## 参考

- [.npmrc](../../configs/npmrc) 配置文件
