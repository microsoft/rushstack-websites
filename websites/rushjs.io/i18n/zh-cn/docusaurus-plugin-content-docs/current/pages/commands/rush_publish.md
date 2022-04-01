---
title: rush publish
---

```
用法： rush publish [-h] [-a] [-b BRANCH] [-p] [--add-commit-details]
                    [--regenerate-changelogs] [-r REGISTRY] [-n TOKEN]
                    [-t TAG] [--set-access-level {public,restricted}] [--pack]
                    [--release-folder FOLDER] [--include-all]
                    [--version-policy POLICY] [--prerelease-name NAME]
                    [--partial-prerelease] [--suffix SUFFIX] [--force]
                    [--apply-git-tags-on-pack] [-c COMMIT_ID]

读取并处理由 "rush change" 生成的发布更改请求。默认情况下，这是一个只读操作，会在控制台
输出执行的操作。为了将变更日志提交并发布包，必须使用 --commit 参数，或者 --publish 参数。

可选参数
  -h, --help            展示帮助信息并退出
  -a, --apply           一旦指定该参数，则变更请求会被应用到 package.json 文件中。
  -b BRANCH, --target-branch BRANCH
                        一旦指定该参数，将会把变更和删除变更的行为提交并合并到指定分
                        支上。
  -p, --publish         一旦指定该参数，则会将变更发布到 npm 上。
  --add-commit-details  在每次变更中把提交作者和哈希值都添加到 changelog.json 文
                        件中。
  --regenerate-changelogs
                        基于当前的 JSON 内容重新生成所有 changelog 文件。
  -r REGISTRY, --registry REGISTRY
                        指定发布的 NPM 源。一旦该参数指定，那么它会组织当前的提交不
                        带标签。
  -n TOKEN, --npm-auth-token TOKEN
                        （废弃） 发布时使用认证令牌。该参数已被废弃，因为命令行参数
                        可能被其他无关的进程读取。相反，更安全的做法是通过环境变量传
                        递该口令，之后从 common/config/rush/.npmrc-publish 文
                        件中读取。
  -t TAG, --tag TAG     传递给 npm 的标签参数。NPM 默认使用 'latest' 标签，即使是
                        当前发布的版本比最近发布的版本更低，所以，对于更旧的版本发布
                        工作流而言，提供一个标签是很重要的。当存在热更新时，该参数会
                        被默认设定为 'hotfix'.
  --set-access-level {public,restricted}
                        默认情况下，当 Rush 执行 "npm publish" 时，它将发布所有访
                        问级别是 "restricted" 的 scope 包。访问级别是 "public"
                        的 scope 包可以在刚开始发布时指定标签来发布。对于那些没有
                        scope 包, NPM 会以 "public" 的访问级别发布。更多信息可以
                        参考 NPM 文档上 "npm publish" 的 "--access" 选项。
                         For more information, see the NPM
  --pack                只有使用 --include-all 时该参数才可用，它将项目打包成压缩
                        包，而不会将其发布到 NPM 仓库上。当指定该参数时，与 NPM 源
                        相关的参数想会被忽略。
  --release-folder FOLDER
                        该参数用于给 --pack 参数提供自定义的打包位置，而不是使用默
                        认值。
  --include-all         一旦指定改参数，则 rush.json 内所有设定 shouldPublish=
                        true 的项目，和指定了版本策略且其版本比旧版本新的项目都会被
                        发布。
  --version-policy POLICY
                        版本策略名，当使用 --include-all 时，只有存在版本策略的项目
                        会被发布。
  --prerelease-name NAME
                        使用预览版命名来讲其提高到预览版。不能与 --suffix 一起使用。
  --partial-prerelease  与 --prerelease-name 结合使用，只会将变更的库提升到预览版。
  --suffix SUFFIX       给所有变更的版本增加后缀。不能与 --prerelease-name 一起使用。
  --force               如果该参数与 --publish 共同使用，那么会给 npm 带上 --force.
  --apply-git-tags-on-pack
                        该参数与 --publish 和 --pack 共同使用，git 标签将会应用到
                        所有包将被应用到包上，就好像在没有 --pack 的情况下发布。
  -c COMMIT_ID, --commit COMMIT_ID
                        与 git 标签结合使用：在指定的 commit 哈希中使用 git 标签。
                        如果没有提供该参数，则使用当前的 HEAD.
```

## 参考

- [发布包](../../maintainer/publishing)
- [rush version](../../commands/rush_version)
