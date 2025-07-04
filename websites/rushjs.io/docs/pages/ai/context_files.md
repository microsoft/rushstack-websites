---
title: Agent context files
---

Artificial intelligence (AI) **coding assistants** are software agents that help engineers to write code and investigate problems more efficiently. They typically rely on **large language models** (LLMs) trained with general knowledge about software engineering, but often will not have specific familiarity with Rush's workspace structure, the latest features of Rush, or details about your own team's projects. You can improve the accuracy of these tools by adding **context files** to your monorepo. Context files contain additional instructions and information to help the agent.

The table below provides links to reusable context files designed for popular coding assistants.

| Coding assistant                                                                                                                  | Context file template for Rush                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) | [.github/copilot-instructions.md](https://github.com/microsoft/rushstack/blob/main/.github/copilot-instructions.md) |
| [Cursor](https://docs.cursor.com/context/rules)                                                                                   | [.cursor/rules/rush.mdc](https://github.com/microsoft/rushstack/blob/main/.cursor/rules/rush.mdc)                   |
| [Trae](https://docs.trae.ai/ide/rules-for-ai?_lang=en)                                                                            | [.trae/project_rules.md](https://github.com/microsoft/rushstack/blob/main/.trae/project_rules.md)                   |

**If your coding assistant does not appear in this table:** please add it! First, make a pull request to add your file to the [microsoft/rushstack](https://github.com/microsoft/rushstack/pulls) repository. Then make a pull request in the [microsoft/rushstack-websites](https://github.com/microsoft/rushstack-websites/blob/main/websites/rushjs.io/docs/pages/ai/context_files.md) repository, updating the table above to add a link for your file.
