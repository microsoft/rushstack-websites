---
title: Interfacing with Rush
---

The [Getting started with Heft](../heft_tutorials/getting_started) tutorial showed how Heft can be used in a standalone project.  Now let's look at how Heft works in the context of a  Rush monorepo.

## How Heft gets invoked

If you're new to Rush, the [maintainer tutorials](@rushjs/pages/maintainer/setup_new_repo/) explain the basics of setting up a new repo.  Heft takes over when Rush invokes the `"build"` script in a Rush project folder.  In our sample project from the tutorial, the script looked like this:

**&lt;project folder&gt;/package.json**
```
{
  . . .
  "scripts": {
    "build": "heft build --clean",
    "start": "node lib/start.js"
  }
  . . .
}
```

## Sharing configuration using rig packages

A major theme in monorepos will be _**minimizing "boilerplate" files**_.  In other words, consolidating files and settings that would otherwise get copy+pasted into every single project folder in the monorepo.  Boilerplate is a nuisance because it's difficult to keep in sync.  When a fix is needed, if you have hundreds of projects, you would need to reapply the same fix hundreds of times.

At the same time however, we want to honor Rush's _**principle of project isolation**_:  Each project should build independently and should not become entangled with other projects (for example, by referencing files using relative paths like `../../other-project`).  This discipline facilitates Rush features like subset builds and incremental builds. It also makes it very easy to move Rush project folders around,  to migrate projects between monorepos, and even to stop using Rush later if you change your mind.  For this reason, we discourage practices such as putting a centralized **.eslintrc.js** file in the root of the monorepo and invoking ESLint globally for all projects.

Instead, Heft supports a formalism called **rig packages**, where common settings are provided by an NPM package that is added to each project's `devDependencies`.  Rig packages offer three different ways to reduce duplication:

1. Config files can use a setting such as `"extends"` to inherit common settings from a rig.  Example: **tsconfig.json**
2. Riggable config files can be eliminated entirely, using a **config/rig.json** file that directs Heft to find them in the rig package.  Example: **config/heft.json**
3. Riggable dependencies can be provided by the rig package, avoiding the need to add them to your project's `devDependencies`. Example: the **typescript** package

The [Using rig packages](../heft/rig_packages) article describes this in detail.

## Incremental builds

Another benefit of using Rush with Heft is support for incremental builds.  For example, if you run `rush build` twice, the second time it will complete instantly, since all projects have already been built.  Interestingly, this incremental build analysis is performed by Rush itself, not Heft.

Since JavaScript is an interpreted language, there is a small overhead every time a Node.js process is launched in a project folder.  Thus even if Heft performs no work at all, it might take 1 second simply to spin up the toolchain, analyze the input files, and determine that everything is up to date.  For a monorepo with 500 projects, that adds up to 500 seconds of analysis.  Rush avoids this by perform a global analysis of all projects, comparing the hash of your source files against a hash of the output files.  If these hashes are the same, then Rush can determine that a project can be skipped entirely without even launching Heft.  Rush's incremental build analysis works for any well-behaved script, not just Heft.
