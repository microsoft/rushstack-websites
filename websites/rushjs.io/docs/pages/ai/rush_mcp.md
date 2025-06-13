---
title: Rush MCP server
---

[Agent context files](./context_files.md) provide a simple way to improve artificial intelligence (AI) **coding assistants** by publishing additional information about your Rush repository. The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) takes this to the next level, providing a live service that can answer queries and perform actions in your monorepo.

## How does it work?

- An [MCP host](https://modelcontextprotocol.io/clients) is typically a **coding assistant** such as [GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-mcp) (usable directly in [VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)), [Trae](https://docs.trae.ai/ide/model-context-protocol), or [Cursor](https://docs.cursor.com/context/model-context-protocol). But any kind of software tool could act as a client by implementing the **MCP client** protocol.

- An [MCP server](https://modelcontextprotocol.io/docs/concepts/architecture) advertises a menu of capabilities to the client, which the client invokes using the protocol while performing its tasks. According to the specification, the server can run locally or as a remote cloud service. Its capabilities include:

  - **resources**: for example reading file contents, querying databases, reading log files, capturing screenshots
  - **tools**: for example running shell commands, modifying files, performing calculations
  - **prompts**: exposing specific input forms to be shown to the end user

- Rush provides a ready-made MCP server [@rushstack/mcp-server](https://www.npmjs.com/package/@rushstack/mcp-server) that you can install in your monorepo. Its design goals were specifically tailored for large teams:
  - **Easy for everyone to install,** minimizing the learning curve for casual contributors.
  - **Centrally managed,** so the monorepo maintainers can control its configuration and installed version, ensuring everyone gets a consistent experience. Deterministic behavior is important when providing on-call support for engineers.
  - **Extensible** via [Rush MCP plugins](./rush_mcp_plugins.md), so you can integrate company-specific capabilities without having to build your own MCP server.

## Setting up the MCP server

The `@rushstack/mcp-server` server is designed to run as a local process on the developer's computer, not as a cloud service. The Rush MCP server gets launched automatically by an MCP host such as VS Code, Cursor, or Trae. The MCP host is responsible for starting and terminating this process. The inter-process communication uses the`stdio` [transport](https://modelcontextprotocol.io/docs/concepts/transports), which means you can easily test Rush's MCP server by invoking its CLI manually from your shell.

Generally there are two ways to configure launching of an MCP server: **user-level** for your entire machine (e.g. `~/.cursor/mcp.json`) or **workspace-level** for a specific Git repository (e.g. `<your-repo>/.cursor/mcp.json`). For the `@rushstack/mcp-server` service, we recommend a workspace-level configuration file that gets committed to Git. This simplifies setup for users, and it ensures that everyone gets the same version of `@rushstack/mcp-server` for a given branch, which avoids compatibility problems when loading custom plugins.

After you get it working, consider implementing a [Rush MCP plugin](./rush_mcp_plugins.md) to expose specific capabilities for your company's systems.

> **If your coding assistant isn't mentioned below:** please [create a pull request](https://github.com/microsoft/rushstack-websites/tree/main/websites/rushjs.io/docs/pages/ai/rush_mcp.md) to add a setup recipe!

### Cursor

For [Cursor](https://docs.cursor.com/context/model-context-protocol), add this file to your monorepo:

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

Replace `@rushstack/mcp-server@0.2.1` with the latest version from [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md).

> **Cursor Caveats**
>
> - In the above file, Cursor will magically replace `"."` with the absolute path of the workspace folder.
> - Cursor lacks support for `//` comments in JSON files.

### Trae

For [Trae](https://docs.trae.ai/ide/model-context-protocol?_lang=en#c5b33bab), configure manually as follows:

1. At the top right of the side chat box, click the **Settings icon &gt; MCP**.
2. Click the **+ Add MCP Servers** button.
3. Click **"Configure Manually."** Enter the following configuration:

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

Replace `@rushstack/mcp-server@0.2.1` with the latest version from [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md).

Replace `<workspace-root>` with the absolute path to your Rush monorepo root directory (the folder containing `rush.json`).

### GitHub Copilot

For [GitHub Copilot](https://code.visualstudio.com/docs/copilot/chat/mcp-servers), add this file to your monorepo:

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

Replace `@rushstack/mcp-server@0.2.1` with the latest version from [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md).

Replace `<workspace-root>` with the absolute path to your Rush monorepo root directory (the folder containing `rush.json`).

### Cline

For [Cline](https://docs.cline.bot/mcp/mcp-overview#getting-started), configure manually as follows:

1. Click the **MCP Servers** button.
2. Click the **Installed** button.
3. Click the **Configure MCP Servers** button, and enter the following configuration in the newly opened `cline_mcp_settings.json` file:

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

Replace `@rushstack/mcp-server@0.2.1` with the latest version from [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md).

Replace `<workspace-root>` with the absolute path to your Rush monorepo root directory (the folder containing `rush.json`).

### Windsurf

For [Windsurf](https://docs.windsurf.com/windsurf/cascade/mcp), configure manually as follows:

1. Click **Settings &gt; Windsurf Settings** in the top left corner.
2. In the opened page, click **Cascade &gt; Manage plugins &gt; View raw config**.
3. Enter the following in the opened `mcp_config.json` file:

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

Replace `@rushstack/mcp-server@0.2.1` with the latest version from [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/rush-mcp-server/CHANGELOG.md).

Replace `<workspace-root>` with the absolute path to your Rush monorepo root directory (the folder containing `rush.json`).
