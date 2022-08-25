---
title: 启用 CI
---

持续集成要求在提交 PR 时设定一个构建行为，这个自动化的脚本可以一些运行类似于开发人员手动执行的命令。这里会展示一些有用的额外配置项。

如果手动执行以下指令，其效果类似于：

```sh
# 获取主分支代码
$ git fetch origin main:refs/remotes/origin/main -a

# （可选）如果开发者没有创建更新日志则失败。
# 这意味着脚本因为 Rush 返回非零状态码而终止。
$ rush change -v

# 在公共文件夹下安装 NPM 包安装 NPM 包，但是并没有自动执行 "rush link"
$ rush install --no-link

# 单独执行 "rush link", 这样 CI 可以将其作为一个单独的步骤来计算开销
$ rush link

# 全量构建并实时输出细节日志
# （假定 "--ship" 已在 common/config/rush/command-line.json 中被定义）
$ rush rebuild --ship --verbose
```

这里有个小插曲 —— 如果你的 CI 环境没有预先安装 Rush, 则可以在项目的根目录下放置一个 **package.json**, 然后通过 `npm install` 来安装 Rush. 但这样也会引入一个 **node_modules** 目录, 进而导致 Rush 的防止[幻影依赖](../advanced/phantom_deps.md)的功能失效。

## install-run-rush.js 来启动 Rush

幸运的是，这里有更优雅的方式来在 CI 上安装 Rush, 所有的 Rush 仓库都会有一个 `common/scripts/install-run-rush.js` 脚本, 它会：

- 寻找 **rush.json** 文件

- 读取指定在该文件内的 `rushVersion`

- 自动在 **common/temp/install-run** 目录下安装该版本的 Rush

- 使用仓库内的 .npmrc 文件进行适当的设置

- 之后调用 Rush 工具链，并传递给它任何你提供的命令行参数

上述安装过程是有缓存的，所以上述操作并不会比直接调用 Rush 慢，事实上，对于保存之前运行结果的 CI 系统而言， **install-run-rush.js** 比 `npm install` 更快，因为它可以缓存 Git 分支上构建的不同版本的 Rush.

尝试从你的 shell 中执行脚本:

```
~$ cd my-repo
~/my-repo$ node common/scripts/install-run-rush.js --help
~/my-repo$ node common/scripts/install-run-rush.js install
```

下面我们将介绍如何将这个脚本包含到 Travis 构建定义中。

## install-run.js 来执行其他命令

此外，Rush 也提供了第二个脚本 **install-run.js** 允许你借此来执行任意的 NPM 包。例如，下面时一个打印 Rush 站点二维码的指令： :-)

```
~/my-repo$ node common/scripts/install-run.js qrcode@1.2.2 qrcode https://rushjs.io
```

注意 **install-run.js** 指令有一些不同：它必须要包含包名和其版本（可以是语义化版本，但最好写确定版本），它还需要第二个参数来指令可执行文件的具体名称（通常而言，可执行文件名与包名相同），在上述事例中，我们调用 `qrcode` 的可执行文件并指定起参数为 `https://rushjs.io`.

当然，更直接的方式是将 **qrcode** 视为某个 **package.json** 内的一个依赖，例如将其 **package.json** 放到 **tools/repo-scripts** 项目下，这种方式会被视为日常安装的一步，并被仓库的 shrinkwrap 文件记录。但是在诸如不需要 `rush install` 的 CI 任务或者即使 `rush install` 出现故障时 Git hooks 依旧可用的情况下，这种方式是不可取的。

## "rush init" 中的 Travis 示例

[Travis CI](https://travis-ci.com/) 是一个整合了 Github 的持续集成工具，它开源且免费，`rush init` 会创建一个便于使用的 **.travis.yml** 文件。注意，它使用 **install-run-rush.js** 来调用 Rush 工具。

```yaml
language: node_js
node_js:
  - '8.9.4'
script:
  - set -e

  - echo 'Checking for missing change logs...' && echo -en 'travis_fold:start:change\\r'
  - git fetch origin main:refs/remotes/origin/main -a
  - node common/scripts/install-run-rush.js change -v
  - echo -en 'travis_fold:end:change\\r'

  - echo 'Installing...' && echo -en 'travis_fold:start:install\\r'
  - node common/scripts/install-run-rush.js install
  - echo -en 'travis_fold:end:install\\r'

  - echo 'Building...' && echo -en 'travis_fold:start:build\\r'
  - node common/scripts/install-run-rush.js rebuild --verbose
  - echo -en 'travis_fold:end:build\\r'
```

关于使用 Azure Devops 构建的示例，你可以参考用于部署 Rush 的 [build.yaml 文件](https://github.com/microsoft/rushstack/blob/main/common/config/azure-pipelines/templates/build.yaml).
