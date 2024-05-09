---
# The CLI help refers to this article title:
title: Selecting subsets of projects
---

[Bulk commands](../maintainer/custom_commands.md) like `rush build` and `rush rebuild` operate on
all projects in the monorepo by default. This becomes expensive as you accumulate more and more projects.
To speed things up, Rush provides a set of command-line parameters for selecting subsets of projects.

Suppose we're working with the following collection of Rush projects:

<img src="/images/docs/selection-intro.svg" alt="a sample monorepo" style={{ height: "150px" }} />

In the above illustration, the circles represent local projects, not external NPM dependencies.
The arrow from `D` to `C` indicates that `D` depends on `C`; this means that `C` must be built before
`D` can be built. We'll use the `rush build` command in the examples given below, but these same parameters
work for any bulk command.

## Selection parameters

### -<!---->-to

**Possible scenario:** Suppose that you have just cloned your monorepo, and now you want to start working
on project `B`. You need to build all the things that `B` depends on, and also `B` itself.

Here's how to do that:

```bash
# Build everything up to (and including) project B
rush build --to B
```

The projects selected by this command are `A`, `B`, and `E`:

<img src="/images/docs/selection-to.svg" alt="rush build --to B" style={{ height: "150px" }} />

### -<!---->-to-except

**Possible scenario:** In many cases we do not need `rush build` to process `B`, because our next step
will be to invoke Webpack or Jest in "watch mode" for `B`. You can use `--to-except` instead
of `--to` to exclude `B`.

```bash
# Build everything up to project B, but not B itself
rush build --to-except B

# Invoke Jest watch mode to build B
heft test --watch
```

The projects selected by this command are `A` and `E`:

<img src="/images/docs/selection-to-except.svg" alt="rush build --to-except B" style={{ height: "150px" }} />

### -<!---->-from

**Possible scenario:** Now that we've finished making our changes to `B`, we want to build the downstream
projects `C` and `D` to make sure their tests were not broken by our change. In order to build `D`,
we also need to include its dependency `G`. The `--from` command does this. It will also include `A` and `E`
since they're required by `B`. (Since `rush build` is incremental, `A` and `E` will probably get skipped assuming
they are still up to date.)

```bash
# Build everything downstream from B, including any implied dependencies
rush build --from B
```

This command selects everything except for `F`:

<img src="/images/docs/selection-from.svg" alt="rush build --from B" style={{ height: "150px" }} />

> **Compatibility note:** If the `rushVersion` setting in your **rush.json** is older than 5.38.0,
> then `--from` will instead behave like `--impacted-by`. The meaning was changed in Rush 5.38.0 because
> most users expected `--from` to include dependencies.

### -<!---->-impacted-by (unsafe)

**Possible scenario:** Suppose that while working on `B` we made some changes to `E`. The `rush build`
incremental analysis assumes that any change to `E` requires all its downstream dependents to be rebuilt,
including `F` for example. That can be a big set. Maybe you know better -- perhaps you later reverted your change
in `E`, or maybe you manually invoked the toolchain so `E` is in good shape, or maybe your change to `E` is
not relevant right now.

In these situations the `--impacted-by` parameter can be handy: It means _"Select only those projects
that might be broken by a change to B, and trust me that their dependencies are in a usable state."_

```bash
# Build B and everything downstream from B, but don't include dependencies
rush build --impacted-by B
```

The projects selected by this command are `B`, `C`, and `D`:

<img src="/images/docs/selection-impact.svg" alt="rush build --impacted-by B" style={{ height: "150px" }} />

### -<!---->-impacted-by-except (unsafe)

**Possible scenario:** This is the same as `--impacted-by` except that it does not include `B` itself. For example
that might make sense if you already built `B` manually while implementing the thing that we now want to test.

```bash
# Build everything downstream from B, but don't include dependencies
rush build --impacted-by-except B
```

The projects selected by this command are `C` and `D`:

<img src="/images/docs/selection-impact-except.svg" alt="rush build --impacted-by-except B" style={{ height: "150px" }} />

### -<!---->-only (unsafe)

**Possible scenario:** As its name implies, the `--only` parameter adds exactly one project to the selection,
ignoring dependencies.

```bash
# Build only B and nothing else
rush build --only B
```

<img src="/images/docs/selection-only.svg" alt="rush build --only B" style={{ height: "150px" }} />

The `--only` parameter is most useful when combined with other parameters. For example, in our narrative above
when we did `rush build --impacted-by B`, maybe we had not actually built `G` yet. We can include it by
doing `rush build --impacted-by B --only G`.

