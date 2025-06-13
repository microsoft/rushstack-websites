---
title: Rush MCP 插件
---

[Rush MCP 服务器](./rush_mcp.md) 提供了一种现成的解决方案，用于提升人工智能（AI）**编码助手**在 Rush monorepo 中的工作效率。然而，大多数企业还拥有无法贡献给开源实现的内部系统，这些系统也可以集成到该服务中。为了满足这些需求，您可以为 [@rushstack/mcp-server](https://www.npmjs.com/package/@rushstack/mcp-server) 实现 **Rush MCP 插件**。插件也可以以开源形式发布，以提供可选的附加功能或集成能力。

插件示例场景：

- **团队 wiki**：查询运行在私有内容管理系统上的内部团队 wiki
- **问题管理**：在内部工作管理系统中创建任务和问题
- **语义搜索**：使用专有句子转换模型在如 [Supabase](https://supabase.com/docs/guides/ai/semantic-search) 这样的语义向量数据库中进行搜索

## 创建插件

> **复制我们的示例**
>
> GitHub 上的 [build-tests/rush-mcp-example-plugin](https://github.com/microsoft/rushstack/tree/main/build-tests/rush-mcp-example-plugin) 项目展示了一个与 `@rushstack/mcp-server` 搭配使用的插件项目示例。

编写插件的主要步骤如下：

1. 创建一个名称遵循 `rush-mcp-_____-plugin` 命名模式的 NPM 包。

2. 在 **package.json** 文件中，`@rushstack/mcp-server` 包应放入 `devDependencies`，而不是 `dependencies`。

   **重要提示：** 从该包中导入时应始终使用 `import type`。例如：`import type { RushMcpPluginSession } from '@rushstack/mcp-server';`。

3. 在项目根目录添加插件清单文件，并确保 [.npmignore](https://github.com/microsoft/rushstack/blob/main/build-tests/rush-mcp-example-plugin/.npmignore) 或 **package.json** 已配置，使得执行 `npm publish` 时能包含该文件：

   **&lt;your-package&gt;/rush-mcp-plugin.json**

   ```js
   /**
    * 每个插件包都必须在顶层文件夹（与 package.json 同级）中包含一个 "rush-mcp-plugin.json" 清单文件。
    */
   {
     /**
      * 唯一标识插件的名称。通常应与 NPM 包名称相同。
      * 如果两个 NPM 包的 pluginName 相同，则它们不能同时加载。
      */
     "pluginName": "rush-mcp-example-plugin",

     /**
      * （可选）表示插件接受一个配置文件。MCP 服务器将加载该文件并传递给插件。
      *
      * 配置文件路径将为 `<rush-repo>/common/config/rush-mcp/<plugin-name>.json`。
      */
     "configFileSchema": "./lib/rush-mcp-example-plugin.schema.json",

     /**
      * 入口点，其默认导出应为一个实现类。
      */
     "entryPoint": "./lib/index.js"
   }
   ```

4. 创建一个实现 `IRushMcpPlugin` 接口的插件：

   **&lt;your-package&gt;/src/ExamplePlugin.ts**

   ```js
   import type { IRushMcpPlugin, RushMcpPluginSession } from '@rushstack/mcp-server';
   import { StateCapitalTool } from './StateCapitalTool';

   export interface IExamplePluginConfigFile {
     capitalsByState: Record<string, string>;
   }

   export class ExamplePlugin implements IRushMcpPlugin {
     public session: RushMcpPluginSession;
     public configFile: IExamplePluginConfigFile | undefined = undefined;

     public constructor(session: RushMcpPluginSession, configFile: IExamplePluginConfigFile | undefined) {
       this.session = session;
       this.configFile = configFile;
     }

     public async onInitializeAsync(): Promise<void> {
       this.session.registerTool({ toolName: 'state_capital' }, new StateCapitalTool(this));
     }
   }
   ```

5. 上述清单指定了 `"entryPoint": "./lib/index.js"`，因此入口点应返回插件工厂：

   **&lt;your-package&gt;/src/index.ts**

   ```js
   import type { RushMcpPluginSession, RushMcpPluginFactory } from '@rushstack/mcp-server';
   import { ExamplePlugin, type IExamplePluginConfigFile } from './ExamplePlugin';

   function createPlugin(
     session: RushMcpPluginSession,
     configFile: IExamplePluginConfigFile | undefined
   ): ExamplePlugin {
     return new ExamplePlugin(session, configFile);
   }

   export default createPlugin satisfies RushMcpPluginFactory<IExamplePluginConfigFile>;
   ```

6. [TypeScript 的 MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) 依赖 [zod](https://www.npmjs.com/package/zod) 框架，用于从 TypeScript 表达式生成 JSON schema 定义。

   _您不需要为每个插件在 **package.json** 中添加 `zod` 依赖项。_

   相反，您可以从 `@rushstack/mcp-server` 的运行时上下文中导入它。这也可确保运行时中使用一致版本的 `zod`。请参阅 [StateCapitalTool.ts](https://github.com/microsoft/rushstack/blob/main/build-tests/rush-mcp-example-plugin/src/StateCapitalTool.ts) 获取代码示例。

7. 插件完成后，应将其发布到 NPM 注册表。

## 启用插件

`@rushstack/mcp-server` 服务器期望从 Rush [autoinstaller](../maintainer/autoinstallers.md) 加载插件。这可确保 NPM 版本确定性，并确保即使在 `rush install` 出现故障的分支中插件也能正常工作。

1. 创建一个 `rush-mcp` autoinstaller：

   ```shell
   rush init-autoinstaller --name rush-mcp
   ```

2. 将插件添加为依赖项：

   **common/autoinstallers/rush-mcp/package.json**

   ```js
   {
     "name": "rush-mcp",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "rush-mcp-example-plugin": "1.0.0"
     }
   }
   ```

   将 `"rush-mcp-example-plugin": "1.0.0"` 替换为您发布的包版本。

   如果您尚未发布 NPM 包，可以使用 `file:` 方式模拟安装，即将其符号链接到本地开发目录：

   **common/autoinstallers/rush-mcp/package.json**

   ```js
   {
     "name": "rush-mcp",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "rush-mcp-example-plugin": "file:../../../../rushstack/build-tests/rush-mcp-example-plugin/"
     }
   }
   ```

3. 更新 `rush-mcp/package.json` 后，需要重新生成锁文件：

   ```shell
   rush update-autoinstaller --name rush-mcp
   ```

4. 接下来配置 `@rushstack/mcp-server` 加载您的插件：

   **common/config/rush-mcp/rush-mcp.json**

   ```js
   /**
    * 本文件用于配置 `@rushstack/mcp-server` 在特定 monorepo 中的行为。
    * 文件路径：<your-repo>/common/config/rush-mcp/rush-mcp.json
    */
   {
     /**
      * MCP 服务器在处理该 monorepo 时应加载的插件列表。
      */
     "mcpPlugins": [
       {
         /**
          * 出现在 autoinstaller 的 package.json "dependencies" 中的 NPM 包名称。
          */
         "packageName": "rush-mcp-example-plugin",

         /**
          * 含有该插件依赖项的 Rush autoinstaller 名称。
          * `@rushstack/mcp-server` 会自动确保该文件夹被安装，
          * 然后再尝试加载插件。
          */
         "autoinstaller": "rush-mcp"
       }
     ]
   }
   ```

5. 最后，为确认其能正确加载，可在 shell 提示符中手动运行 MCP 服务器：

   ```shell
   # 注意，MCP 宿主通常会将当前工作目录设置为 "/"，而非 monorepo 文件夹。
   # 建议以这种方式进行测试。
   node ./my-rush-repo/common/scripts/install-run.js @rushstack/mcp-server@0.2.1 "mcp-server" ./my-rush-repo
   ```

若无报错启动，即表示您的插件已准备就绪！确认 MCP 宿主是否显示了新工具。

## 参见

- [Autoinstallers](../maintainer/autoinstallers.md)
- [Rush MCP 服务器](./rush_mcp.md)
