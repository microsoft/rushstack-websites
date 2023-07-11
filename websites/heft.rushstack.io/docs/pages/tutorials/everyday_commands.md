---
title: Everyday Heft commands
---

The [Hello World](../tutorials/hello_world.md) tutorial introduced the `heft build` and `heft test` command-line actions. In this section, we'll call out a few everyday commands that are particularly useful to know about. Refer to the [Heft command line](../intro/cli.md) reference for a full listing of actions and parameters.

## Investigating problems

If you're diagnosing problems with the Heft build, there are a couple useful parameters to be aware of:

- `--verbose`: For example, instead of `heft build`, you can run `heft build --verbose` to see more details about how the tasks are invoked.
- `--debug`: For even more detail, you can run `heft --debug build` to see call stacks and additional trace information. Note that `--debug` is a global parameter, so it must precede the `build` action name.

## Running arbitrary sets of phases

Each phase that you define in **heft.config** will produce a pair of command-line actions
which invoke that phase and its dependencies (as declared using `phaseDependencies`).
The `heft run` command allows you to choose arbitrary phases to run:

```
usage: heft run [-h] [-t PHASE] [-T PHASE] [-o PHASE] ...

Run a provided selection of Heft phases.

Positional arguments:
  "..."                 Scoped parameters. Must be prefixed with "--", ex.
                        "-- --scopedParameter foo --scopedFlag". For more
                        information on available scoped parameters, use "--
                        --help".

Optional arguments:
  -h, --help            Show this help message and exit.

Optional scoping arguments:
  -t PHASE, --to PHASE  The phase to run to, including all transitive
                        dependencies.
  -T PHASE, --to-except PHASE
                        The phase to run to (but not include), including all
                        transitive dependencies.
  -o PHASE, --only PHASE
                        The phase to run.
```

Suppose that your `test` phase depends on `build`. Running `heft test` would then normally
perform both phases. To invoke **\*only** the `test` phase, you can use `heft run --only test`.

Note that tasks cannot be run individually. The phase is the smallest granularity for
selecting Heft operations.
