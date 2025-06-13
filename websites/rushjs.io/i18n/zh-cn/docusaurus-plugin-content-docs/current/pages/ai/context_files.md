---
title: 代理上下文文件
---

人工智能（AI）**编码助手**是一类软件代理，旨在帮助工程师更高效地编写代码和分析问题。它们通常依赖于经过通用软件工程知识训练的**大型语言模型**（LLMs），但往往不熟悉 Rush 的工作区结构、Rush 的最新特性，或者你所在团队项目的具体细节。你可以通过在 monorepo 中添加**上下文文件**来提升这些工具的准确性。上下文文件包含用于辅助 agent 的额外说明和信息。

下表提供了为主流编码助手设计的可复用上下文文件链接。

| 编码助手                                                                                                                          | Rush 的上下文文件模板                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) | [.github/copilot-instructions.md](https://github.com/microsoft/rushstack/blob/main/.github/copilot-instructions.md) |
| [Cursor](https://docs.cursor.com/context/rules)                                                                                   | [.cursor/rules/rush.mdc](https://github.com/microsoft/rushstack/blob/main/.cursor/rules/rush.mdc)                   |
| [Trae](https://docs.trae.ai/ide/rules-for-ai?_lang=en)                                                                            | [.trae/project_rules.md](https://github.com/microsoft/rushstack/blob/main/.trae/project_rules.md)                   |

**如果你的编码助手未出现在本表中：**欢迎补充！请先创建一个 pull request，将你的文件添加到 [microsoft/rushstack](https://github.com/microsoft/rushstack/pulls) 仓库。然后再在 [microsoft/rushstack-websites](https://github.com/microsoft/rushstack-websites/blob/main/websites/rushjs.io/docs/pages/ai/context_files.md) 仓库中创建一个 pull request，更新上述表格并添加你的文件链接。
