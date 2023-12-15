---
title: Using Mergify with Rush
---

[Mergify](https://mergify.com/) provides an add-on service for GitHub offering expanded **merge queue** capabilities.
If you're new to merge queues, start with [Best Practices: Enabling a merge queue](../best_practices/merge_queue.md)
from the Rush docs and [What's a Merge Queue and Why Use it?](https://blog.mergify.com/whats-a-merge-queue-and-why-use-it/)
from Mergify.

The general problem of optimizing queues involves many tradeoffs and heuristics for choosing
which work to parallelize or combine. This creates many opportunities for optimization and differentiation
between implementors. Mergify's service targets large scale, high velocity monorepos. Their
[Merge Queue Benchmark](https://mergify.com/alternative/merge-queue-benchmark)
presents a feature matrix highlighting differences between various systems.

## A basic example

The [Mergify configuration file](https://docs.mergify.com/configuration/file-format) is typically called
`.mergify.yml` and defines most of the behavior. Let's summarize the basic lifecycle of a pull request:
Once a PR is created in your repository, Mergify will detect it and check it against the
[`pull-request-rules`](https://docs.mergify.com/configuration/file-format/#pull-request-rules). This ruleset
allows you to automate and adapt a wide variety of workflows.

The `pull-request-rules` contain conditions and actions, specifically the
[`queue`](https://docs.mergify.com/workflow/actions/queue/) action. Once a PR validates the
conditions of a pull request rule, it will trigger its action causing the PR to be queued.
Here's an example config file:

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

Above we have defined one unique merge queue named `default` with its own set of conditions. The
`merge_conditions` will need to be validated before the PR can be merged.

## Using partitions to increase parallelism

The key to optimizing a merge queue is identifying jobs that can be performed in parallel because
their Git diffs are independent. Two PR's are "independent" if (1) their diffs do not involve the same files
and (2) the files "impacted" by the two diffs do not overlap, according to the dependency graph.
Rush's dependency analysis operates at the granularity of Rush projects, not individual files.
In terms of [Rush project selectors](../developer/selecting_subsets.md) it means that
`rush list --impacted-by git:origin/main` must not have any overlap between the two PR's.

Mergify's [partitions](https://docs.mergify.com/merge-queue/partitions/) are analogous to Rush projects
in this analysis; each partition defines a collection of a files, with the ability to declare dependency
relationships between partitions, which can then determine whether jobs build in parallel or not.

As an example, suppose your Rush workspace contains three projects called `project-a`, `project-b`, and `project-c`.
Here's a sample hard-wired configuration:

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

In this example, if a PR modifies files under the folder `project-a`, the partition and merge queue
that will be used to check and merge the PR automatically will be the one of `project-a`.

If a PR modifies files from two or more projects at the same time, the PR will be checked
in every corresponding partition.

In a large monorepo, hand-coding the `files~=` condition is impractical; it will need to be generated
using a script.

> 💡**Coming soon**
>
> We're collaborating on a vendor-agnostic
> [project-impact-graph.yaml](https://github.com/tiktok/project-impact-graph) specification
> and accompanying Rush plugin that will enable services such as Mergify to query the **rush.json**
> dependency graph directly.

## Automated actions

Mergify also includes a workflow automation feature that can automate tasks such as adding comments,
assigning reviewers, or adding labels. For example:

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

Some other useful actions:

- [Backport](https://docs.mergify.com/workflow/actions/backport/): Copy a pull request to another branch once it is merged.
- [Update](https://docs.mergify.com/workflow/actions/update/): Update the pull request branch with its base branch.

## See also

- [Best Practices: Enabling a merge queue](../best_practices/merge_queue.md) from the Rush docs
- [Mergify Documentation](https://docs.mergify.com/)
