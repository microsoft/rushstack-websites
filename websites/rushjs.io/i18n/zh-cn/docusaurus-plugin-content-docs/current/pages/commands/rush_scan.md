---
title: rush scan
---

```
用法： rush scan [-h]

Node.js 的模块系统允许项目引入一个没有在 package.json 文件中声明的 NPM 包。像这种
“幻影依赖” 便会导致问题。Rush 和 PNPM 使用符号链接来防止幻影依赖，当开发者尝试将已有
项目迁移到 Rush 时，这些保护性措施可能会导致运行时错误。"rush scan" 指令就是修复这些
错误的工具，它会扫描 "./src" 和 "./lib" 目录下的 import 语法，诸如 "import __
from '__'", "require('__')", and "System.import('__'). 这种方法并不完美，但是
在迁移项目的过程中可以节省时间。

可选参数：
  -h, --help  展示帮助信息并退出
```

## 参考

- [幻影依赖](../../advanced/phantom_deps)
