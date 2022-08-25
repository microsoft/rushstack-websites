---
title: Enabling phased builds (experimental)
---

By default, Rush builds each project by running a build script (similar to `npm run build`) separately in each project folder, processing projects in parallel when the dependency graph allows. From Rush's perspective, everything that happens inside that build
script is a single operation.

_Phased builds_ are a way to increase parallelism, by defining individual operations as _phases_ that can be
executed on a project. As an example, if project B depends on project A, we could first build project A, and then
begin building project B while running the unit tests for project A in parallel.

> NOTE: Phased builds are built on top of, and require, the build cache feature -- if you haven't already enabled the build cache for your monorepo, see [Enabling build cache (experimental)](../maintainer/build_cache.md).

## Enable the experiment

In `common/config/rush/experiments.json`, enable the `"phasedCommands"` experiment.

```json
{
  "phasedCommands": true
}
```

## Define phases

In `common/config/rush/command-line.json`, add a section `"phases"`, as follows:

```json
{
  "phases": [
    {
      /**
       * The name of the phase. Note that this value must start with the \"_phase:\" prefix.
       */
      "name": "_phase:build",

      /**
       * The dependencies of this phase.
       */
      "dependencies": {
        "upstream": ["_phase:build"]
      },

      /**
       * Normally Rush requires that each project's package.json has a \"scripts\" entry matching the phase name. To disable this check, set \"ignoreMissingScript\" to true.
       */
      "ignoreMissingScript": true,

      /**
       * By default, Rush returns a nonzero exit code if errors or warnings occur during a command. If this option is set to \"true\", Rush will return a zero exit code if warnings occur during the execution of this phase.
       */
      "allowWarningsOnSuccess": false
    },
    {
      "name": "_phase:test",
      "dependencies": {
        "self": ["_phase:build"]
      },
      "ignoreMissingScript": true,
      "allowWarningsOnSuccess": false
    }
  ]
}
```

In this example, we define two phases -- `_phase:build` and `_phase:test`. The `_phase:build` operation depends on the `_phase:build` operation of its upstream projects (using the traditional Rush dependency graph). The `_phase:test` operation does not depend on any upstream projects, but requires the `_phase:build` operation of its _own_ project to be completed first. Note that phase names must start with `_phase:`.

Individual projects can choose not to implement a phase (if `ignoreMissingScript` is enabled), but they cannot define their own phases, or change the dependencies of phases. This ensures that phases will behave consistently within your monorepo, regardless of what subset of projects you are building.

## Redefine the build and test commands

In `common/config/rush/command-line.json`, in the `"commands"` section, redefine the `"build"` command to be a `phased` command instead of a `bulk` command, and specify what phases you would like it to run. In the example below we also define a `"test"` command.

```json
{
  "commands": [
    {
      "commandKind": "phased",
      "name": "build",
      "phases": ["_phase:build"],
      "enableParallelism": true,
      "incremental": true
    },

    // No need to define "rebuild", by default, it is the same as build
    // but with incremental=false.

    {
      "commandKind": "phased",
      "name": "test",
      "summary": "Build and test all projects.",
      "phases": ["_phase:build", "_phase:test"],
      "enableParallelism": true,
      "incremental": true
    },

    {
      "commandKind": "phased",
      "name": "retest",
      "summary": "Build and test all projects.",
      "phases": ["_phase:build", "_phase:test"],
      "enableParallelism": true,
      "incremental": true
    }
  ]
}
```

This command definition shows off another useful feature of phased builds: we can create our "phase" building blocks and then build commands out of them. Instead of `rush build` running builds and tests for all projects, we can define `rush build` to mean "build everything without tests", and `rush test` to mean "build everything and run tests".

## Assign parameters to phases

If you have defined any custom parameters for your build command in `command-line.json`, you'll now need to associate them to phases, so Rush knows which phases can accept your parameter.

Here are some examples:

```json
{
  "parameters": [
    {
      "longName": "--production",
      "parameterKind": "flag",
      "description": "Perform a production build, including minification and localization steps",
      "associatedCommands": ["build", "rebuild", "test", "retest"],
      "associatedPhases": ["_phase:build"]
    },
    {
      "longName": "--update-snapshots",
      "parameterKind": "flag",
      "description": "Update unit test snapshots for all projects",
      "associatedCommands": ["test", "retest"],
      "associatedPhases": ["_phase:test"]
    }
  ]
}
```

Here, we've defined one flag (`--production`) that can be specified on all 4 variations of our build command, but it will only be passed to the _build_ phase. And, we've defined anothe flag (`--update-snapshots`) that can be specified only on the `test` and `retest` commands, and is only passed to the `test` phase.

So, if we were to execute this command:

```bash
rush test --production --update-snapshots
```

Rush will pass the `--production` parameter to the `_phase:build` script for each project, and then pass the `--update-snapshots` parameter to the `_phase:test` script for each project.

## Add the phase scripts to your projects

Within the `package.json` file for every project in your monorepo, add the new `_phase:` scripts:

```json
{
  "scripts": {
    "_phase:build": "heft build --clean",
    "_phase:test": "heft test --no-build",
    "build": "heft build --clean",
    "test": "heft test --clean"
  }
}
```

The example above attempts to align developer expectations for the `build` and `test` commands:

- Moving into the project folder and running `rushx build` cleans and builds the project, without testing.
- Moving into the project folder and running `rushx test` cleans, builds, and tests the project.
- Running `rush build --only <project>` cleans and builds the project, without testing.
- Running `rush test --only <project>` cleans, builds, and tests the project.

Where possible, for any custom phases you define, keep this pattern in mind -- what's important isn't that phases are implemented identically to rushx commands, but rather that `rush <something>` and `rushx <something>` produce similar results, if applicable.

Some projects may not have any meaningful work to do for a phase, in which case you can define it as an empty operation (`""`), or leave it off entirely, if `ignoreMissingScript` was specified in the phase definition.

## Define per-phase output folder names

Within the `rush-project.json` configuration file of each project (or, preferably, each rig profile), redefine your `operationSettings` so that each folder is specified in only one phase. For exampe:

```json
{
  "operationSettings": [
    // Old configuration (before phases)
    {
      "operationName": "build",
      "outputFolderNames": ["lib", "lib-commonjs", "dist", "temp"]
    },
    // New configuration (after phases)
    {
      "operationName": "_phase:build",
      "outputFolderNames": ["lib", "lib-commonjs", "dist"]
    },
    {
      "operationName": "_phase:test",
      "outputFolderNames": ["temp/coverage", "temp/jest-reports"]
    }
  ]
}
```

Note how there's no overlap between the output folders specified by `_phase:build` and `_phase:test` -- this is an important new requirement for phased builds. In general, it's not possible for Rush to reliably cache the output of an operation if that output can be modified by a different operation, so you should structure your operations such that if `_phase:build` produces a `"lib"` folder, no other operation will put output in that folder.

> The phased builds feature is still under development. Feedback is welcome!
>
> Some relevant GitHub issues to follow:
>
> - [Design proposal: "phased" custom commands](https://github.com/microsoft/rushstack/issues/2300)
