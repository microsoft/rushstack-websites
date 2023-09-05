---
title: rush update-cloud-credentials
---

```
用法： rush update-cloud-credentials [-h] [-i]
                                     [--credential CREDENTIAL_STRING] [-d]

（实验性）如果配置了构建缓存功能，那么该指令可以可以方便的更新基于云服务商的凭证。

可选参数：
  -h, --help            展示帮助信息并退出
  -i, --interactive     如果云服务商支持的话，可以以交互形式来更新凭证。
  --credential CREDENTIAL_STRING
                        一个将被缓存的静态凭证。
  -d, --delete          一旦指定该参数，会删除存储的凭证。
```

## 参考更多

- [启用构建缓存](../maintainer/build_cache.md)
