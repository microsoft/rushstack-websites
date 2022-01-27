---
# The command-line.json comments refer to this article title:
title: Using watch mode
---

Popular tools like [Webpack](https://webpack.js.org/configuration/watch/) and [Jest](https://jestjs.io/en/cli.html)
provide a "watch mode" feature: After the task is completed, the tool enters a loop where it watches the file system
for changes to your source files. Whenever a change is detected, the task runs again to update its output.
This speeds up development because (1) rebuilding happens automatically whenever you save a file, and (2) the task
can benefit from in-memory caching because its process never terminates.

But these features typically only work for a single project. When working in a monorepo, we need a watch mode
that can monitor **_multiple projects at once._**

## A thought experiment

Suppose hypothetically that our monorepo has the following projects:

<img src="/images/docs/selection-intro.svg" alt="a sample monorepo" style={{ height: "150px" }} />

In the above illustration, the circles represent local projects, not external NPM dependencies.
The arrow from `D` to `C` indicates that `D` depends on `C`; this means that `C` must be built before
`D` can be built.

Suppose that you save a change to project `B`:

<img src="/images/docs/selection-impact.svg" alt="rush build --impacted-by B" style={{ height: "150px" }} />

For a multi-project "watch mode", we'd expect the following things to happen in order:

- `B` should get rebuilt because its file was changed;
- next, `C` should get rebuilt because it depends on `B`
- next, `D` should get rebuilt because it depends on `C`
- finally, the Webpack dev server (hosted by `D` presumably) refreshes your web browser with the rebuilt app

How to accomplish that with Rush? Suppose our projects `B` and `C` have a simplistic build script like this:

**package.json**

```js
  . . .
  "scripts": {
    "build": "rm -Rf lib/ && tsc && jest"
  }
  . . .
```

We might try an experiment like invoking `rush build --to-except D` in an endless loop...

```shell
# Build everything that D depends on (but not D itself),
# and keep doing that in an endless loop:
$ while true; do rush build --to-except D; done
```

...and then, while that is running, we invoke `heft start` (or `webpack serve`) in the folder for project `D`.

You'll find that this approach has some problems:

- The `rm -Rf lib/` deletes files that are symlink targets. Symlinks seem to confuse Webpack's file watcher, so
  you may see lots of errors reporting that an imported file cannot be found. Webpack won't recover from that,
  because the symlink timestamp isn't updated when the file is later rewritten.

- The `jest` and `rm -Rf` steps are generally unimportant while watching. The developer's inner loop for
  **_edit -> rebuild -> reload_** is much slower than it needs to be.

These problems can be solved by creating a special streamlined script for watch mode, something like this:

**package.json**

```js
  . . .
  "scripts": {
    "build": "rm -Rf lib/ && tsc && jest",
    "build:watch": "tsc"
  }
  . . .
```

## The "watchForChanges" setting (experimental)

Rush's "watch mode" formalizes this basic idea, replacing the simple loop with an optimized
[chokidar](https://www.npmjs.com/package/chokidar) filesystem monitor. Here's how you would use it:

1. Add a [custom command](../../maintainer/custom_commands) in
   your [command-line.json](../../configs/command-line_json) config file.
   Continuing the example above, our custom command will be called `"build:watch"`.
   The important settings are `"incremental"` and `"watchForChanges"`:

   **common/config/rush/command-line.json**

   ```js
     . . .
     "commands": [
       {
         "name": "build:watch",
         "commandKind": "bulk",
         "summary": "Build projects and watch for changes",
         "description": "For details, see the article \"Using watch mode\" on the Rush website: https://rushjs.io/",

         // use incremental build logic (important)
         "incremental": true,
         "enableParallelism": true,
         // Enable "watch mode"
         "watchForChanges": true
       },
     . . .
   ```

2. Add a `"build:watch"` script to the **package.json** file for each Rush project.
   ([PR #2298](https://github.com/microsoft/rushstack/pull/2298) aims to simplify this step
   for projects whose `"build:watch"` would be the same as `"build"`. Eventually it will also be possible
   to consolidate these definitions in a shared [rig package](https://rushstack.io/pages/heft/rig_packages/).)

   If you're using [Heft](https://rushstack.io/pages/heft/overview/), your scripts would look like this:

   **package.json**

   ```js
     . . .
     "scripts": {
       "build": "heft build --clean",
       "build:watch": "heft build"
     }
     . . .
   ```

3. Invoke the command using [project selection parameters](../../developer/selecting_subsets) that
   select all of `D`'s dependencies but not `D` itself:

   ```shell
   # Build everything that D depends on (but not D itself),
   # and keep doing that in an endless loop:
   $ rush build:watch --to-except D
   ```

4. Lastly, start your dev server in the app folder:

   ```shell
   # Start Webpack's dev server in the folder for project D
   # (which is the web application in this example):
   $ cd apps/D
   $ heft start # <-- or your own "npm run start" equivalent here
   ```

5. In some situations, the `--changed-projects-only` command can be combined
   with `"watchForChanges"` for even faster watching. The section
   [Building changed projects only](../../advanced/incremental_builds#building-changed-projects-only-unsafe)
   explains how it works and when it is appropriate.

> **"Experimental"** The `"watchForChanges"` feature is still in its early stages. Feedback is welcome!
> GitHub issue [#1202](https://github.com/microsoft/rushstack/issues/1202)
> tracks additional work items and [William Bernting](https://github.com/wbern)'s original dev plan.

## Community solutions

The Rush community has shared some interesting alternative approaches to this problem that are also
helpful:

- [@telia/rush-select](https://www.npmjs.com/package/@telia/rush-select) is an interactive dashboard
  for monitoring Rush projects and selecting what to rebuild.

- [rush-dev-watcher](https://github.com/dimfeld/rush-dev-watcher) is a simple but useful script from
  [Daniel Imfeld](https://github.com/dimfeld) that performs an initial build and then launches multiple watchers.

## See also

- [Selecting subsets of projects](../../developer/selecting_subsets)
- [Incremental builds](../../advanced/incremental_builds)
