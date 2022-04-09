---
title: 安装 Git 钩子
---

Git 版本管理系统允许配置一些钩子脚本，这些脚本将在某个行为执行前唤起（参考 [自定义 Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)），最基本的实现方式是创建一个带有通用名称的 shell 脚本，例如 **pre-commit**，**post-update**，**prepare-commit-msg** 等等。如果 Git 发现这些脚本在本地的 **.git/hooks** 目录中，它将在对应的操作执行前执行这些脚本。

出于安全性考虑，当你克隆一个仓库时候，这些脚本不会被 Git 自动拷贝下来，相反，每个开发者必须手动创建这些文件夹并将其权限设定为可执行，Rush 可以帮你自动完成这个工作。

## 配置 Rush 来安装一个 Git 钩子脚本

作为示例，假设我们发现开发者写了一个没有很好描述其工作的 commit, 这会导致 Git 记录难以理解。为了解决这个问题，可以添加一个 `commit-msg` 钩子，该钩子要求 commit 需要满足一定要求，例如，这个简单的 Bash 脚本要求至少有 3 个单词：

**common/git-hooks/commit-msg**

```bash
#!/bin/sh
#
# 这是一个 Rush 内使用 Git 示例的示例，为了开启这个钩子，需要将文件名重命名为 "commit-msg"
# 之后执行 `rush install`, 将它从 common/git-hooks 拷贝到 .git/hooks 目录下。
#
# 了解更多 Git 钩子
#
# Git 的文档可以参考： https://git-scm.com/githooks
# 一些有用的资源： https://githooks.com
#
# 关于这个示例
#
# 这个 commit-msg 钩子被 "git commit" 传入一个参数后并调用，该参数是 commit 消息文件的名称。
# 当遇到问题后，该钩子会以非零状态码退出并显示出合适的消息。
# 该钩子被允许编辑 commit 消息。

# 该示例强制要求 commit 消息中至少包含一定数量的单词。
if [ `cat $1 | wc -w` -lt 3 ]; then
  echo ""
  echo "Invalid commit message: The message must contain at least 3 words."
	exit 1
fi
```

`rush init` 后生成的示例文件中含有上述事例，你可能需要将 [common/git-hooks/commit-msg.sample](https://github.com/microsoft/rush-example/blob/main/common/git-hooks/commit-msg.sample) 拷贝到自己的仓库。

你可以按照如下方式使用它。

1. 在 **common/git-hooks** 目录下添加该文件，并在 Git 上提交。
2. 当开发者执行 `rush install` 时，Rush 将会拷贝该文件到 **.git/hooks/commit-msg** 目录下。
3. 当你执行 `git commit` 时，Git 讲找到该脚本并调用它。
4. 如果 commit 消息过短，脚本会返回非零状态码，Git 显示 `Invalid commit message` 提示并且拒绝操作。

使用 Rush 来安装这个钩子脚本需要避免使用 [Husky](https://www.npmjs.com/package/husky) 等独立解决方案。注意 Husky 预期你的仓库在根目录上有一个 **package.json** 和 **node_modules** 目录，并且 Husky 将会执行每个 Git 操作的 shell 命令（即使未使用的钩子）；使用 Rush 来安装钩子可以避免这些限制。

> **注意：**如果你需要卸载钩子，可以删除你的 **.git/hooks/** 目录下的文件。

## 在 "git commit" 时调用 Prettier

Prettier 工具保证代码遵守统一的缩进、逗号等格式。通过配置一个 `git commit` 钩子来自动调用 Prettier, 便可以在不影响其他开发者的情况下进行修复。

[启用 Prettier](../../maintainer/enabling_prettier) 一文有手把手的教学。
