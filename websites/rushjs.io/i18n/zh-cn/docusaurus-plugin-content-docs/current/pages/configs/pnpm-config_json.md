---
title: pnpm-config.json
---

> 注意：此配置文件在 Rush 5.79.0 中引入。在此版本之前，PNPM 设置存储在 **rush.json** 文件的 `"pnpmOptions"` 部分。为了向后兼容，Rush 5 仍然接受 `"pnpmOptions"` 部分。如果您正在升级旧的 monorepo，为了访问这些新的 PNPM 设置，必须手动删除 **rush.json** 文件中的 `"pnpmOptions"` 设置并创建 **pnpm-config.json** 文件。

这是 [rush init](../commands/rush_init.md) 为 **pnpm-config.json** 生成的模板：

**common/config/rush/pnpm-config.json**

```js
/**
 * 此配置文件提供 PNPM 包管理器的特定设置。
 * 更多文档可在 Rush 网站上找到：https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/pnpm-config.schema.json",

  /**
   * 如果为 true，那么 `rush install` 和 `rush update` 将使用 PNPM workspaces 功能进行安装，
   * 而不是采用旧模式，由 Rush 为每个项目的 node_modules 文件夹生成符号链接。
   *
   * 使用工作区时，Rush 会生成一个 `common/temp/pnpm-workspace.yaml` 文件，引用要安装的所有本地项目。
   * Rush 还将生成 `.pnpmfile.cjs` 插件，以实现 Rush 特定的功能，例如首选版本。用户的 `common/config/rush/.pnpmfile.cjs`
   * 会通过插件调用。
   *
   * 强烈建议启用此选项。默认值为 false。
   */
  "useWorkspaces": true,

  /**
   * 此设置决定了 PNPM 在 `rush update` 期间如何选择版本号。
   * 例如，假设 `lib-x@3.0.0` 依赖于 `"lib-y": "^1.2.3"`，其最新的主要版本为 `1.8.9` 和 `2.3.4`。
   * `lowest-direct` 模式可能会选择 `lib-y@1.2.3`，而 `highest` 将选择 1.8.9，`time-based` 则会选择
   * 在发布 `lib-x@3.0.0` 时与之兼容的最高版本，以确保此版本经过“lib-x”维护人员的测试。
   * 对于本地工作区项目，`time-based` 模式类似于 `lowest-direct`，避免除非明确要求的升级。
   * 虽然 `time-based` 是最稳健的选项，但在某些未实现优化的注册表（如 npmjs.com）上可能稍慢。
   *
   * 重要提示：请注意，PNPM 8.0.0 最初默认为 `lowest-direct` 而非 `highest`，
   * 但 PNPM 在 8.6.12 版中更改了此决定，因为它让用户感到困惑。Rush 5.106.0 及更新版本
   * 通过在 pnpm-config.json 或 .npmrc 中未明确设置 `resolutionMode` 时始终默认为 `highest`
   * 来避免此困惑，无论您使用的 PNPM 版本如何。
   *
   * PNPM 文档：https://pnpm.io/npmrc#resolution-mode
   *
   * 可选值为：`highest`、`time-based` 和 `lowest-direct`。
   * 默认值为 `highest`。
   */
  // "resolutionMode": "time-based",

  /**
   * 此设置决定 PNPM 是否会自动安装（非可选）缺失的 peer 依赖项，而不是报告错误。
   * 这样可以避免在 package.json 中指定 peer 版本的麻烦，但在大型 monorepo 中通常会产生更严重的问题。
   * 这是因为 peer 依赖行为本质上很复杂，比隐形启发式更容易排查明确版本的后果。
   * 原始的 NPM RFC 讨论中指出了此功能的其他问题：https://github.com/npm/rfcs/pull/43

   * 重要提示：在没有 Rush 的情况下，PNPM 8 及更新版本的默认设置为 true；
   * 但从 Rush 5.109.0 版开始，默认值始终为 false，除非在 pnpm-config.json 或 .npmrc 中指定 `autoInstallPeers`，
   * 而不管您的 PNPM 版本如何。

   * PNPM 文档：https://pnpm.io/npmrc#auto-install-peers

   * 默认值为 false。
   */
  // "autoInstallPeers": false,

  /**
   * 如果为 true，则 Rush 在调用 PNPM 时将添加 `--strict-peer-dependencies` 命令行参数。
   * 这会导致 `rush update` 在未满足 peer 依赖项的情况下失败，这是一种无效状态，可能导致构建失败或不兼容的依赖版本。
   * （由于历史原因，JavaScript 包管理器通常不会将此无效状态视为错误。）
   *
   * PNPM 文档：https://pnpm.io/npmrc#strict-peer-dependencies
   *
   * 默认值为 false，以避免旧版兼容性问题。
   * 强烈建议设置 `strictPeerDependencies=true`。
   */
  // "strictPeerDependencies": true,

  /**
   * 提供给 PNPM 的环境变量。
   */
  // "environmentVariables": {
  //   "NODE_OPTIONS": {
  //     "value": "--max-old-space-size=4096",
  //     "override": false
  //   }
  // },

  /**
   * 指定 PNPM 存储的路径。可能有两种值：
   *
   * - `local` - 使用当前配置的临时文件夹下的 `pnpm-store` 文件夹：默认情况下为 `common/temp/pnpm-store`。
   * - `global` - 使用 PNPM 的全局存储，它的优势是可以跨多个 repo 文件夹共享，但缺点是构建隔离性较差
   *   （例如，当两个 repo 使用不同的 PNPM 版本时可能出现错误或不兼容性）
   *
   * 在这两种情况下，可以通过环境变量 `RUSH_PNPM_STORE_PATH` 覆盖存储路径。
   *
   * 默认值为 `local`。
   */
  // "pnpmStore": "global",

  /**
   * 如果为 true，则 `rush install` 将报告在未运行 `rush update` 的情况下对 PNPM 缩减文件进行手动修改的错误。
   *
   * 此功能可防止由于手动编辑 PNPM 缩减文件（`pnpm-lock.yaml`）而引入的意外不一致。
   * 启用此功能时，`rush update` 会将一个哈希值作为 YAML 注释添加到文件中，然后 `rush update` 和 `rush install` 会验证该哈希值。
   * 请注意，这并不禁止手动修改，只是要求在此之后运行 `rush update`，以确保 PNPM 能够报告或修复任何潜在的不一致。
   *
   * 在调用 `rush install` 时，可使用 `--bypass-policy` 命令行参数暂时禁用此验证。
   *
   * 默认值为 false。
   */
  // "preventManualShrinkwrapChanges": true,

  /**
   * 当项目使用 `workspace:` 依赖另一个 Rush 项目时，PNPM 通常通过在 `node_modules` 下创建符号链接进行安装。
   * 这通常效果不错，但在某些情况下，例如不同的 `peerDependencies` 版本，符号链接可能会导致问题，如不正确满足的版本。
   * 对于这种情况，可以将依赖项声明为“injected”，使 PNPM 像从注册表中真实安装一样将其构建输出复制到 `node_modules`。
   * 详情参见：https://rushjs.io/pages/advanced/injected_deps/
   *
   * 使用 Rush subspaces 时，如果 `workspace:` 引用来自其他 subspace 的项目，这类版本问题更有可能发生。
   * 这是因为符号链接将指向由另一个 PNPM 锁定文件安装的独立 `node_modules` 树。
   * 全面解决方案是启用 `alwaysInjectDependenciesFromOtherSubspaces`，这会自动将其他 subspace 中的所有项目视为
   * injected 依赖项，而无需手动配置它们。
   *
   * 注意：请谨慎使用 —— 如果有太多依赖成为 injected，过多的文件复制会减慢 `rush install` 和 `pnpm-sync` 操作。
   *
   * 默认值为 false。
   */
  "alwaysInjectDependenciesFromOtherSubspaces": false,

  /**
   * 定义 `pnpm-lock.yaml` 文件的政策。
   */
   "pnpmLockfilePolicies": {

    /**
     * 此策略会导致 "rush update" 在 `pnpm-lock.yaml` 中包含任何 SHA1 完整性哈希时报告错误。
     *
     * 对于每个 NPM 依赖项，`pnpm-lock.yaml` 通常会存储一个 `integrity` 哈希。
     * 虽然它的主要目的是检测网络请求损坏或截断，但此哈希值还可作为安全指纹，防止攻击者替换恶意的 tarball，
     * 例如，如果配置错误的 .npmrc 导致机器意外地从 npmjs.com 下载与私有 NPM 注册表匹配的包名和版本。
     * NPM 最初使用 SHA1 哈希；由于攻击者可以轻松地制作具有匹配指纹的 tarball，因此它不安全。
     * 因此，NPM 后来弃用了 SHA1，并改用加密强度高的 SHA512 哈希。
     * 尽管如此，SHA1 哈希偶尔会在 "rush update" 期间重新出现，例如由于缺少元数据回退（https://github.com/orgs/pnpm/discussions/6194）
     * 或者迁移不完整的私有注册表。
     * `disallowInsecureSha1` 策略防止这种情况发生，避免潜在的安全/合规警报。
     */
    // "disallowInsecureSha1": {
    //   /**
    //    * 启用 "disallowInsecureSha1" 策略。默认值为 false。
    //    */
    //   "enabled": true,
    //
    //   /**
    //    * 在极少数情况下，私有 NPM 注册表可能会继续为非常旧的包版本提供 SHA1 哈希，
    //    * 这可能是由于缓存问题或数据库迁移故障。
    //    * 为避免因整个 monorepo 禁用 "disallowInsecureSha1" 策略，
    //    * 可以单独忽略有问题的包版本。`exemptPackageVersions` 键是包名称，
    //    * 数组值列出确切的版本号。
    //    */
    //   "exemptPackageVersions": {
    //     "example1": ["1.0.0"],
    //     "example2": ["2.0.0", "2.0.1"]
    //   }
    // }
  },

  /**
   * "globalOverrides" 设置为覆盖 monorepo 工作区中所有项目的所有依赖项的版本选择提供了简单的机制。
   * 这些设置将被复制到 Rush 在安装过程中生成的 `common/temp/package.json` 文件的 `pnpm.overrides` 字段中。
   *
   * 优先顺序：`.pnpmfile.cjs` 拥有最高优先级，然后是 `unsupportedPackageJsonSettings`、`globalPeerDependencyRules`、
   * `globalPackageExtensions`，`globalOverrides` 拥有最低优先级。
   *
   * PNPM 文档：https://pnpm.io/package_json#pnpmoverrides
   */
  "globalOverrides": {
    // "example1": "^1.0.0",
    // "example2": "npm:@company/example2@^1.0.0"
  },

  /**
   * `globalPeerDependencyRules` 设置为 `strictPeerDependencies=true` 安装期间报告的验证错误提供了各种设置。
   * 这些设置将被复制到 Rush 在安装过程中生成的 `common/temp/package.json` 文件的 `pnpm.peerDependencyRules` 字段中。
   *
   * 优先顺序：`.pnpmfile.cjs` 拥有最高优先级，然后是 `unsupportedPackageJsonSettings`、`globalPeerDependencyRules`、
   * `globalPackageExtensions`，`globalOverrides` 拥有最低优先级。
   *
   * https://pnpm.io/package_json#pnpmpeerdependencyrules
   */
  "globalPeerDependencyRules": {
    // "ignoreMissing": ["@eslint/*"],
    // "allowedVersions": { "react": "17" },
    // "allowAny": ["@babel/*"]
  },

  /**
   * `globalPackageExtension` 设置提供了一种方法来修补 monorepo 中任何 PNPM 依赖项的 package.json 字段。
   * 这些设置将被复制到 Rush 在安装过程中生成的 `common/temp/package.json` 文件的 `pnpm.packageExtensions` 字段中。
   * `globalPackageExtension` 设置具有与 `.pnpmfile.cjs` 类似的功能，但没有可执行脚本的缺点（不确定性、不可靠的缓存、性能问题）。
   *
   * 优先顺序：`.pnpmfile.cjs` 拥有最高优先级，然后是 `unsupportedPackageJsonSettings`、`globalPeerDependencyRules`、
   * `globalPackageExtensions`，`globalOverrides` 拥有最低优先级。
   *
   * PNPM 文档：https://pnpm.io/package_json#pnpmpackageextensions
   */
  "globalPackageExtensions": {
    // "fork-ts-checker-webpack-plugin": {
    //   "dependencies": {
    //     "@babel/core": "1"
    //   },
    //   "peerDependencies": {
    //     "eslint": ">= 6"
    //   },
    //   "peerDependenciesMeta": {
    //     "eslint": {
    //       "optional": true
    //     }
    //   }
    // }
  },

  /**
   * `globalNeverBuiltDependencies` 设置会抑制指定 NPM 依赖项的 `preinstall`、`install` 和 `postinstall` 生命周期事件。
   * 这对于实践较差的脚本非常有用，例如在没有重试的情况下下载大型二进制文件，或尝试调用 C++ 编译器等操作系统工具。
   * （PNPM 的术语将这些生命周期事件称为“构建”包；它与构建系统操作 `rush build` 或 `rushx build` 无关。）
   * 这些设置将被复制到 Rush 在安装过程中生成的 `common/temp/package.json` 文件的 `pnpm.neverBuiltDependencies` 字段中。
   *
   * PNPM 文档：https://pnpm.io/package_json#pnpmneverbuiltdependencies
   */
  "globalNeverBuiltDependencies": [
    // "fsevents"
  ],

  /**
   * `globalAllowedDeprecatedVersions` 设置抑制 NPM 注册表报告为已弃用的包版本的安装警告。
   * 如果弃用的包是尚未发布修复的外部包的间接依赖项，这会很有用。
   * 这些设置将被复制到 Rush 在安装过程中生成的 `common/temp/package.json` 文件的 `pnpm.allowedDeprecatedVersions` 字段中。
   *
   * PNPM 文档：https://pnpm.io/package_json#pnpmalloweddeprecatedversions
   *
   * 如果您正在努力消除已弃用的版本，最好在各个 Rush 项目的 package.json 文件中指定 `allowedDeprecatedVersions`。
   */
  "globalAllowedDeprecatedVersions": {
    // "request": "*"
  },


  /**
   * （此字段是机器生成的） "globalPatchedDependencies" 字段由 `rush-pnpm patch-commit` 命令自动更新。
   * 它是一个字典，其中键是 NPM 包名称和确切版本，值是关联补丁文件的相对路径。
   *
   * PNPM 文档：https://pnpm.io/package_json#pnpmpatcheddependencies
   */
  "globalPatchedDependencies": { },

  /**
   * （自担风险使用） 这是一个自由形式的属性集合，将被复制到 Rush 在安装过程中生成的 `common/temp/package.json` 文件中。
   * 这为实验新的 PNPM 功能提供了一种方法。
   * 这些设置将覆盖与给定 JSON 字段关联的任何其他 Rush 配置，除了 `.pnpmfile.cjs`。
   *
   * RUSH 维护人员不支持此设置的使用，可能导致 RUSH 故障。
   * 如果您遇到缺少的 PNPM 设置，认为应该得到支持，请创建 GitHub 问题或 PR。
   * 请注意，Rush 不旨在支持所有可能的 PNPM 设置，而是提供一种经过实战检验的安装策略，
   * 以确保大型团队和项目的良好体验。
   */
  "unsupportedPackageJsonSettings": {
    // "dependencies": {
    //   "not-a-good-practice": "*"
    // },
    // "scripts": {
    //   "do-something": "echo Also not a good practice"
    // },
    // "pnpm": { "futurePnpmFeature": true }
  }
}
```
