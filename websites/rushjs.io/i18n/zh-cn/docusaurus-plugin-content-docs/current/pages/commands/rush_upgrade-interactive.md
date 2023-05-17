---
title: rush upgrade-interactive
---

```
用法：rush upgrade-interactive [-h] [--make-consistent] [-s]

用交互式命令行来升级依赖项。
运行该命令将打开一个交互式提示，询问你要升级哪些项目和依赖项。
它将更新 package.json 文件，然后为你运行 "rush update"。
如果你使用 ensureConsistentVersions 策略，upgrade-interactive
将更新所有使用你升级的依赖项的包，
并且匹配它们的 SemVer 范围（如果提供的话）。
如果未启用 ensureConsistentVersions，upgrade-interactive
将仅更新你指定的包中的依赖项。
这可以通过使用 --make-consistent 标志来覆盖。

可选参数：
  -h, --help         显示此帮助消息并退出。
  --make-consistent  当从单个项目升级依赖项时，也升级其他项目的依赖项。
  -s, --skip-update  如果指定，将不会运行 "rush update" 命令来更新 package.json 文件。
```

## 参见

- [修改 package.json](../developer/modifying_package_json.md)
- [rush install](../commands/rush_install.md)
