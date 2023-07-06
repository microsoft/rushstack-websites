---
title: node-service.json
---

|                                          |                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **File path:**                           | **&lt;project folder&gt;/config/node-service.json**                                                                |
| [**Riggable?**](../heft/rig_packages.md) | Yes                                                                                                                |
| **Associated plugins:**                  | [NodeServicePlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/NodeServicePlugin.ts) |

## Template

```js
/**
 * 配置 "heft start" 来启动 Node.js 服务
 * Heft 会监听变化并在重新构建时重启服务
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/node-service.schema.json"

  /**
   * 可选地指定另一个用于继承配置的 JSON 配置文件。
   * 这是多项目之间共享配置的一种方法。
   */
  // "extends": "base-project/config/serve-command.json",

  /**
   * 从项目的 package.json 文件中指定一个 "scripts" 脚本。
   * 当 "heft start" 被调用时，它将使用这个 shell 命令来启动服务进程。
   *
   * 默认值为 "serve"
   */
  // "commandName": "serve",

  /**
   * 如果是 false，那么如果在项目的 package.json 中没有找到 "scripts" 命令，则会错误。
   * 如果是true，则不做任何处理。
   *
   * 默认值为 false
   */
  // "ignoreMissingScript": false,

  /**
   * 自定义退出前一个进程到重启子进程前的等待时间。
   * 如果这个时间间隔太短，那么当开发者依旧处于保存文件时新进程启动，或者在其他监控进程仍在持有操作系统锁时启动。
   *
   * 默认值为 2000, 单位为毫秒
   */
  // "waitBeforeRestartMs": 2000,

  /**
   * 自定义子进程在被强制杀死前等待的时间(SIGTERM)。
   * 默认值为 2000, 单位为毫秒
   */
  // "waitForTerminateMs": 2000,

  /**
   * 自定义子进程被抛弃前的等待时间(SIGKILL)。
   * 默认值为 2000, 单位为毫秒
   */
  // "waitForKillMs": 2000
}
```

## See also

- [node-service](../heft_tasks/node-service.md) task