> **"Unsafe" parameters:** The parameters `--only`, `--impacted-by`, and `--impacted-by-except` can all fail if the
> required dependencies are not built. These three parameters save time by assuming that you know better than Rush
> about what really needs to be built. If that assumption is incorrect, you can always do `rush build` to get back
> to a good state.

## Selectors

When you use a **selection parameter** such as `rush build --to X`, the argument `X` is called a **selector**.
In the discussion above, we assumed that the selector was always the name of a single Rush project.
Rush supports a variety of other selector syntaxes, some of which can refer to more than one Rush project.

### Project name

The simplest selector is the full name of the Rush project, which is the `"name"` field from **package.json**.

Examples:

```bash
rush build --to @my-company/my-project-name
```

```bash
rush build --from @my-company/my-project-name
```

```bash
rush list --impacted-by @my-company/my-project-name
```

If the package name includes an NPM scope such as `@my-company`, Rush allows you to omit the scope for brevity
(as long as the unscoped name is not used by some other project in your workspace).

Examples:

```bash
rush build --to my-project-name
```

```bash
rush build --from my-project-name
```

```bash
rush list --impacted-by my-project-name
```

Generally the disk folder of `@my-company/my-project-name` would also be called `my-project-name`,
a practice which we strongly recommend to avoid confusion. It is important to understand that this selector
is NOT matching the disk folder.

### Current folder: `.`

The folder containing a Rush project's **package.json** file is called the **project folder**. If your
shell's current working directory is somewhere under a project folder, then the selector `.` provides
a convenient shorthand for referring to that project.

Examples:

```bash
cd my-project-name

# Build "@my-company/my-project-name" whose package.json
# is in the current working directory
rush build --to .

cd src

# The "." selector can also be resolved from a subfolder
# such as my-project-name/src
rush list --to-except .
```

### Modified projects: `git:`

By providing a [Git reference](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection) expression
(branch, tag, or commit hash), you can select all projects with modifications since the corresponding commit.
This type of query uses similar logic as the `rush change` command: Rush calculates the `git diff` of the
current working directory versus the referenced commit, then computes a list of affected file paths.
These file paths are then matched with project folders from your **rush.json** workspace: In this way,
the `git:` selector identifies the set of Rush projects with at least one modified file.

```bash
# Select projects whose source code has been changed according to Git,
# using the "main" branch as the basis for comparison.
# Build "--to" those projects and their dependencies.
rush build --to git:origin/main
```

```bash
# Select projects whose source code has been changed since
# the Git tag named "release/v3.0.0".
# List the downstream projects that would be "impacted by" these changes.
rush list --impacted-by git:release/v3.0.0
```

### Subspace members: `subspace:`

The [subspaces](../advanced/subspaces.md) feature enables Rush projects to be grouped into subspaces that install using their own PNPM lockfile. The `subspace:` selector matches all projects belonging to a given subspace.

Example:

```bash
# Build all projects belonging to the "install-test" subspace, as well
# as their dependencies:
rush build --to subspace:install-test
```

### Tagged projects: `tag:`

Rush [project tags](../developer/project_tags.md) enable you to define arbitrary collections of projects,
which can then be referenced using the `tag:` selector.

Examples:

```bash
# Build all projects that were tagged with the "shipping" project tag.
rush build --to tag:shipping
```

```bash
# Print a report showing the set of projects
# that have the "frontend-team-libs" project tag.
rush list --only tag:frontend-team-libs --detailed
```

## Combining parameters

- You can combine any of the selection parameters on a single command line. The result is always the union of each
  individual selection.
- The same parameter can be specified multiple times. For example: `rush build --only A --only B --only C`
  will select `A`, `B`, and `C`
- Note that Rush does not provide any parameter that would reduce the selection. This is an intentional design choice;
  in [#1241](https://github.com/microsoft/rushstack/issues/1241) we'll implement personal tags for building up more
  complex selections.)

Here's a more complex combined command-line:

```bash
rush build --only A --impacted-by-except B --to F
```

The projects selected by this example are `A`, `C`, `D`, `E`, and `F`:

<img src="/images/docs/selection-multi.svg" alt="rush build --only A --impacted-by-except B --to F" style={{ height: "150px" }} />

## See also

- [Incremental builds](../advanced/incremental_builds.md)
- [Using watch mode](../advanced/watch_mode.md)
- [Using project tags](../developer/project_tags.md)
- [rush build](../commands/rush_build.md)
- [rush rebuild](../commands/rush_rebuild.md)
