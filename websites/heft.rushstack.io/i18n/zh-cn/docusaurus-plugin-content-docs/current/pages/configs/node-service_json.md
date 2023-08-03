---
title: node-service.json
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **File path:** | **&lt;project folder&gt;/config/node-service.json** |
| [**Riggable?**](../intro/rig_packages.md) | Yes |
| **Associated plugin:** | [Node.js service plugin](../plugins/node-service.md) |
<!-- prettier-ignore-end -->

## 模板

```js
/**
 * 配置 "heft start" 来启动一个 shell 命令，例如 Node.js 服务。
 * Heft 会监视更改，并在每次重新构建服务进程时重新启动服务。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/node-service.schema.json"

  /**
   * 可选地指定另一个此文件扩展自的 JSON 配置文件。这为跨多个项目共享标准设置提供了一种方法。
   */
  // "extends": "base-project/config/serve-command.json",

  /**
   * 指定项目的 package.json 文件中 "scripts" 命令的名称。
   * 当调用 "heft start" 时，它将使用这个 shell 命令来启动服务进程。
   *
   * 默认值："serve"
   */
  // "commandName": "serve",

  /**
   * 如果为假，那么如果在项目的 package.json 中找不到 "scripts" 命令，就会报告一个错误。
   * 如果为真，则不会采取任何行动。
   *
   * 默认值：false
   */
  // "ignoreMissingScript": false,

  /**
   * 自定义在重新启动子进程之前等待的毫秒数，从前一个进程退出时开始测量。
   * 如果这个间隔太小，那么新的进程可能会在开发人员仍在保存更改的时候启动，
   * 或者在其他监视进程仍然持有 OS 锁的时候启动。
   *
   * 默认值：2000
   */
  // "waitBeforeRestartMs": 2000,

  /**
   * 自定义在强制杀死子进程之前等待子进程被终止（SIGTERM）的毫秒数。
   *
   * 默认值：2000
   */
  // "waitForTerminateMs": 2000,

  /**
   * 自定义在放弃并且放弃子进程之前，等待子进程被杀死（SIGKILL）的毫秒数。
   *
   * 默认值：2000
   */
  // "waitForKillMs": 2000
}
```

## 参见

- [Node.js 服务插件](../plugins/node-service.md)
