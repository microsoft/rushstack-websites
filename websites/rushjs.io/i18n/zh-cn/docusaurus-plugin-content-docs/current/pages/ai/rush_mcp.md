---
title: Rush MCP 服务器
---

[Agent context files](./context_files.md) 提供了一种简单的方式，通过发布有关 Rush 仓库的附加信息来提升人工智能（AI）**编程助手**的能力。[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 更进一步，提供一个实时服务，可以在你的 monorepo 中响应查询并执行操作。

## 它是如何工作的？

- 一个 [MCP host](https://modelcontextprotocol.io/clients) 通常是一个 **编程助手**，如 [GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-mcp)（可直接在 [VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) 中使用）、[Trae](https://docs.trae.ai/ide/model-context-protocol) 或 [Cursor](https://docs.cursor.com/context/model-context-protocol)。但任何类型的软件工具都可以通过实现 **MCP client** 协议来作为客户端。

- 一个 [MCP server](https://modelcontextprotocol.io/docs/concepts/architecture) 会向客户端公布一系列能力，客户端在执行任务时通过协议调用这些能力。根据规范，服务器可以在本地运行，也可以作为远程云服务。它的能力包括：

  - **resources**：例如读取文件内容、查询数据库、读取日志文件、捕获屏幕截图
  - **tools**：例如执行 shell 命令、修改文件、执行计算
  - **prompts**：暴露特定输入表单供最终用户填写

- Rush 提供了一个现成的 MCP 服务器 [@rushstack/mcp-server](https://www.npmjs.com/package/@rushstack/mcp-server)，可以安装在你的 monorepo 中。它的设计目标专为大型团队量身定制：
  - **易于所有人安装，** 降低临时贡献者的学习曲线。
  - **集中管理，** 使 monorepo 维护者能够控制其配置和安装版本，从而确保所有人获得一致的体验。在为工程师提供随叫随到的支持时，确定性行为至关重要。
  - 通过 [Rush MCP 插件](./rush_mcp_plugins.md) 实现 **可扩展性，** 这样你就可以集成公司特有的能力，而无需自行构建 MCP 服务器。

## 设置 MCP 服务器

`@rushstack/mcp-server` 设计为在开发者的本地计算机上作为本地进程运行，而不是作为云服务运行。Rush MCP 服务器会被 VS Code、Cursor 或 Trae 等 MCP host 自动启动。MCP host 负责启动和终止该进程。进程间通信使用 `stdio` [传输方式](https://modelcontextprotocol.io/docs/concepts/transports)，因此你可以通过在 shell 中手动调用其 CLI 来轻松测试 Rush 的 MCP 服务器。

通常有两种配置 MCP 服务器启动的方式：适用于整个机器的 **用户级别**（例如 `~/.cursor/mcp.json`），或适用于某个特定 Git 仓库的 **工作区级别**（例如 `<your-repo>/.cursor/mcp.json`）。对于 `@rushstack/mcp-server` 服务，我们推荐使用提交到 Git 的工作区级别配置文件。这样可以简化用户的设置过程，并确保所有人在某个分支上使用相同版本的 `@rushstack/mcp-server`，从而避免加载自定义插件时的兼容性问题。

完成基本设置后，可以考虑实现一个 [Rush MCP 插件](./rush_mcp_plugins.md)，以暴露你公司系统的特定能力。

> **如果你的编程助手不在下方列出：** 请[创建一个 pull request](https://github.com/microsoft/rushstack-websites/tree/main/websites/rushjs.io/docs/pages/ai/rush_mcp.md) 添加设置说明！

### Cursor

对于 [Cursor](https://docs.cursor.com/context/model-context-protocol)，在你的 monorepo 中添加如下文件：

**&lt;your-repo&gt;/.cursor/mcp.json**

```js
{
  "mcpServers": {
    "rush-mcp-server": {
      "command": "node",
      "args": [
        "./common/scripts/install-run.js",
        "@rushstack/mcp-server@0.2.1",
        "mcp-server",
        "."
      ]
    }
  }
}
```

将 `@rushstack/mcp-server@0.2.1` 替换为 [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md) 中的最新版本。

> **Cursor 注意事项**
>
> - Cursor 会自动将上述文件中的 `"."` 替换为工作区文件夹的绝对路径。
> - Cursor 不支持在 JSON 文件中使用 `//` 注释。

### Trae

对于 [Trae](https://docs.trae.ai/ide/model-context-protocol?_lang=en#c5b33bab)，请手动配置如下：

1. 点击侧边聊天框右上角的 **Settings 图标 &gt; MCP**。
2. 点击 **+ Add MCP Servers** 按钮。
3. 点击 **"Configure Manually."**，并输入以下配置：

```js
{
  "mcpServers": {
    "rush-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@rushstack/mcp-server@0.2.1",
        "<workspace-root>"
      ]
    }
  }
}
```

将 `@rushstack/mcp-server@0.2.1` 替换为 [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md) 中的最新版本。

将 `<workspace-root>` 替换为 Rush monorepo 根目录的绝对路径（包含 `rush.json` 的文件夹）。

### GitHub Copilot

对于 [GitHub Copilot](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)，在你的 monorepo 中添加如下文件：

**&lt;your-repo&gt;/.vscode/mcp.json**

```js
{
  "servers": {

    "rush-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@rushstack/mcp-server@0.2.1",
        "<workspace-root>"
      ]
    }
  }
}
```

将 `@rushstack/mcp-server@0.2.1` 替换为 [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md) 中的最新版本。

将 `<workspace-root>` 替换为 Rush monorepo 根目录的绝对路径（包含 `rush.json` 的文件夹）。

### Cline

对于 [Cline](https://docs.cline.bot/mcp/mcp-overview#getting-started)，请手动配置如下：

1. 点击 **MCP Servers** 按钮。
2. 点击 **Installed** 按钮。
3. 点击 **Configure MCP Servers** 按钮，在新打开的 `cline_mcp_settings.json` 文件中输入以下配置：

**cline_mcp_settings.json**

```js
{
  "mcpServers": {
    "rush-mcp-server": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@rushstack/mcp-server@0.2.1",
        "<workspace-root>"
      ]
    }
  }
}
```

将 `@rushstack/mcp-server@0.2.1` 替换为 [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md) 中的最新版本。

将 `<workspace-root>` 替换为 Rush monorepo 根目录的绝对路径（包含 `rush.json` 的文件夹）。

### Windsurf

对于 [Windsurf](https://docs.windsurf.com/windsurf/cascade/mcp)，请手动配置如下：

1. 点击左上角 **Settings &gt; Windsurf Settings**。
2. 在打开的页面中点击 **Cascade &gt; Manage plugins &gt; View raw config**。
3. 在打开的 `mcp_config.json` 文件中输入以下内容：

**mcp_config.json**

```js
{
  "mcpServers": {
    "rush-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@rushstack/mcp-server@0.2.1",
        "<workspace-root>"
      ]
    }
  }
}
```

将 `@rushstack/mcp-server@0.2.1` 替换为 [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md) 中的最新版本。

将 `<workspace-root>` 替换为 Rush monorepo 根目录的绝对路径（包含 `rush.json` 的文件夹）。
