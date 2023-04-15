---
title: rush remove
---

```
用法：rush remove [-h] [-s] -p PACKAGE [--all]

从当前项目（由当前工作目录确定）的依赖项中删除指定的包，并运行 "rush update"。

可选参数：
  -h, --help            显示此帮助消息并退出。
  -s, --skip-update     如果指定，将不会运行 "rush update" 命令来更新 package.json 文件。
  -p PACKAGE, --package PACKAGE
                        要删除的包的名称。要删除多个包，
                        请运行 "rush remove --package foo --package bar"。
  --all                 如果指定，将从所有声明它的项目中删除依赖项。
```

## 参见

- [修改 package.json](../developer/modifying_package_json.md)
- [rush add](../commands/rush_add.md)
