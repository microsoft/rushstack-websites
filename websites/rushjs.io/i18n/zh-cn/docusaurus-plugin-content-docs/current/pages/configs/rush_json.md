---
title: rush.json
---

这是 [rush init](../commands/rush_init.md) 生成的模版下的 **rush.json** 文件（在项目根目录下）：

**&lt;repo root&gt;rush.json**

```js
/**
 * 这是 Rush 的主要配置文件。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush.schema.json",

  /**
   * （必须）指定仓库内 Rush 引擎的版本。
   * Rush 的“版本选择”功能可以确保无论全局安装的哪个版本，都会在使用时用指定的版本。
   *
   * common/scripts/install-run-rush.js 也会使用这个版本。
   *
   * 注意：如果你升级了 Rush 的主版本，那么你应该所有 Rush 配置文件中替换 "$schema" 字段中的 "v5". 它可以在诸如 VSCode 的编辑器内确保 tab 补全、错误捕获等功能正确运行。
   */
  "rushVersion": "5.40.0",

  /**
   * 下面的字段选定了使用哪个包管理器及其版本。
   * Rush 会在自己的本地安装包管理器的副本，以确保构建过程与本地环境的工具完全隔离。
   *
   * 选择 "pnpmVersion", "npmVersion", 或 "yarnVersion" 中一个，可以查阅
   * Rush 文档来获取更多细节。
   */
  "pnpmVersion": "5.15.2",

  // "npmVersion": "4.5.0",
  // "yarnVersion": "1.9.4",

  /**
   * 当使用 PNPM 时的选项。
   */
  "pnpmOptions": {
    /**
     * PNPM 存储的位置，这里有两个选择：
     *
     * - "local" - 默认使用临时文件夹 "common/temp/pnpm-store" 中的 "pnpm-store" 目录。
     * - "global" - 使用 PNPM 的全局存储，其优点是可以在多个仓库中共享，缺点是构建的隔离性较差（例如，当两个仓库使用不同版本的 PNPM 时，会出现 bug 或兼容问题)。
     *
     * RUSH_PNPM_STORE_PATH 可以重写使用哪个目录来存储
     *
     * 在所有情况下，存储路径将会被环境变量 RUSH_PNPM_STORE_PATH 所覆盖。
     *
     * 默认值为 "local".
     */
    // "pnpmStore": "local",

    /**
     * 若为 true,  Rush 调用 pnpm 会增加 "--strict-peer-dependencies" 参数。
     * 如果不满足同级依赖时，此时 "rush install" 会执行失败。
     * (由于历史原因，JavaScript 的包管理器不会视作无效状态为一个错误）
     *
     * 默认值为 false 来避免避免的兼容性问题，强烈推荐设定 strictPeerDependencies=true.
     */
    // "strictPeerDependencies": true,

    /**
     * 该配置项用于指定安装期间的版本选择策略。
     *
     * 该功能需要 PNPM 的版本新于 3.1, 它对应了 PNPM 中 "--resolution-strategy"
     * 的选项。可选的值为 "fast" 和 "fewer-dependencies". PNPM 的默认值为 "fast"
     * 但是不兼容某些库，例如 DefinitelyTyped 中的 "@types" 库。Rush 默认采用了
     * "fewer-dependencies", 这会导致 PNPM 在某个版本已经安装的情况下不再安装新版本。
     * 这与 NPM 算法类似。
     *
     * 修改完该字段后，建议执行 "rush update --full" 来使得包管理器重新计算版本。
     */
    // "resolutionStrategy": "fast",

    /**
     * 如果设定为 true, 当 PNPM shrinkwrap 文件变动后没有执行 "rush update",
     * 会导致 `rush install` 抛出一个错误。
     *
     * 该功能可以防止 pnpm 的 shrinkwrap 文件("pnpm-lock.yaml") 手动修改后导致
     * 的不一致的问题。开启该功能后，"rush update" 会把哈希值作为注释附加到 shrinkwrap
     * 文件中。之后 "rush update" 和 "rush install" 会校验哈希值。注意，这不会
     * 禁止手动修改，只需要执行 "rush update" 后确保 PNPM 能报告或修复潜在的不一致。
     *
     * 使用 "--bypass-policy" 可以暂时在调用 "rush install" 时关闭校验。
     *
     * 默认值为 false.
     */
    // "preventManualShrinkwrapChanges": true,

    /**
     * 若为 true, `rush install` 会使用 PNPM 的 workspace 功能。
     *
     * 该功能使用  PNPM 来执行安装。当使用 workspace 时，Rush 会生成 "pnpm-workspace.yaml"
     * 文件，它引用了本地所有安装的项目。
     * Rush 会生成 "pnpmfile.js" 来支持优先版本功能。当安装时，pnpmfile
     * 被用来替换依赖版本中的较小的子集。如果优先版本并不是原有版本的子集，那么会保持原状。再次之前，
     * 仓库内 pnpmfile.js（如果存在）将被调用来修改依赖。
     *
     * This option is experimental. 默认值为 false.
     */
    // "useWorkspaces": true
  },

  /**
   * 老版本的 Node.js 或许缺失所需功能，其他版本的功能可能会有 bug.
   * 尤其是“最新”版本不是长期支持的版本，可能出现倒退。
   *
   * 指定语义化版本来确保开发者使用恰当的 Node.js 版本。
   *
   * LTS 日程: https://nodejs.org/en/about/releases/
   * LTS 版本: https://nodejs.org/en/download/releases/
   */
  "nodeSupportedVersionRange": ">=12.13.0 <13.0.0 || >=14.15.0 <15.0.0",

  /**
   * Node.js 奇数位的版本是实验版本。偶数位的版本在成为 LTS 前，有六个月的稳定期。
   * 例如, 8.9.0 是 Node.js 8 的第一个 LTS 版本，由于 bug 不推荐生产环境下使
   * 用 LTS 前的版本，这些 bug 可能导致 Rush 出现问题。
   *
   * 正常情况下 Rush 一旦检测到 LTS 前的 Node 版本将会发出警告。
   * 如果你正在测试 LTS 前的版本，可以设置该选项来关闭警告
   *
   */
  // "suppressNodeLtsWarning": false,

  /**
   * 如果你希望依赖版本是一致的, 可以关闭注释，它类似于在以下指令前
   * 执行 "rush check".
   *
   *   rush install, rush update, rush link, rush version, rush publish
   *
   * 有时你想要开启该功能，但是需要某个包使用不同的版本，则可以使用
   * common-versions.json 中的 "allowedAlternativeVersions".
   */
  // "ensureConsistentVersions": true,

  /**
   * 如果项目目录不遵循一致的、可识别的模式，那么大型 monorepo 会令新人生畏。
   * 当系统允许文件树嵌套时，我们发现团队经常使用子目录来创建隔离的新项目。这阻止了
   * 协作与代码共享。
   *
   * Rush 开发者推荐使用“种类目录”模式，可构建的项目必须永远放到根目录下的第二层。
   * 父亲树扮演着种类的效果。它提供了一个划分相关项目的基本设施（例如："apps", "libraries",  "tools", "prototypes"），这同时鼓励团队将其项目使用统一的分类。限制成两层在初
   * 期看起来很严格，但当你有了 20 个目录，每个种类有 20 个项目后，这个范式可以轻松地
   * 支持大型项目。实践中，你会发现文件夹的层次结构偶尔需要重新平衡，但是如果这个过程非常痛苦，
   * 那么可能是你的开发风格不适合重构。重新组织种类应该是一个启发人心的讨论，它将人聚集在一起，
   * 同时也可能发现不好的代码习惯（例如，在不使用 Node.js 模块解析的情况下将文件饮用到其他项
   * 目中）。
   *
   * 默认是 projectFolderMinDepth=1 和 projectFolderMaxDepth=2.
   *
   * 为了移除这个限制，可以设定 projectFolderMinDepth=1, 同时
   * 设定 projectFolderMaxDepth 为一个更大的数字。
   */
  // "projectFolderMinDepth": 2,
  // "projectFolderMaxDepth": 2,

  /**
   * 如果 npmjs.com 源中醒了严格的包命名规则，但是早期并没有标准。
   * 一些遗留的包依旧使用非标准的包名，有时私有源也会允许这样。
   * 设定 "allowMostlyStandardPackageNames" 为 true 会降低 Rush 的
   * 包命名标准，会允许使用大写字母和未来可能放宽的规则，然而我们想要减少这
   * 些异常。许多流行的工具使用某些标点符号作为分隔符，是因为猜测它们永远不
   * 会出现在包名中，因此如果我们放松规则，很有可能出现非常混乱的问题。
   *
   * 默认值为 false.
   */
  // "allowMostlyStandardPackageNames": true,

  /**
   * 该功能帮助你审查和批准仓库内某些新引入的。例如，你也许担心许可证、
   * 代码质量、性能、或者叠加功能相同的库。在两个配置文件 "browser-approved-packages.json"
   * 和 "nonbrowser-approved-packages.json" 中可以跟踪审查情况。
   * 查看 Rush 的文档来获取更多细节。
   */
  // "approvedPackagesPolicy": {
  //   /**
  //    * 审查种类，例如：“这个库允许在原型中使用，但不允许在生产中使用”。
  //    *
  //    * 每个项目可以通过 rush.json 下 "project" 的 "reviewCategory"
  //    * 字段关联一个审查类别。审查行为被记录在
  //    * "common/config/rush/browser-approved-packages.json" 和
  //    * "nonbrowser-approved-packages.json" 文件中，它们会由 "rush
  //    * update" 自动生成。
  //    *
  //    * 对于你审查而言，指定任何颗粒度的种类都是合适的，或者你可以仅仅添
  //    * 加一个名为 "default" 的类别。
  //    */
  //   "reviewCategories": [
  //     // 一些示例类别:
  //     "production", // 生产模式下的项目
  //     "tools",      // 非生产模式，只是开发者的工具链
  //     "prototypes"  // 多数情况下应该被忽略的项目
  //   ],
  //
  //   /**
  //    * 一系列 NPM 包 scope 可以被排除在审查中。
  //    * 我们建议排出 TypeScript 的类型(@type), 因为如果它对应的代码包
  //    * 被批准，那么类型包也应该被批准。
  //    */
  //   // "ignoredNpmScopes": ["@types"]
  // },

  /**
   * 如果使用 Git 作为版本公知，那么该字段可以提供一些
   * 额外的功能。
   */
  "gitPolicy": {
    /**
     * 在一个大公司工作？ 疲惫于在工作中发现了 Git 提交中不专业的邮箱，诸如
     * "beer-lover@my-college.edu？ Rush 可以在开发者开始工作前校验
     * 邮箱。
     *
     * 定义一系列正则表达式的列表，它们表示允许的提交到 Git 上的邮箱格式。
     * 它们是不区分大小写的 JavaScript 正则。 例子：".*@example\.com"
     *
     * 重要： 由于正则表达式被编码为 JSON 字符串字面量，因此
     * 正则表达式中的转义字符需要两个反斜线，即 "\\.".
     */
    // "allowedEmailRegExps": [
    //   "[^@]+@users\\.noreply\\.github\\.com",
    //   "travis@example\\.org"
    // ],

    /**
     * 当 Rush 报告邮箱有问题时，这条通过可以包含一个推荐邮箱写法的示例
     * 确保它符合 allowedEmailRegExps 表达式。
     */
    // "sampleEmail": "mrexample@users.noreply.github.com",

    /**
     * "rush publish" 期间提交修改的提交信息
     *
     * 例如，如果你希望阻止这些提交触发 CI, 那么你可以配置你的系统
     * 遇到诸如 "[skip-ci]" 的特殊字符串来指示 CI 应该跳过，之后
     * 自定义的 Rush 消息中含有这个字符串。
     */
    // "versionBumpCommitMessage": "Applying package updates. [skip-ci]",

    /**
     * "rush version" 期间提交修改的提交信息
     *
     * 例如，如果你希望阻止这些提交触发 CI, 那么你可以配置你的系统
     * 遇到诸如 "[skip-ci]" 的特殊字符串来指示 CI 应该跳过，之后
     * 自定义的 Rush 消息中含有这个字符串。
     */
    // "changeLogUpdateCommitMessage": "Applying package updates. [skip-ci]"
  },

  "repository": {
    /**
     * Git 仓库的 URL, 被 "rush change" 使用来决定那个是你 PR 的基础分支。
     *
     * "rush change" 指令需要确定你的 PR 影响了哪些文件。
     * 如果你的 PR 中从主分支合并或 cherry-picked 了一些提交，那么这些提交
     * 将会被排除在 diff 中（因为它们属于别的 PR）。为了做到这点，Rush
     * 知道如何在 PR 中到照基础分支。这个信息不能从 Git 中单独获取，因为
     * "pull request" 不是 Git 的概念。理想情况是 Rush 使用了特定的协议
     * 来从诸如 Github, Azure DevOps 上获取这些信息。
     * 但为了简单，"rush change" 只是假设你的 PR 只是针对 rush.json 中的
     * repository.url 的仓库的主分支。如果你从 Github 上 "fork" 了一个
     * 仓库，那么该设定就不同于你的 PR 分支的仓库 URL, 此时 "rush change"
     * 会自动掉哟过 "git fetch" 来检索远程主分支的最新活动。
     *
     */
    // "url": "https://github.com/microsoft/rush-example",

    /**
     * 默认分支名，它告知 "rush change" 要与远程按个分支进行比较。
     * 默认值为 "main".
     */
    // "defaultBranch": "main",

    /**
     * 默认的远端。当 URL 没提供时候，
     * 它告知 "rush change" 要从哪个远端来进行比较。
     */
    // "defaultRemote": "origin"
  },

  /**
   * 事件钩子是指自定义的脚本。当指定事件发生时， Rush 会执行这些钩子。
   */
  "eventHooks": {
    /**
     * Rush install 发生前执行的一系列脚本。
     */
    "preRushInstall": [
      // "common/scripts/pre-rush-install.js"
    ],

    /**
     * Rush install 完成后执行的一系列脚本。
     */
    "postRushInstall": [],

    /**
    * Rush build 发生前执行的一系列脚本。
     */
    "preRushBuild": [],

    /**
      * Rush build 完成后执行的一系列脚本。
     */
    "postRushBuild": []
  },

  /**
   * 安装变种允许你维护一套平行的配置文件，它们可以用于以另一套依赖来构建整个仓库。
   * 例如，假设你将你所有的项目使用的一个重要框架的升级到新版本，但是在此期间你想要
   * 维持与旧版本的兼容性。此时，你也许想让你的 CI 两次校验整个仓库的构建产物：一次是
   * 旧版本，一次是新版本。
   *
   * Rush 的 "安装变种" 对应于以下文件夹的配置文件：
   *
   *   common/config/rush/variants/<variant_name>
   *
   * 变种文件夹包含一系列可供选择的 common-version.json 文件。其“优先版本”
   * 字段可以用来选择依赖的旧版本（在 package.json 中语义版本的范围内）
   * 执行 "rush install --variant <variant_name>". 来安装一个变量。
   *
   * 更多信息，可以参考 https://rushjs.io/pages/advanced/installation_variants/
   */
  "variants": [
    // {
    //   /**
    //    * 变种名。
    //    */
    //   "variantName": "old-sdk",
    //
    //   /**
    //    * 详实的描述
    //    */
    //   "description": "Build this repo using the previous release of the SDK"
    // }
  ],

  /**
   * Rush 可以匿名收集开发者日常数据，例如安装、构建和其他操作。你可以用它来识别工具链或
   * Rush 本身的问题。这些数据不会与微软共享。
   * 它会以 JSON 的形式被写入 common/temp 目录下。 你可以读写这些 JSON 文件并对其进行
   * 处理，这些处理脚本通常放到 "eventHooks" 中。
   */
  // "telemetryEnabled": false,

  /**
   * 允许热修复。该功能目前处于实验阶段，因此默认关闭。
   * 如果设定该属性，那么 'rush change' 只会允许被指定为“热修复”类型。该类型会
   * 在随后发布时使用到。
   */
  // "hotfixChangeEnabled": false,

  /**
   * （必须）Rush 中的项目清单
   *
   * Rush 不会使用通配符自动扫描项目，有以下原因：
   * 1. 深度优先搜索开销太大，尤其是需要重复收集列表时；
   * 2. 在带有缓存的 CI 机器上，搜索可能会遗漏掉之前构建中的文件；
   * 3. 集中式的管理所有项目以及其重要的元数据是很有用的。
   */
  "projects": [
    // {
    //   /**
    //    * 项目的 NPM 包名（必须与 package.json 匹配）
    //    */
    //   "packageName": "my-app",
    //
    //   /**
    //    * 项目的路径，相对于 rush.json 所在的目录而言。
    //    */
    //   "projectFolder": "apps/my-app",
    //
    //   /**
    //    * 仅当 subspaces.json 中的 "subspacesEnabled" 为 true 时使用。
    //    * 它指定该项目所属的子空间。如果省略，则该项目属于 "default" 子空间。
    //    */
    //   "subspaceName": "my-subspace",
    //
    //   /**
    //    * 可选的种类，它用于 "browser-approved-packages.json"
    //    * 和 "nonbrowser-approved-packages.json" 文件。该值必须
    //    * 是上文 "reviewCategories" 中定义的字符串。
    //    */
    //   "reviewCategory": "production",
    //
    //   /**
    //    * 本地项目列表，它们以 devDependencies 的形式出现，但是不能被被本地链接，
    //    * 因为它会创建一个循环依赖。相反，最后发布的版本将会被安装到公共目录下。
    //    */
    //   "cyclicDependencyProjects": [
    //     // "my-toolchain"
    //   ],
    //
    //   /**
    //    * 如果该值为 true, 那么项目将会被 "rush check" 忽略。
    //    * 默认值为 false.
    //    */
    //   // "skipRushCheck": false,
    //
    //   /**
    //    * 一个参数表明该项目是否需要被发布到 npm 上，它将影响到 Rush change
    //    * 和发布工作流，默认结果为 false.
    //    * 注意： "versionPolicyName" 和 "shouldPublish" 是二选一的，你不能
    //    * 同时定义这两个。
    //    */
    //   // "shouldPublish": false,
    //
    //   /**
    //    * 便于发布前对项目文件进行处理。
    //    *
    //    * 一旦指定，"publishFolder" 是项目子目录的相对路径。
    //    * "rush publish" 会发布子目录而不是项目目录。子目录必须包括
    //    * "package.json", 它通常是构建输出。
    //    */
    //   // "publishFolder": "temp/publish",
    //
    //   /**
    //    * 可选参数，是指项目的版本策略。版本策略定义在 "version-policies.json"
    //    * 文件内。可以查阅 "rush publish" 文档了解更多。
    //    * 注意： "versionPolicyName" 和 "shouldPublish" 是二选一的，你不能同时定义二者
    //    */
    //   // "versionPolicyName": ""
    // },
    //
    // {
    //   "packageName": "my-controls",
    //   "projectFolder": "libraries/my-controls",
    //   "reviewCategory": "production"
    // },
    //
    // {
    //   "packageName": "my-toolchain",
    //   "projectFolder": "tools/my-toolchain",
    //   "reviewCategory": "tools"
    // }
  ]
}
```
