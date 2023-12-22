---
title: Enabling a merge queue
---

A **merge queue** (also called **commit queue** or **merge train**) improves continuous integration
(CI) systems
by providing two key features:

- **increased safety** by avoiding build breaks that may occur if Git branches are validated
  _before_ they are merged rather than _after_ they are merged
- **higher throughput** by intelligently combining work or parallelizing jobs

The merge queue can be a built-in feature for popular CI systems such as GitHub or GitLab,
or it may be an add-on service.

## Motivating example

Suppose pull requests 1 and 2 are waiting to get merged into your `main` branch, and their branches are
named `pr1` and `pr2`. Traditionally there were a few basic approaches to validation:

1. **Slow but safe:** Let's use `start` to refer to the latest commit of the `main` branch.
   The CI system creates a temporary branch `start+pr1` (merging `start` with `pr1`).
   We build this "hot merge" and, if successful, now we can merge PR 1 into `main`.
   If PR 2 had an ongoing build, it should be aborted, because `main` has changed. Its hot merge needs
   to be redone using `start+pr1+pr2`, because that is what will be in `main` after PR 2 merges.
   This approach ensures correctness of every commit in `main`. However in an active monorepo,
   a backlog will quickly pile up, because the builds that ultimately get merged are not being parallelized at all.

2. **Optimistic:** Being less strict, we could choose to allow PR 2 to get merged with only a successful build
   of `start+pr2`, even though the final commit will be `start+pr1+pr2`. In effect, we are hoping that if
   `start+pr1` and `start+pr2` built successfully, then so would `start+pr1+pr2`. This is usually true,
   but for example if PR 1 renames an API, whereas PR 2 introduces a new call to that API, then their
   combination would fail even though they succeeded individually.

   The optimistic approach is significantly faster, since PR 1 and PR 2 can build in parallel
   and merge in any order. However, whenever the `main` branch gets broken, it's an unfortunate incident
   that requires reverting PR's or merging fixes to get back to a good state. Depending on support staff,
   this could take hours or even days, during which everyone's work is interrupted.
   In a high traffic monorepo, these incidents become prohibitively costly.

3. **Naively optimistic:** It's worth mentioning that early systems didn't even perform the hot merge.
   They used the optimistic strategy but with a potentially very outdated base from `main`.
   A policy might be used to restrict how old the base could be, measured in hours or Git commits.

## How a merge queue helps

Let's start with a decision that safety is non-negotiable: after PR 1 has merged into `main`,
we will NOT accept PR 2 based on a successful build of `start+pr2`. To be safe, we insist on having
a successful build of `start+pr1+pr2`.

The big insight of a merge queue is that `start+pr1+pr2` could be started earlier.
Here's a hypothetical timeline:

| time |  PR 1   |  PR 2   | `start+pr1` build | `start+pr2` build | `start+pr1+pr2` build |
| ---- | :-----: | :-----: | :---------------: | :---------------: | :-------------------: |
| 1:00 | created |         |                   |                   |                       |
| 1:01 |    .    |         |       start       |                   |                       |
| 2:00 |    .    | created |         .         |                   |                       |
| 2:01 |    .    |    .    |         .         |       start       |         start         |
| 4:00 |    .    |    .    |         .         |         .         |           .           |
| 5:00 |    .    |    .    |      success      |         .         |           .           |
| 5:01 | merged  |    .    |                   |         .         |           .           |
| 5:02 |         |    .    |                   |     cancelled     |           .           |
| 6:00 |         |    .    |                   |                   |           .           |
| 7:00 |         |    .    |                   |                   |        success        |
| 7:01 |         | merged  |                   |                   |                       |

Why did we build `start+pr2`, only to cancel it later? That job is needed if PR 2 happens to finish first,
which might look like this:

