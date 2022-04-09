---
title: rush change
---

```
用法: rush change [-h] [-v] [--no-fetch] [-b BRANCH] [--overwrite]
                   [--email EMAIL] [--bulk] [--message MESSAGE]
                   [--bump-type {major,minor,patch,none}]

通过询问一系列的问题之后在公公文件见中生成 <branchname>-<timestamp>.json 文件。当变更版
本号时通过 `publish` 命令来消费这些文件。注意这些变更日志最终会被放到每个项目的 changelog.md
文件中。变更的类型有：MAJOR - 存在破坏性变动并且向后不兼容，例如重命名一个公共类，在公共 API 中
添加或删除一个必选参数，或者重命名一个导出的变量或函数；MINOR - 存在向后兼容（但不向前兼容）的变
化，例如增加一个公共 API 或者在公共 API 中增加一个可选参数；PATCH - 存在向前兼容、向后兼容的改
动，例如修改一个私有 API 或者修复修复某个 API 的工作逻辑。 HOTREX（实验性的） - 在某个存在的版
本上进行热修复。当增加一个热修复时，其他的变化不会增加版本号，可以通过在 rush.json 中设定参数
'hotfixChangeEnabled' 来开启。


可选参数：
  -h, --help            展示帮助信息并退出
  -v, --verify          验证是否生成了有效的变更文件
  --no-fetch            在执行 "git diff" 检测之前，跳过获取基准分支
  -b BRANCH, --target-branch BRANCH
                        一旦指定改参数，会比较当前分支和目标分支的差异。如果没有指定该
                        参数，则默认比较 "main" 分支
  --overwrite           如果某个变更日志存在，将在没有提示的情况下对该文件进行覆盖（当
                        --bulk 参数存在时会导致失败）
  --email EMAIL         邮箱地址用于变更文件中和，如果没有提供该参数，那么会在交互模式下
                        检测邮箱。
  --bulk                一旦执行改参数，那么会将相同的变更信息和变更类型应用到所有项目。
                        一旦使用该参数，同时需要指定 --message 和 --bump-type 参数。
  --message MESSAGE     当指定 --bulk 参数时，该参数会适用于所有变化的项目
  --bump-type {major,minor,patch,none}
                        当指定 --bulk 参数时，变更类型会适用于所有变化的项目
```

## 参考

- [编写变更日志](../../best_practices/change_logs)
- [rush version](../../commands/rush_version)
