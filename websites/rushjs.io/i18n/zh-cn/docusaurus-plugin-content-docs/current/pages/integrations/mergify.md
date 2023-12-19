---
title: 在 Rush 中使用 Mergify
---

[Mergify](https://mergify.com/) 为 GitHub 提供附加服务，扩展了**合并队列**功能。
如果您对合并队列不熟悉，可以从 Rush 文档的 [最佳实践：启用合并队列](../best_practices/merge_queue.md)
和 Mergify 的 [什么是合并队列，为什么使用它？](https://blog.mergify.com/whats-a-merge-queue-and-why-use-it/) 开始。

优化队列的一般问题涉及许多权衡和启发式方法，用于选择哪些工作进行并行处理或合并。
这为优化和不同实施者之间的差异化创造了许多机会。Mergify 的服务针对大规模、高速度的单体仓库。
他们的 [合并队列基准测试](https://mergify.com/alternative/merge-queue-benchmark)
展示了各种系统之间的功能差异矩阵。

## 一个基本示例

[Mergify 配置文件](https://docs.mergify.com/configuration/file-format) 通常称为
`.mergify.yml`，定义了大部分行为。让我们总结一下拉取请求的基本生命周期：
一旦在您的仓库中创建了 PR，Mergify 将检测到它并根据
[`pull-request-rules`](https://docs.mergify.com/configuration/file-format/#pull-request-rules) 检查它。此规则集
允许您自动化和适应各种工作流程。

`pull-request-rules` 包含条件和动作，特别是
[`queue`](https://docs.mergify.com/workflow/actions/queue/) 动作。一旦 PR 验证了
拉取请求规则的条件，它将触发其动作，导致 PR 排队。
以下是一个示例配置文件：

**.mergify.yml**

```yaml
queue_rules:
  - name: default
    merge_conditions:
      - '#approved-reviews-by>=2'
      - check-success=Travis CI - Pull Request

pull_request_rules:
  - name: merge using the merge queue
    conditions:
      - base=main
      - label=queue
    actions:
      queue:
```

在上面，我们定义了一个名为 `default` 的唯一合并队列及其自己的一套条件。这些
`merge_conditions` 必须在 PR 能够合并之前得到验证。

## 使用分区增加并行性

优化合并队列的关键是识别可以并行执行的作业，
因为它们的 Git 差异是独立的。两个 PR 是“独立的”，如果 (1) 它们的差异不涉及相同的文件
以及 (2) 由两个差异“影响”的文件不重叠，根据依赖图。
Rush 的依赖分析以 Rush 项目的粒度进行，而不是单个文件。
就 [Rush 项目选择器](../developer/selecting_subsets.md) 而言，这意味着
`rush list --impacted-by git:origin/main` 在两个 PR 之间不得有任何重叠。

Mergify 的 [分区](https://docs.mergify.com/merge-queue/partitions/) 类似于 Rush 项目
在此分析中；每个分区定义了一组文件，并具有声明分区之间的依赖关系的能力，
然后可以确定作业是并行构建还是不构建。

例如，假设您的 Rush 工作区包含名为 `project-a`、`project-b` 和 `project-c` 的三个项目。
这是一个样本硬编码配置：

**.mergify.yml**

```yaml
partition_rules:
  - name: project-a
    conditions:
      - files~=^apps/project-a

  - name: project-a
    conditions:
      - files~=^apps/project-a

  - name: project-a
    conditions:
      - files~=^apps/project-c

queue_rules:
  - name: default
    merge_conditions:
      - and:
          - or:
              - queue-partition-name!=project-a
              - check-success=ciA
          - or:
              - queue-partition-name!=project-a
              - check-success=ciB
          - or:
              - queue-partition-name!=project-a
              - check-success=ciC

pull_request_rules:
  - name: merge using the merge queue
    conditions:
      - base=main
      - label=queue
    actions:
      queue:
```

在这个例子中，如果一个 PR 修改了 `project-a` 文件夹下的文件，用于检查和自动合并 PR 的分区和合并队列
将是 `project-a` 的。

如果一个 PR 同时修改了两个或更多项目的文件，PR 将在每个相应的分区中进行检查。

在大型单体仓库中，手动编码 `files~=` 条件是不切实际的；它将需要使用脚本生成。

> 💡**即将推出**
>
> 我们正在合作开发一个厂商无关的
> [project-impact-graph.yaml](https://github.com/tiktok/project-impact-graph) 规范
> 和相应的 Rush 插件，这将使诸如 Mergify 之类的服务能够直接查询 **rush.json**
> 依赖图。

## 自动化操作

Mergify 还包括一个工作流自动化功能，可以自动执行任务，如添加评论、
指派审阅者或添加标签。例如：

**.mergify.yml**

```yaml
pull_request_rules:
  - name: comment on project-a pull request
    conditions:
      - files~=^apps/project-a
    actions:
      comment:
        message: This pull request modifies a file in project-a

  - name: assign review to a project-b reviewer
    conditions:
      - files~=^apps/project-b
    actions:
      assign:
        add_users:
          - projectb_reviewer

  - name: add label on project-c pull request
    conditions:
      - files~=^apps/projectC
    actions:
      label:
        toggle:
          - project-c
```

一些其他有用的动作：

- [回传](https://docs.mergify.com/workflow/actions/backport/)：一旦合并，将拉取请求复制到另一个分支。
- [更新](https://docs.mergify.com/workflow/actions/update/)：用其基础分支更新拉取请求分支。

## 另请参阅

- Rush 文档中的 [最佳实践：启用合并队列](../best_practices/merge_queue.md)
- [Mergify 文档](https://docs.mergify.com/)
