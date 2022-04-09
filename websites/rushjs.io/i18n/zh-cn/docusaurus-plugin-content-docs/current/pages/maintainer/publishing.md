---
title: 发布包
---

# 如何在构建流程中使用 Rush 来自动发布更新的包

Rush 的发布流程中包含两个阶段：第一阶段是在开发期间，开发者需要提供一个变更文件来记录需要发布的变动；第二阶段是在发布期间，Rush 可以收集所有的变更新文件来更新版本、更新发布日志，并发布新的包到 npm 仓库。

## 1. 跟踪变更

只有当公共的包发生变化时候需要被记录，开发者可以在 rush.json 的 [shouldPublish](../../maintainer/setup_new_repo) 字段中指定哪些项目需要被发布，哪些不需要被发布。一旦定义公共库后，仓库管理者可以强制开发者更改公开的库后提供变更文件。开发者可以使用一个工具来生成变更文件，并在答题后提交。

### 如果让开发者强制提供变更文件

    rush change --verify

如果开发者修改了公开的仓库后但没有提供相关的变更文件，该指令会执行失败。建议将该指令添加到 CI 中，可以使没有变更文件时执行失败。

### 开发者如何生成变更文件

    rush change

执行 `rush change` 后会向开发者提出几个问题，并根据开发者的回答生成变更记录。变更记录文件包含了版本变化的类型和其描述，该文件应该被提交的仓库中。

## 2. 发布包

    rush publish

当发布更新的包时候，`rush publish` 指令会增加包的版本，并发布更新的包，它内部会处理很多事：收集所有的日志文件来确定版本变化的类型、确定需要发布的包、增加依赖包的版本，清理变更文件等。

该指令有他自己的定义，所以开发者可以在发布包的时候触发它。

对于不同的目标，`rush publish` 有一些不同的参数，例如，它支持一个模拟发布模式，该模式下可以验证变更文件并测试变更包，其用例可以参考：

### 模拟发布模式

    rush publish --apply

该模式下不会提交变更新的包，也不会真正发布包，只是模拟发布。当你想要检查版本变化和变更日志是否正确时候，可以使用该模式。

    rush publish --apply --target-branch targetBranch

上述指令与模拟发布模式一样，唯一的区别是会讲边后提交到指定分支上。

### 发布模式

发布模式下还有一些额外的参数：发布到哪个源上，使用哪个 token，是否包含提交信息。

    rush publish --apply --target-branch targetBranch --publish

上述指令将增加版本号，commit 记录到目标分支上，以及基于环境中的 npm 源来将包发布到指定源上。

    rush publish --apply --target-branch targetBranch --publish --registry registryUrl --npm-auth-token npmToken

除了之前指令的效果外，上述指令还可以使用指定的 token 来发布到指定源上。

    rush publish --apply --target-branch targetBranch --publish --registry registryUrl --npm-auth-token npmToken --add-commit-details

除了之前指令的效果外，上述指令还将包含变更日志中的提交信息。

### 打包模式

除了发布外，还可以将输出打包到 `.tgz` 文件中。

    rush publish --pack --include-all --publish

> 注意：`--publish` 参数将禁运掉模拟发布模式，这样可以将文件内容写入到磁盘上。
>
> 你也可以将该命令与 `--release-folder` 结合使用，来指定输出文件的位置。

3. 版本策略

当 Rush 内仓库数量逐渐增加时，就需要考虑如何通知项来进行不同类型的版本变更，此时，引入了版本策略这个新概念。举例来看，rush 和 rush-lib 应该是用相同的版本进行发布，这两个版本应该同时被增加；另一个例子是当开发者创建不同的分支来给不同的主版本服务，再次分支上，开发者不应该修改其主版本。版本策略解决了这种问题，它强制 rush 和 rush-lib you 相同的版本，而其他分支的主版本不可以被修改。

### 版本策略是什么

版本策略是一系列定义版本如何被变更的规则，它被定义在 common/config/rush/version-policies.json 内，可以参考示例 [here](https://github.com/microsoft/rushstack/blob/main/common/config/rush/version-policies.json). 一个公开的仓库可以通过在 rush.json 中指定 versionPolicyName 来指定版本策略，示例可以参考示例 [rush 和 rush-lib 的工程配置](https://github.com/microsoft/rushstack/blob/7d05f64c3275da074825bb98d3e49ea920fcfa8f/rush.json#L482)。如果多个仓库遵循相同的规则，则可以使用一个版本策略。当你个库被指定版本策略后，它就是变成公开残酷，并可以被 "rush publish" 发布。

version-policies.json 的范式定义在 [here](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/schemas/version-policies.schema.json).

### 版本策略的两种类型

版本策略支持两种类型：lockStepVersion 和 individualVersion. 使用 lockStepVersion 的项目都有一致的版本；使用 individualVersion 的项目会根据变更文件和版本限制来自增版本。

```
[
  {
    "policyName": "myPublic",
    "definitionName": "lockStepVersion",
    "version": "1.0.0-dev.6",
    "nextBump": "prerelease"
  },
  {
    "policyName": "myInternal",
    "definitionName": "individualVersion",
    "lockedMajor": 3
  }
]
```

### 当使用版本策略时的发布过程

当使用版本策略时发布新版本需要两步：第一步是增加包的版本，第二部是将其发布。这两步骤分开是因为很多时候你需要在版本变更后、发包之前进行测试。

#### 增加版本的命令

`rush version --bump`

执行 `rush version --bump` 将会基于其版本策略来增版本号。

#### 发布包的命令

`rush publish --include-all`

执行 `rush publish --include-all` 将会发布所有已经增加版本的公开包。

## 4. 总结

总而言之，仓库内的整个发布流程都可以通过 Rush 实现自动化。
