---
title: Incremental builds
---

Rush's **incremental build** feature speeds things up by skipping projects that are already up to date.
In this context, "already up to date" means:

1. the project has already been built locally, AND
2. its input files and NPM dependencies have not changed since then, AND
3. if the project depends on any other Rush projects, those projects are up to date as well, AND
4. the command line parameters haven't changed. (For example, invoking `rush build --production`
   after `rush build` would require rebuilding.)

By default, the "input files" are all source files under the project folder, except for files that are excluded
by `.gitignore`; the details can be customized using the [rush-project.json](../configs/rush-project_json.md)
config file.

This feature can be combined with [project selection parameters](../developer/selecting_subsets.md),
where a person explicitly tells Rush which projects to process. Incremental builds reuse existing outputs on
your local disk. (This can be contrasted with Rush's upcoming
[build cache](../maintainer/build_cache.md)
feature that can fetch previously built outputs from a cloud storage container.
but it may eventually replace incremental builds entirely.)

## How to use it

To see incremental builds in action, simply run the `rush build` command twice:

```bash
rush install

# This might take several minutes...
rush build

# ...but the second time it finishes in just a few seconds.
rush build
```

The native `rush build` is hard-wired to be incremental. (And `rush rebuild` is the non-incremental variant of
this command.) If you define your own custom [bulk commands](../maintainer/custom_commands.md),
you can make them incremental as well by enabling the `"incremental"` option in
the [command-line.json](../configs/command-line_json.md) config file.

## How does it work?

Your project's build script (as invoked by `rushx build` or `npm run build`) probably already implements its own
incremental optimizations. For example, [Heft](https://rushstack.io/pages/heft/overview/) maintains multiple caches
for various tasks. However, even when `rushx build` does no work for a project, there is still nontrivial overhead
for spawning the Node.js process, evaluating JavaScript files, and comparing timestamps for individual files. Suppose
all those things take only 500ms for one project. If your monorepo has 100 projects, this works out to
100 x 0.5 = **50 seconds** worth of computation required in the best case where everything is already up to date.

Rush eliminates this overhead by performing its own global analysis of the repo, in a single pass -- this way
build scripts are not invoked at all for projects that are up to date. As an additional optimization, Rush's
incremental analysis relies on file hashes rather than timestamps. For example, if you switch to a different
Git branch, then switch back, many files may get their timestamps bumped, but Rush's incremental analysis won't
be impacted as long as the source file contents have not changed. The file hashes are managed by the
[@rushstack/package-deps-hash](https://www.npmjs.com/package/@rushstack/package-deps-hash) library.
The hashes are saved in a file such as `<your-project>/.rush/temp/package-deps_<task-name>.json`. Inspecting this
file can provide some insight into what the algorithm is doing.

There are actually three distinct behaviors for incremental analysis:

- **No incremental optimization:** If the invoked Rush command is not incremental (`incremental: false`
  in **command-line.json**), then the operation is always redone every time.

- **Output preservation:** If the Build Cache is disabled
  (`"buildCacheEnabled": false` in **build-cache.json**), then Rush checks to see whether the input files
  have changed since the previous build on the same local machine. If no files were modified, then Rush assumes
  that the output files under the project's folder are up-to-date, and the project is "skipped"
  without performing any work. Note that this assumption can be easily violated by manually tampering
  with the output files.

- **Cache restoration:** If the [build cache](../maintainer/build_cache.md) is enabled
  (`"buildCacheEnabled": true` in **build-cache.json**), then Rush instead queries the cache provider
  to see if this project has been built before. The cache provider may be cloud storage or the local disk cache.
  For a cache hit, the project's output files are deleted and replaced by restoring from the cache.

> **Possible future improvement:** In the current implementation, when the build cache is enabled, the
> **output preservation** strategy is never used. In other words, the project output folders are always
> cleaned and replaced by restoring from the cache, which seems inefficient in situations where
> the files on disk are already up to date. Would it be more efficient to combine **output preservation**
> and **cache restoration** approaches?
>
> The engineering challenge is that when the build cache is enabled, we also need to write to the cache,
> which requires a high degree of confidence in the correctness of the outputs. The **output preservation**
> algorithm currently does not validate hashes of the output files or check for extra/missing files.
> If such validation is implemented, its runtime must be faster than tarball extraction, which is
> already a very fast operation.

## Building changed projects only (unsafe)

Suppose hypothetically that our monorepo has the following projects:

<img src="/images/docs/selection-intro.svg" alt="a sample monorepo" style={{ height: "150px" }} />

In the above illustration, the circles represent local projects, not external NPM dependencies.
The arrow from `D` to `C` indicates that `D` depends on `C`; this means that `C` must be built before
`D` can be built.

Suppose that after rebuilding everything, we make a change to a source file under project `B`.
Projects `C` and `D` depend on `B`, so they need to be built as well:

<img src="/images/docs/selection-impact.svg" alt="rush build --impacted-by B" style={{ height: "150px" }} />

We might invoke:

```bash
# This command will rebuild B, C, and D
rush build
```

But what if you know that your change to `C` won't affect its API contract? For example, maybe you updated the
color of a button control, or some text in an error message.

The `--changed-projects-only` flag tells Rush to build only those projects where a file was changed:

<img src="/images/docs/selection-only.svg" alt="rush build --only B" style={{ height: "150px" }} />

We'd invoke it like this:

```bash
# This command will rebuild B (but ignore the effects for C and D)
rush build --changed-projects-only
```

The `--changed-projects-only` is "unsafe" because errors might be encountered if the downstream projects actually
did need to be rebuilt. This parameter saves time by assuming that you know better than Rush about what really needs
to be built. If that assumption is incorrect, you can always do `rush build` to get back to a good state.

## See also

- [Selecting subsets of projects](../developer/selecting_subsets.md)
- [Using watch mode](../advanced/watch_mode.md)
