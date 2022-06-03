---
title: 配置文件参考
---

## 配置文件

| 文件列表                      | 作用                                                                                                                        |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| common/temp/install-run/...   | 存储 **install-run.js** 和 **install-run-rush.js** 脚本。 可以查看[启用 CI 构建](../../maintainer/enabling_ci_builds)一文。 |
| common/temp/node_modules/...  | 安装的库，它只是 `npm install` 的输出，其中没有任何符号连接。                                                               |
| common/temp/npm-cache/...     | 本地 NPM 的缓存，由于并发问题，Rush 不会使用全局的 NPM 缓存。                                                               |
| common/temp/npm-local/...     | 基于 **npmVersion** 的配置，Rush 会在根目录安装 NPM 包，同时给每个项目创建符号链接。                                        |
| common/temp/npm-tmp/...       | NPM 安装时候创建的临时文件。                                                                                                |
| common/temp/projects/...      | **common/temp/package.json** 引用的合成项目。                                                                               |
| common/temp/rush-recycler/... | 用于加速递归删除。                                                                                                          |
| common/temp/last-install.flag | 不必关心该文件，它追踪了上次 `rush install` 成功的时间戳。                                                                  |
| common/temp/package.json      | 公共文件的定义。                                                                                                            |
| common/temp/rush-link.json    | 不必关心该文件，当你执行 `rush link` 是它会创建，并被诸如 "rush build" 等命令读取。                                         |
