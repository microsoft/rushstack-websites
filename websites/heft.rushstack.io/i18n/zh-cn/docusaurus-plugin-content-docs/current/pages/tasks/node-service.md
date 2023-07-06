---
title: '"node-service" task （实验性）'
---

该任务支持 Heft 下开发 Node.js 服务。它允许使用 `heft start` 在 **localhost** 端口上启动服务。当你保存源代码时，服务会自动重启。

该函数与诸如 [nodemon](https://nodemon.io/) 和 [node-dev](https://www.npmjs.com/package/node-dev) 这类独立的启动器类似，它们也可以被用于 Heft 中。然而，`node-service` 优点是 [riggable](../heft/rig_packages.md), 并且可以更好地集成到 Heft 的工作流中。

## 何时使用它

如果你的项目是 Node.js 服务，那么可以使用这个插件，它已经测试了以下常见的框架：

- [Express](http://expressjs.com/) - 最经典的开放式 Node.js 框架，体积小、社区插件丰富
- [Fastify](https://www.fastify.io/) - 与 Express 类似，但有更好的验证和更大的核心组件
- [HapiJS](https://hapi.dev/) 一个建立在官方维护组件的基础上运行良好的框架
- [NestJS](https://nestjs.com/) - 一个流行的框架，提供企业级支持和使用了 [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata) 的重量级系统。

> **安全说明：**与 Web 浏览器应用程序不同，Node.js 服务通常运行在受信任的数据中心，该数据中心可以访问生产数据库和公司内部服务。
> 而且与开发者工具不同，Node.js 服务会将接受来自互联网上潜在的恶意输入。仔细审查每个需要加载的库是一个很好的习惯：谁在维护 NPM
> 包？它是否处于积极开发？它的代码是否遵循工程的最佳实践？这些问题比“下载次数”更重要。

## package.json dependencies

无 - 这个功能被 Heft 内部实现。

## 配置

1. 通过添加[node-service.json](../heft_configs/node-service_json.md) 来启用 `node-service` 插件。
   它的默认值在大多数情况下就可以正常工作，所以配置文件大多数为空。

2. 在 **package.json** 文件中添加一个启动服务的命令。这个命令的默认名称是 `"serve"`。例如：

   **&lt;project folder&gt;/package.json**

   ```js
     . . .
     "scripts": {
       "build": "heft build --clean",
       "start": "heft start --clean",
       "serve": "node ./lib/start.js"
     },
   ```

如果你的框架使用了诸如 [fastify-cli](https://github.com/fastify/fastify-cli) 的包装，那么你的 `"serve"` 命令可能是 `"fastify start ./lib/start.js"`.

## 启动服务

使用 `heft start` 在本地启动服务。一旦源文件发生变动，Heft 的监听模式会自动重新编译项目，然后自动停止服务进程并重启。

需要调试时，可以在 VS Code 的调试模式来启动服务：

**&lt;project folder&gt;/.vscode/launch.json**

```js
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug the service",
      "program": "${workspaceFolder}/lib/start.js",
      "args": [],
      "console": "integratedTerminal"
    }
  ]
}
```

VSCode 创建的进程可能会与 `heft start` 启动的进程有冲突。为了在这种情况下使用监听模式，可以运行 `heft build --watch`，它会在你修改代码后重新编译你的项目，而不会运行一个服务进程。
