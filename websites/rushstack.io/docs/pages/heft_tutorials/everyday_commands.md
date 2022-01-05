---
title: Everyday Heft commands
---

The [Getting started with Heft](../getting_started) tutorial introduced the `heft build` and `heft test` command-line actions.  In this section, we'll call out a few everyday commands that are particularly useful to know about.  Refer to the [Heft command line](../heft/cli) reference for a full listing of actions and parameters.


## Investigating problems

If you're diagnosing problems with the Heft build, there are a couple useful parameters to be aware of:

- `--verbose`:  For example, instead of `heft build`, you can run `heft build --verbose` to see more details about how the tasks are invoked.
- `--debug`: For even more detail, you can run `heft --debug build` to see call stacks and additional trace information.  Note that `--debug` is a global parameter, so it must precede the `build` action name.


## Building with -<!---->-watch

If you run `heft build --watch`, the TypeScript compiler will continue running and wait for changes to source files.  Whenever a file is changed, Heft will rebuild only the affected files, as a minimal incremental update that can be very fast.

When using Webpack, `heft start` invokes a localhost dev server (see [DevServer](https://webpack.js.org/configuration/dev-server/)) that uses this mode to automatically reload the web browser with the recompiled code, every time a source file is saved.  This can save a lot of time when tuning UI layouts!  The `--watch` parameter is not needed with `heft start`, because watch mode is always enabled for that action.


## Jest interactive shell

For tests, you can also do `heft test --watch` which invokes Jest's interactive shell.  It shows a menu like this:

```
No tests found related to files changed since last commit.
Press `a` to run all tests, or run Jest with `--watchAll`.

Run start. 0 test suites

Tests finished:
  Successes: 0
  Failures: 0
  Total: 0

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

Whenever you save a change to a source file, Heft will automatically recompile the project, and then Jest will rerun any affected tests, updating the report.
