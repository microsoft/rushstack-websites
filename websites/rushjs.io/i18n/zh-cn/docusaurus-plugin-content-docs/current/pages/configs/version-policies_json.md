---
title: version-policies.json
---

该文件是 [rush init](../../commands/rush_init) 生成的 **version-policies.json** 模板：

**common/config/rush/version-policies.json**

```js
/**
 * 该配置文件用于使用 Rush 发布时的高级配置。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */

/**
 * 一系列版本策略的定义。“版本政策”是一个自定义的包，它会影响 "rush change",
 * "rush version", 和 "rush publish". 这个策略适用于在 rush.json 下指定了
 * "versionPolicyName" 字段的项目。
 */
[
  // {
  //   /**
  //    * （必须） 表明版本政策的种类。
  //    * （"lockStepVersion" 或 "individualVersion"）
  //    *
  //    * "lockStepVersion" 模式是指项目将会使用 "lock-step versioning". 该策略
  //    * 适用于一组作为同一个产品的可选择组件的包。整套包是一期发布，并使用相同的 NPM
  //    * 版本号。当这组内的某个包依赖其他时，语义化版本通常被限制为单一版本。
  //    */
  //   "definitionName": "lockStepVersion",
  //
  //   /**
  //    * （必须）政策名将被用于 rush.json 下的 "versionPolicyName" 字段。
  //    * 该字段同样被用于命令行参数中，例如 "--version-policy" 和 "--to-version-policy".
  //    */
  //   "policyName": "MyBigFramework",
  //
  //   /**
  //    * （必须）当前版本。当前分支下，集合内的所有包应当都是当前版本，当版本号变化时候
  //    *  Rush 用此来决定下一个版本。
  //    * (不考虑 package.json 下 "version" 字段。)
  //    */
  //   "version": "1.0.0",
  //
  //   /**
  //    * （必须） 变更类型，适用于发布下一个版本。
  //    * 当在 Git 上创建发布分支时，该字段应当根据发布类型更新。
  //    *
  //    * 有效值： "prerelease", "release", "minor", "patch", "major"
  //    */
  //   "nextBump": "prerelease",
  //
  //   /**
  //    * （可选）一旦指定，集合内的所有包共享 CHANGELOG.md 文件。
  //    * 该文件存储了所有被指定为 "main" 的项目，这些项目属于该集合。
  //    *
  //    * 如果该文件被忽略，那么集合内的每个项目会维护单独的 CHANGELOG.md.
  //    */
  //   "mainProject": "my-app"
  // },
  //
  // {
  //   /**
  //    * （必须） 表明版本政策的种类。
  //    * （"lockStepVersion" 或 "individualVersion"）
  //    *
  //    * "individualVersion" 模式表明项目将使用“单独的版本”。
  //    * 这是典型的 NPM 模式，每个项目都有独立的版本号和 CHANGELOG.md 文件。
  //    * 尽管单个 CI 负责发包，但是它们没有任何特殊关系。版本变更会依照开发者
  //    * 回答的 "rush change" 的问题。
  //    */
  //   "definitionName": "individualVersion",
  //
  //   "policyName": "MyRandomLibraries",
  //
  //   /**
  //    * （可选）该属性确保集合内的所有包使用一个主版本号。例如因为相同的主版本分支。
  //    * 他还可以阻止人们不小心对 "major" 语义版本进行了不适当的更改。 "minor" 或
  //    * "patch" 版本会依据 "rush change" 来给每个变化的项目进行独立的更改。
  //    */
  //   "lockedMajor": 3,
  //
  //   /**
  //    * （可选）当使用 Rush 管理发布时, 默认使用 "rush change" 命令来为每个被修改
  //    * 的项目进行版本变更。这些变更会产生 CHANGELOG.md 文件。如果你授权你的 CHANGELOG.md
  //    * 由手动管理或者其他的方式，那么设定 "exemptFromRushChange" 为 true 来告诉  "rush
  //    * change" 忽略这些项目。
  //    */
  //   "exemptFromRushChange": false
  // }
];
```
