---
title: RushStack Skill
---

[Rush MCP server](./rush_mcp.md) provides a powerful way to integrate Rush with AI coding assistants using the Model Context Protocol. **RushStack Skill** take a different approach, providing a comprehensive knowledge base that AI agents can load on-demand to better understand Rush monorepo best practices.

## What are skills?

[Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) are reusable knowledge packages that AI agents can dynamically load to gain expertise in specific domains. Unlike static context files, skills:

- **Are modular, self-contained packages** that provide specialized knowledge, workflows, and best practices for specific domains
- **Transform AI from a general-purpose agent** into a specialized agent equipped with procedural knowledge that cannot be fully learned from pre-training data
- **Use progressive disclosure** - metadata stays in context, body loads on-trigger, and bundled resources load only as-needed, optimizing token usage
- **Can be automatically discovered** when the agent detects relevant project indicators (e.g., `rush.json`)

## The RushStack skill

The **rushstack-best-practices** skill provides AI agents with comprehensive knowledge about working with Rush monorepos. It includes:

- **Core Principles**: Essential guidelines for Rush monorepo development
- **Command Usage**: Best practices for `rush`, `rushx`, and `rush-pnpm` commands
- **Project Selection**: Proper use of selection flags like `--to`, `--from`, `--impacted-by`
- **Dependency Management**: Adding/removing dependencies, version constraints, workspace linking
- **Build Optimization**: Incremental builds, build cache configuration, parallel execution
- **Subspace**: Using subspaces for large monorepos with isolated dependency trees
- **Troubleshooting**: Common issues and solutions

## Installation

### Using npx skills add

The RushStack skill can be installed using the `npx skills add` command:

```bash
npx skills add https://github.com/microsoft/rushstack/tree/main/skills
```

This command will:

1. Download the latest version of the skill
2. Prompt you to select which AI agent to install the skill for
3. Install the skill in the selected agent's skills directory
4. Make it available for automatic loading when working in Rush monorepos

The skill will be **automatically loaded** when the AI agent detects a `rush.json` file in your workspace root, ensuring the agent has Rush-specific knowledge when working in your monorepo.
