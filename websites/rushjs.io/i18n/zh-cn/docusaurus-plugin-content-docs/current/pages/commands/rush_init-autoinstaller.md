---
title: rush init-autoinstaller
---

```
用法： rush init-autoinstaller [-h] --name AUTOINSTALLER_NAME

使用该指令可以初始化一个新的自动安装文件夹。自动安装提供了一种管理一系列相关依赖的方式，
这些依赖通过被用于 "rush install" 之外的场景。可以查看 common-line.json 文档中的
示例。

可选参数：
  -h, --help            展示帮助信息并推出。
  --name AUTOINSTALLER_NAME
                        指定自动安装目录的目录名，该目录名必须符合 NPM 包的命名规
                        则。
```

## 参考

- [rush init](../../commands/rush_init)
- [rush update-autoinstaller](../../commands/rush_update-autoinstaller)
