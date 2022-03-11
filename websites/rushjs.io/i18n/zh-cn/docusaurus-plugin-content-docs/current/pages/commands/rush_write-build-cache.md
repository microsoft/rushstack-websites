---
title: rush write-build-cache (experimental)
---

```
用法： rush write-build-cache [-h] -c COMMAND [-v]

（实验性）如果配置了构建缓存，那么在某个项目下执行该命令，会将项目
的当前状态写入到缓存中。

可选参数：
  -h, --help            展示帮助信息并推出。
  -c COMMAND, --command COMMAND
                        （必须）在当前项目下执行的命令，会产生当前状态信息。
  -v, --verbose         显示冗长的日志信息。
```

## 参考

- [启用构建缓存](../../maintainer/build_cache)
