---
title: 启用一些策略
---

[rush-schema.json](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/schemas/rush.schema.json) 是可以给 **rush.json** 中定义了一些额外配置项的 JSON 文件。

## projectFolderMinDepth: 控制文件夹大小

Rush 仓库可能变得非常大，当你有很多项目时（可能有几个仓库），`projectFolderMinDepth` 非常利于你指定一个标准的目录结构，以便于你可以瞬间看到哪些文件夹包含可构建的项目，我们建议约定如下：

- 仓库的顶层文件夹是 "类别文件夹"（例如："**~/demo/libraries**"）
- 项目目录永远被签到在类别文件夹下（例如："**~/demo/libraries/lib1**"）
- 项目文件夹永远处于第二级（例如：禁止嵌套成 "**~/demo/libraries/lib1/lib2**"）
- 交叉项目文件都永远被存储在公共文件夹中（例如："**~/demo/common/docs**", "**~demo/common/scripts**" 等）
- 没有其他例外

如果你想在 demo 项目尝试此政策，我们可以将项目移动到类别文件夹，比如：

**~/demo/apps/application**<br/>
**~/demo/libraries/lib1**<br/>
**~/demo/libraries/lib2**<br/>

之后，在 **~/demo/rush.json** 中强制项目必须是第二级，比如：

```javascript
  // 项目文件夹的最小深度
  //（默认值为 1, 即要求路径名中不能有斜杠）
  "projectFolderMinDepth": 2,
  // 项目文件夹的最大深度
  //（默认值为 2, 即要求路径名中只能有一个斜杠）
  "projectFolderMaxDepth": 2,
```

## allowedEmailRegExps: 避免私人邮件地址

Git 要求每一个 commit 必须有姓名和邮件地址，然而，Git 并没有办法校验这些字段，它们的默认从 PC 上全局进行获取，这很容易被忽略。当使用 Git 工作时，人们有时会使用不符合预期的邮箱来进行 commit. 如果仓库由 Github 托管，那么邮箱地址会立即可被 GitHub REST API 可查询的，这样做很容易受到垃圾邮件的侵扰。（GitHub 账户的隐私设置不会影响 "git commit"）

Rush 可以帮你解决问题，在 **rush.json** 的 "gitPolicy" 字段中允许你指定一系列邮箱匹配规则，这些规则是正则表达式。（由于它们是 JSON 字符串字面量，所以注意反斜杠的书写）

```javascript
  "gitPolicy": {
    // Git commit 的允许的可用邮箱的匹配符
    // 它们是不区分大小写的 JavaScript 正则表达式
    // Example: ".*@example\\.com"
    "allowedEmailRegExps": [
      // Require GitHub scrubbed e-mails
      "[^@]+@users\\.noreply\\.github\\.com"
    ],

    // 满足 allowedEmailRegExps 的示例，以 "Mr. Example" 来讲，其有效邮箱为 "mr-example@contoso.com"
    "sampleEmail": "mrexample@users.noreply.github.com"
  },
```

当开发者执行 `rush install` 时，Rush 会检查邮箱地址是否符合匹配规则，如果不符合，会显示如下警告：

```
$ rush install
Rush Multi-Package Build Tool

Checking Git policy for this repository.

Hey there!  To keep things tidy, this repo asks you to submit your Git commmits
using an e-mail like this pattern:

    [^@]+@users\.noreply\.github\.com

...but yours is configured like this:

    Bob <bobbles@somewhere.sketchy.int>

To fix it, you can use commands like this:

    git config --local user.name "Mr. Example"
    git config --local user.email "mrexample@users.noreply.github.com"

Aborting, so you can go fix your settings.  (Or use --bypass-policy to skip.)
```

## approvedPackagesPolicy: 检查新的 NPM 包

你的团队中的是否存在一些人会经常发现一些振奋人心的库，并尝试将它添加到 package.json 中？但是当需要对外部代码进行法律和安全审查时，这种行为可能会马上不可控。**approvedPackagesPolicy** 功能可以在新的 NPM 包被引入时进行检查。

由于需要不同程度的安全审查（例如对外发布的产品与内部项目、内部库不同），Rush 区分了“审查类别”。这使得我们可以依据项目类别来批准一个包，然而当该包被应用在其他地方时仍然被提醒。

以[创建一个新仓库](../../maintainer/setup_new_repo)为基础，下面来看如何在 rush.json 中定义一些审查类别，用于“发布”项目与“内部项目”：

```javascript
{
  "rushVersion": "4.0.0",
  "npmVersion": "5.5.1",
  "nodeSupportedVersionRange": ">=8.9.0 <9.0.0",

  "approvedPackagesPolicy": {
    "reviewCategories": [ "published", "internal" ],
    // 我们不需要审查 @types 包，因为我们可以假定非类型的库已经被批准
    "ignoredNpmScopes": [ "@types" ]
  },

  "projects": [
    {
      "packageName": "application",
      "projectFolder": "application",
      "reviewCategory": "internal"
    },
    {
      "packageName": "lib1",
      "projectFolder": "lib1",
      "reviewCategory": "internal"
    },
    {
      "packageName": "lib2",
      "projectFolder": "lib2",
      "reviewCategory": "published"
    }
  ]
}
```

当你执行 `rush install` 时，会生成两个文件来报告你的依赖。这些文件应该添加到 Git 中，并且可以配置为需要审批后才能被修改：

- **~/demo/common/config/rush/browser-approved-packages.json**: 该包被批准用在浏览器内使用，这通常比较严格，所以所有新包将被默认添加到这里。对于这些依赖而言，关注点在：_压缩后的体积有多大？_ _许可协议是什么？_ _是否存在安全性问题？_
- **~/demo/common/config/rush/nonbrowser-approved-packages.json**: 该包被批准用在除了浏览器的任何地方，这些包的关注点在于： _它是否会给扰乱 node_modules 目录？_ _是否有其他功能类似的包？_ _它是另一个包的包装还是其中有有效的代码？_

当执行完 `rush install` 后，**browser-approved-packages.json** 文件将会像这样：

```javascript
{
  "packages": [
    {
      "name": "@microsoft/gulp-core-build",
      "allowedCategories": [ "internal" ]
    },
    {
      "name": "@microsoft/node-library-build",
      "allowedCategories": [ "internal", "published" ]
    },
    {
      "name": "gulp",
      "allowedCategories": [ "internal", "published" ]
    }
  ]
}
```

对于这个示例而言，上述文件展示了外部依赖 **@microsoft/gulp-core-build** 在 一个内部项目的 package.json 文件中找到了（假设是 **~/demo/lib1**），但是没有在任何一个 "public" 项目中找到（例如 **~/demo/application**）。

Rush 没有办法判断一个 NPM 是否用于浏览器，因此对于那些不用于浏览器的文件，你必须手动将它们移动到 **browser-approved-packages.json** 内。

#### 审批的工作方式

`rush install` 执行时，文件的内容将来匹配当前 package.json 的内容，这个文件应该被提交到 Git 中。当开发者创建了一个 PR 时，PR diff 可以被用于触发一个特殊的审批。