| time |  PR 1   |  PR 2   | `start+pr1` build | `start+pr2` build | `start+pr1+pr2` build |
| ---- | :-----: | :-----: | :---------------: | :---------------: | :-------------------: |
| 1:00 | created |         |                   |                   |                       |
| 1:01 |    .    |         |       start       |                   |                       |
| 2:00 |    .    | created |         .         |                   |                       |
| 2:01 |    .    |    .    |         .         |       start       |         start         |
| 4:00 |    .    |    .    |         .         |         .         |           .           |
| 5:00 |    .    |    .    |         .         |      success      |           .           |
| 5:01 |    .    | merged  |         .         |                   |           .           |
| 5:02 |    .    |         |     cancelled     |                   |           .           |
| 6:00 |    .    |         |                   |                   |           .           |
| 7:00 |    .    |         |                   |                   |        success        |
| 7:01 | merged  |         |                   |                   |                       |

Shouldn't there be an extra column for `start+pr2+pr1`, since that is what will end up in `main`? No,
the checked out files are the same as `start+pr1+pr2`. The build validation only cares about the source
file content, not its Git history.

Note that as the number of active PR's increases, the number of branch combinations explodes.
For example if we have three concurrent PRs, we might need six jobs for
`start+pr1`, `start+pr2`, `start+pr3`, `start+pr1+pr2`, `start+pr2+pr3`, and `start+pr1+pr2+pr3`.
Building all combinations could quickly exhaust our pool of machines.

To avoid exploding resource costs, we can skip combinations that seem relatively unlikely, and
still benefit from parallelism on average. As an extreme example, if we have high confidence that
PR 1, PR 2, and PR 3 will succeed, maybe we only need one job `start+pr1+pr2+pr3`; other combinations
can be tried only if it fails. Clearly there are many opportunities for a sophisticated implementation
to significantly outperform a more rudimentary merge queue.

## Leveraging Rush workspace dependencies

> 🚧 Coming soon: This feature is not yet ready.

Continuing the above example, suppose that PR 1 is a fix under `project-a`, and PR 2 is a fix under `project-b`;
that is, the Git diff for each PR only affects file paths under one project folder. Also let's assume that within
the Rush workspace, no other projects depend on `project-a` or `project-b`. This implies that:

- The source code built by `rush build --from project-a` is identical for branches `start+pr1` and `start+pr1+pr2`.
- The source code built by `rush build --from project-b` is identical for branches `start+pr2` and `start+pr1+pr2`.

These assumptions guarantee that PR 1 and PR 2 are completely independent. We can build them independently
and safely merge their branches in any order. The merge queue does not need to build `start+pr1+pr2` at all.

Next, suppose instead that the **package.json** file for `project-b` specified a dependency on `project-a`.
In that case, the PR's are no longer independent: After PR 1 has merged, PR 2 cannot be safely merged
without first verifying `start+pr1+pr2`.

This analysis relies on knowledge about dependencies between folders, which varies greatly between
programming languages and build systems. Even within the ecosystem of JavaScript, the interpretation of
**package.json** files requires special considerations for PNPM, Rush+PNPM, Yarn, etc.

Merge queues often provide a basic facility for describing folder dependencies, maybe a glob that can
describe static relationships such as:

- _"This folder has JavaScript code, and that folder has Golang code,
  so there cannot be any dependencies between them."_ OR
- _"This folder only contains non-buildable files such as documentation, so ignore any diffs there."_

However, in a busy monorepo with hundreds or thousands of projects, optimizing the merge queue requires
accurately modeling fine-grained dependencies between project folders. To this end, we're collaborating on
a language-agnostic
[project-impact-graph.yaml](https://github.com/tiktok/project-impact-graph) specification that services
such as a merge queue can use to query project dependencies in any monorepo for any programming language.
Using a Rush plugin, this YAML file will get generated by `rush update` and committed to Git, which enables
the merge queue service to efficiently query folder dependencies for any branch without requiring a Git checkout.

## Popular merge queues

It's recommended to use a merge queue in your monorepo. Here's some possible options:

- GitHub includes a built-in
  [merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
  that can be used with or without GitHub Actions
- [Mergify](https://mergify.com/) provides an add-on service for GitHub with advanced optimizations.
  See [Integrations: Using Mergify with Rush](../integrations/mergify.md) for setup details.
- GitLab includes a built-in [merge trains](https://docs.gitlab.com/ee/ci/pipelines/merge_trains.html) feature

_If your organization is using a merge queue with Rush that isn't listed above, please add it._
