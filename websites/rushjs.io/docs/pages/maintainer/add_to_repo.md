---
title: Adding projects to a repo
---

_This continues the tutorial that started with "[Setting up a new repo](../../maintainer/setup_new_repo)". (To see a fully worked out sample based on these steps, take a look at the [rush-example](https://github.com/microsoft/rush-example) repo on GitHub.)_

## Step 4: Add your first project

Rather than trying to add all your projects to **rush.json** all at once, we recommend adding and validating each project one at a time. Recall that your projects form a [dependency graph](https://en.wikipedia.org/wiki/Dependency_graph), so start with the "leaf" projects (that don't depend on anything else in the repo), and then work your way backwards. If you encounter any errors, this approach makes it easier to understand and investigate them. If you commit each added project individually, this will also make your Git history more understandable to others.

For this example, let's start by adding our hypothetical **my-toolchain** project, which is needed to build everything else. Since we'll be conforming to the "category folders" model (described in the **rush.json** comments), we'll move this project under a "tools" category folder. Eventually we'll plan for other NodeJS tooling packages to go in the "tools" folder:

```
~/my-repo$ mkdir tools
~/my-repo$ cd tools
~/my-repo/tools$ cp -R ~/my-toolchain/ .
~/my-repo/tools$ cd my-toolchain
```

Next we need to delete project-specific files that are centrally coordinated in a monorepo:

- Delete the local shrinkwrap file, since it's superseded by Rush's common shrinkwrap file.
- Consider deleting the project's **.npmrc** file, since Rush operations always use **common/config/rush/.npmrc**
- Consider deleting the project's Git config files unless they contain rules that are really specific to that project

```
~/my-repo/tools/my-toolchain$ rm -f shrinkwrap.yaml npm-shrinkwrap.json package-lock.json yarn.lock
~/my-repo/tools/my-toolchain$ rm -f .npmrc          # (if it makes sense)
~/my-repo/tools/my-toolchain$ rm -f .gitattributes  # (if it makes sense)
~/my-repo/tools/my-toolchain$ rm -f .gitignore      # (if it makes sense)
```

> **More about the "shrinkwrap file"**
>
> Depending on your package manager, the shrinkwrap file may be called **shrinkwrap.yaml**,
> **npm-shrinkwrap.json**, **package-lock.json**, or **yarn.lock**. (Some package managers use the
> term "lock file", although it has nothing to do with file locking. In this documentation we will
> generically refer to it as a "shrinkwrap file" since we don't know which package manager you will choose.)
>
> Normally the package manager creates a shrinkwrap file in each project folder, but in a Rush repo
> there is a single "common" shrinkwrap file that describes the entire repo. It will be stored in
> the **common/config/rush** folder, and should be committed to Git. Consolidating all dependency
> information in a single shrinkwrap file has many benefits for reducing merge conflicts, reviewing diffs,
> and improving installation speed.

Commit the new project files to Git:

```
~/my-repo/tools/my-toolchain$ cd ../..
~/my-repo$ git add .
~/my-repo$ git commit -m "Adding my-toolchain"
```

## Step 5: Running your first "rush update"

After copying over the project files, we need to edit **rush.json** and add an entry like this under the `projects` inventory:

```jsonc
  "projects": [
    {
      "packageName": "my-toolchain",
      "projectFolder": "tools/my-toolchain"
    }
  ]
```

This tells Rush that it should manage this project.

> **Why can't Rush automatically detect my projects?**
>
> Rush does not automatically discover projects using wildcards. We have a few motivations for this
> design decision:
>
> 1. Depth-first scans are expensive, particularly when tools need to repeatedly collect the list.
> 2. On a caching CI machine, scans can accidentally pick up files left behind from a previous build.
> 3. It's useful to have a centralized inventory of all projects and their important metadata.
>    For example, this makes the approval/policy features more intuitive.

Next, run `rush update` to install the dependencies of **my-toolchain**. This command can be run in
any subfolder of the repo folder that contains rush.json:

```
~/my-repo$ rush update
~/my-repo$ git add .
~/my-repo$ git commit -m "rush update"
```

Since this is the first project for the repo, you'll notice that `rush update` creates several new files:

- **common/config/rush/shrinkwrap.yaml**: The common shrinkwrap file (here we're assuming PNPM package manager)
- **common/scripts/install-run-rush.js**: Used by CI jobs to bootstrap the Rush tool in a reliable way
- **common/scripts/install-run.js**: Used by CI jobs to bootstrap arbitrary tools in a reliable way

## Step 6: Verify that the new project builds

In order to build your projects, Rush will look for a `"build"` script in the `"scripts"` section of your **package.json** file. In our example from [rush-example](https://github.com/microsoft/rush-example), the project builds using a simple shell script `"rimraf ./lib/ && tsc"`:

```json
{
  "name": "my-toolchain",
  "version": "1.0.0",
  "description": "An example toolchain used to build projects in this repo",
  "license": "MIT",
  "bin": {
    "my-build": "bin/my-build.js"
  },
  "scripts": {
    "build": "rimraf ./lib/ && tsc"
  },
  "dependencies": {
    "colors": "^1.3.2"
  },
  "devDependencies": {
    "@types/node": "^10.9.4",
    "rimraf": "^2.6.2",
    "typescript": "^3.0.3"
  }
}
```

There are a few things to keep in mind when creating a `"build"` script:

- Rush will normally use your system PATH environment variable to find the script commands. However, if you specify a single-word command like "gulp" or "make", Rush will first look for the program in the `common\temp\node_modules\.bin` folder.

- If the process returns a non-zero exit status, Rush will assume there was a failure and will block downstream builds.

- If the command writes anything to the `stderr` stream, Rush will interpret this to mean that at least one error or warning was reported. This will break the build. (This is by design -- if you allow people to merge PRs that "cry wolf", pretty soon you will find that so many warnings have accumulated that nobody even reads them any more.) Some tooling libraries (e.g. Jest) write to `stderr` as part of their normal operation; you will need to [redirect their output](https://github.com/microsoft/rushstack-legacy/blob/main/core-build/gulp-core-build/src/tasks/JestReporter.ts#L14).

- If certain projects don't need to be processed by `rush build`, you still need a `build` entry. Set the value to an empty string (`""`) and Rush will ignore it.

Now let's try building your project. From anywhere under the folder containing **rush.json**, run this command (which builds all projects in the repo):

```
$ rush build
```

Rush provides a lot of command-line switches for building projects. See [rush build](../../commands/rush_build) and [rush rebuild](../../commands/rush_rebuild) for details.

> **Phantom dependency errors**
>
> Rush and PNPM use symlinks to prevent projects from importing [phantom dependencies](../../advanced/phantom_deps).
> If an NPM dependency is not declared in your **package.json** file, a runtime error may occur if your project tries to
> import it. These phantom dependency errors are one of the most common issues when migrating an existing project into
> a Rush monorepo. Generally the fix is simply to add the missing dependency to your **package.json** file.
>
> The [rush scan](../../commands/rush_scan) command is a quick way to detect these problems.

## Step 7: Adding more projects

You can add more projects by following the same operations from Step 4. In our example, we would add **my-controls** next (because it depends on **my-toolchain**), and then **my-application** last (because it depends on everything). We proactively added a couple more category folders ("libraries" and "apps") since we expect more of these types of things in our scenario. The filled out `"projects"` section looks like this:

```jsonc
  "projects": [
    {
      "packageName": "my-app",
      "projectFolder": "apps/my-app"
    },

    {
      "packageName": "my-controls",
      "projectFolder": "libraries/my-controls",
      "reviewCategory": "production"
    },

    {
      "packageName": "my-toolchain",
      "projectFolder": "tools/my-toolchain",
      "reviewCategory": "tools"
    }
  ]
```

Once you have all your projects added and building without errors, you may consider enabling other optional features. The config files contain lots of snippets that you can uncomment to get started. The [rush-example](https://github.com/microsoft/rush-example) repo uses some of these snippets.
