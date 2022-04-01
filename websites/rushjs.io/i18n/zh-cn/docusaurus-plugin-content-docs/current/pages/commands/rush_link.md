---
title: rush link
---

```
用法： rush link [-h] [-f]

给所有项目的 node_modules 创建符号连接，通常情况下该操作将会在 "rush install" 或
"rush update" 后自动执行。你可以在因某些原因而执行 "rush unlink" 后，或者给 "rush
install" 和 "rush update" 中添加 "--no-link" 参数后使用 "rush link".

可选参数：
  -h, --help   展示帮助信息并退出。
  -f, --force  删除并重新创建所有链接，甚至文件系统看起来似乎不需要重新创建。
```

## 参考

- [rush unlink](../../commands/rush_unlink)
