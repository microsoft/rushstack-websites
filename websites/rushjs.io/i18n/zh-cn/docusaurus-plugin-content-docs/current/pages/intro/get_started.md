---
title: 快速开始
---

## 三分钟上手

想要实际体验下 Rush? 首先你需要安装 [NodeJS](https://nodejs.org/en/download/).

**从你的 shell 中安装 Rush:**

```sh
$ npm install -g @microsoft/rush
```

（当然，不要输入 **"$"**.）:-)

**如果你想看 Rush 的命令行帮助，请这样做：**

```sh
$ rush -h
```

**如果你想看看 Rush 构建的真实项目，可以执行以下指令：**

```sh
$ git clone https://github.com/microsoft/rushstack
$ cd rushstack

# 安装 NPM 包：
# (如果你没有配置 Github email, 那么加上 "--bypass-policy" 选项。)
$ rush update

# 增量安装：
$ rush update  # <-- 瞬时完成！

# 强制所有项目重新构建：
$ rush rebuild

# 增量构建：
$ rush build    # <-- 瞬时完成！

# 使用 "--verbose" 来展示每个项目在构建过程中的日志信息。
# 尽管项目时并行构建的，但是它们的日志是有序的。
$ rush rebuild --verbose
```

## 让我们开始吧！

选择适合你的教程

- [我是开发者](../../developer/new_developer) 学习如何在 Rush 下开发。

- [我是仓库的维护者](../../maintainer/setup_new_repo) 学习如何将你的仓库托管到 Rush 下。
