---
title: Rush MCP plugins
---

The [Rush MCP server](./rush_mcp.md) provides a ready-made solution for improving the effectiveness of Artificial intelligence (AI) **coding assistants** when working in a Rush monorepo. However, most businesses will have internal systems that could also be included in this service, but which cannot be contributed to the open source implementation. To handle these requirements, you can implement plugins for [@rushstack/mcp-server](https://www.npmjs.com/package/@rushstack/mcp-server). Plugins can also be released as open source to provide optional additional functionality or integrations.

Example plugin scenarios:

- **Team wiki**: Query an internal team wiki that runs on a private content management system.
- **Issue management**: Create tasks and issues in an internal work management system
- **Semantic search**: Search a semantic vector database such as [Supabase](https://supabase.com/docs/guides/ai/semantic-search) using a proprietary sentence transformer

## Authoring a plugin

The [build-tests/rush-mcp-example-plugin](https://github.com/microsoft/rushstack/tree/main/build-tests/rush-mcp-example-plugin) project on GitHub demonstrates an example plugin project for usage with `@rushstack/mcp-server`.

The main steps for writing a plugin:

1. Create an NPM package whose name follows the `rush-mcp-_____-plugin` naming pattern.

2. In your **package.json** file, the `@rushstack/mcp-server` package should go under `devDependencies`, NOT under `dependencies`.

   **IMPORTANT:** Always use `import type` when importing from this package. For example, `import type { RushMcpPluginSession } from '@rushstack/mcp-server';`.

3. Add the plugin manifest file in the root of your project, and make sure [.npmignore](https://github.com/microsoft/rushstack/blob/main/build-tests/rush-mcp-example-plugin/.npmignore) or **package.json** are configured so that `npm publish` will include it:

   **&lt;your-package&gt;/rush-mcp-plugin.json**

   ```js
   /**
    * Every plugin package must contain a "rush-mcp-plugin.json" manifest in the top-level folder
    * (next to package.json).
    */
   {
     /**
      * A name that uniquely identifies your plugin.  Generally this should be the same name as
      * the NPM package.  If two NPM packages have the same pluginName, they cannot be loaded together.
      */
     "pluginName": "rush-mcp-example-plugin",

     /**
      * (OPTIONAL) Indicates that your plugin accepts a config file.  The MCP server will load this
      * file and provide it to the plugin.
      *
      * The config file path will be `<rush-repo>/common/config/rush-mcp/<plugin-name>.json`.
      */
     "configFileSchema": "./lib/rush-mcp-example-plugin.schema.json",

     /**
      * The entry point, whose default export should be a class that implements
      */
     "entryPoint": "./lib/index.js"
   }
   ```

4. Create a plugin that implements the `IRushMcpPlugin` contract:

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

5. Above, our manifest specified `"entryPoint": "./lib/index.js"`, so the entry point should return the plugin factory:

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

6. The [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk) requires the [zod](https://www.npmjs.com/package/zod) framework for generating JSON schema definitions from TypeScript expressions. _You do not need to add `zod` as a **package.json** dependency for each plugin._ Instead, you can import it from the `@rushstack/mcp-server` runtime context. This also ensures that a consistent version of `zod` is used throughout the runtime. Take a look at the [StateCapitalTool.ts](https://github.com/microsoft/rushstack/blob/main/build-tests/rush-mcp-example-plugin/src/StateCapitalTool.ts) for a code sample.

7. Once your plugin is completed, you should publish it to an NPM registry.

## Configuring your plugin

The `@rushstack/mcp-server` server expects to load plugins from a Rush [autoinstaller](../maintainer/autoinstallers.md). This ensures deterministic NPM versions, and ensures plugins will work correctly even in a branch where `rush install` is broken.

1. Create a `rush-mcp` autoinstaller:

   ```shell
   rush init-autoinstaller --name rush-mcp
   ```

2. Add your plugin as a dependency:

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

   Replace `"rush-mcp-example-plugin": "1.0.0"` with your published package version.

   If you did not publish your NPM package yet, you can use `file:` to simulate an installation by creating a symlink to your local development folder:

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

3. After updating `rush-mcp/package.json`, you need to regenerate the lockfile:

   ```shell
   rush update-autoinstaller --name rush-mcp
   ```

4. Next, we configure `@rushstack/mcp-server` to load your plugin:

   **common/config/rush-mcp/rush-mcp.json**

   ```js
   /**
    * This file configures the behavior of `@rushstack/mcp-server` for a given monorepo.
    * Its file path:  <your-repo>/common/config/rush-mcp/rush-mcp.json
    */
   {
     /**
      * The list of plugins that `@rushstack/mcp-server` should load when processing this monorepo.
      */
     "mcpPlugins": [
       {
         /**
          * The name of an NPM package that appears in the package.json "dependencies" for the autoinstaller.
          */
         "packageName": "rush-mcp-example-plugin",

         /**
          * The name of a Rush autoinstaller with this package as its dependency.
          * The `@rushstack/mcp-server` will automatically ensure this folder is installed
          * before attempting to load the plugin.
          */
         "autoinstaller": "rush-mcp"
       }
     ]
   }
   ```

5. Finally, to confirm that it loads correctly, try invoking the MCP server manually from your shell prompt:

   ```shell
   # Note that MCP hosts will typically invoke this command
   # with the current working directory set to "/", NOT your monorepo folder.
   # It's a good idea to test that.
   node ./my-rush-repo/common/scripts/install-run.js @rushstack/mcp-server@0.2.1 "mcp-server" ./my-rush-repo
   ```

If it launches without any problems, then your plugin is ready for use! Confirm that the MCP host displays the new tool.
