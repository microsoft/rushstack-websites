---
title: Node.js service plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft](https://github.com/microsoft/rushstack/tree/main/apps/heft) (built-in) |
| **Plugin name:** | [node-service-plugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json) implemented by [NodeServicePlugin.ts](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/NodeServicePlugin.ts) |
| **Plugin config file:** | [node-service.json](../configs/node-service_json.md) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This plugin supports development of Node.js services using Heft. It enables `heft start` to launch your service on a **localhost** port. Whenever you save a change to your source code, the project will be rebuilt, and then the service will be restarted.

This functionality is similar to standalone launchers such as [nodemon](https://nodemon.io/) or [node-dev](https://www.npmjs.com/package/node-dev). They can also be used with Heft, however the `node-service` task has the benefit of being [riggable](../intro/rig_packages.md) and better integrated with Heft's workflow.

## When to use it

Use this plugin if your project is a Node.js service. It has been tested with the following popular frameworks:

- [Express](http://expressjs.com/) - the classic "unopinionated" Node.js framework with minimal structure and a very large ecosystem of community plugins
- [Fastify](https://www.fastify.io/) - similar in character to Express, but with improved validation and a larger set of core components
- [HapiJS](https://hapi.dev/) - a good "batteries included" framework built on a comprehensive foundation of officially maintained components
- [NestJS](https://nestjs.com/) - a popular framework offering paid enterprise support and a heavyweight system of abstractions using [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)

> **Security Note:** Unlike a web browser application, a Node.js service typically runs in a trusted data center
> with access to production databases and internal company services. And unlike a developer tool, a Node.js service
> will accept inputs from potentially malicious clients on the public internet. It's a good idea to carefully review
> each library that your service will load. Who maintains the NPM package? Is it being actively developed? Does
> the code follow engineering best practices? These questions may be more important than "How many times was
> it downloaded?"

## package.json dependencies

None - this feature is built-in to `@rushstack/heft`.

## Configuration

1. If you are using the standard [@rushstack/heft-node-rig](https://www.npmjs.com/package/@rushstack/heft-node-rig),
   then `node-service-plugin` will already be loaded and configured.
   Otherwise, your [heft.json config file](../configs/heft_json.md) could invoke it in this example:

   **&lt;project folder&gt;/config/heft.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

     "aliasesByName": {
       "start": {
         "actionName": "build-watch",
         "defaultParameters": ["--serve"]
       }
     },
     "phasesByName": {
       "build": {
         "cleanFiles": [{ "sourcePath": "dist" }, { "sourcePath": "lib" }, { "sourcePath": "lib-commonjs" }],
         "tasksByName": {
           "typescript": {
             "taskPlugin": {
               "pluginPackage": "@rushstack/heft-typescript-plugin"
             }
           },
           . . .
           "node-service": {
             "taskDependencies": ["typescript"],
             "taskPlugin": {
               "pluginPackage": "@rushstack/heft",
               "pluginName": "node-service-plugin"
             }
           }
         }
       },

       . . .
     }
   }
   ```

2. The `node-service` plugin looks for a [config/node-service.json](../configs/node-service_json.md) config file.
   The defaults work for most cases, so the file may be mostly empty.

3. Add a script to your **package.json** file containing the command to launch the service. The default name
   for this command is `"serve"`. For example:

   **&lt;project folder&gt;/package.json**

   ```js
     . . .
     "scripts": {
       "build": "heft build --clean",
       "start": "heft start",
       "serve": "node lib/start.js"
     },
   ```

If your framework uses a wrapper such as [fastify-cli](https://github.com/fastify/fastify-cli), then
your `"serve"` command might be `"fastify start ./lib/start.js"` instead.

## Starting the service

To start the localhost dev server, use the `heft start` command, which conventionally is defined as an alias
for `heft build-watch --serve` (see `aliasesByName` above). Whenever you save a change to a source file,
Heft's watch mode will recompile your project, then automatically stop the service process and restart it.

> **Note:** If the `--serve` parameter is included in the Heft command-line, then `node-service-plugin`
> performs no action, and will not even report an error if **config/node-service.json** is absent.

When debugging, you may prefer to use the VS Code debugger to launch your service:

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

The process created by VS Code would conflict with the process that is launched by `heft start`. To use watch
mode in this situation, invoke `heft build-watch` without `--serve`. It will recompile your project whenever the
code is changed, but without launching the service.

## CLI parameters

[heft/heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json) defines these parameters:

```
  --serve
                        Start a local web server for testing purposes. This
                        parameter is only available when running in watch
                        mode.
```
