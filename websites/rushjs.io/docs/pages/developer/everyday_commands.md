---
title: Everyday commands
---

Your daily workflow only needs a few Rush commands:

## rush update

Remember to run `rush update` whenever a **package.json** file has changed. In other words:

- After pulling new changes from git (e.g. `git pull`)
- After manually editing any project's **package.json** file in any way
- After editing any **common/config** files that affect versions (e.g. **pnpmfile.js**, **common-versions.json**, etc.)

The `rush update` operation may change some files under **common/config**. If so, you should commit those changes to Git and include them in your PR. When in doubt, run `rush update` -- if everything is already up to date, it won't take any time!

What `rush update` does:

1. Rush checks/applies various policies that sometimes update files under **common/config**.
2. Rush compares all of your project **package.json** files against the repository's common shrinkwrap file to see if it's valid.
3. If it's outdated, the package manager updates the shrinkwrap file.
4. Either way, the package manager installs all dependencies into the **common/temp/node_modules** folder.
5. Finally, Rush constructs a local **node_modules** folder for each project, by making symlinks into **common/temp/node_modules**. (This is the same operation as `rush link`.)

> **What is this "shrinkwrap file"?**
>
> Most projects don't specify an exact version such as `1.2.3` for a dependency, but instead specify SemVer range such as `1.x` or `^1.2.3`. By itself, this would mean that what gets installed depends on the latest version at the time. Such **nondeterminism** is bad: It would be maddening for a Git branch that built on Monday to mysteriously be failing on Tuesday because of a new release of a library. The shrinkwrap file solves this problem by storing a complete installation plan in a large file that is tracked by Git.
>
> The shrinkwrap file has different names depending on the [package manager](../../maintainer/package_managers) that your repo is using: **shrinkwrap.yaml**, **npm-shrinkwrap.json**, or **yarn.lock**

You will notice that automated CI jobs use `rush install` instead of `rush update`. The difference is that `rush install` won't update any files. Instead, it will fail your PR build if something is out of date, to let you know that you forgot to run `rush update` or forgot to commit the result. (Some people choose to use `rush install` as their everyday command, in order to catch unintended changes to the shrinkwrap file.)

## rush rebuild

Once you've pulled the latest changes, it's time to compile everything. `rush rebuild` does a full, clean build of every project in the repository.

If your toolchain supports incremental builds, you can also use `rush build` to build only the projects that have changed.

## rushx

If you want to build just one project, you can use the `rushx` command. You run it under the project folder that you want to operate on. The `rushx` command is analogous to `npm run`, but with slightly less typing, slightly better error reporting, and command-line help.

## rush check

After editing a **package.json** file, you can run `rush check` to see if multiple projects are depending on different versions of the same library. In a monorepo environment, that is undesirable. Many repos will use `rush check` as a CI build step, so they can fail your PR build if you introduce side-by-side versions.

## rush change

If you work on libraries that get published as NPM packages, your repo probably requires you to include change log entries as part of your PR. You will know because your PR build will fail on the `rush change --verify` step.

To write change logs, first commit any pending work to Git. Then type `rush change` from anywhere under your repo working folder. This command will examine your Git history to determine which project folders have diffs. Based on that, it will prompt you to write a change log entry for each one. Each change log entry gets stored in a separate file under **common/changes**. You should add and commit these files to Git.

Later, Rush's automated publishing workflow will inspect these files to determine which packages need to be published. It will delete the files and copy your messages into the package's CHANGELOG.md file.

👉 See [Authoring change logs](../../best_practices/change_logs) for tips about writing change logs.

# Common scenarios

That's it! Those are all the commonly used Rush commands.

Combining everything, a typical daily incantation might look like this:

```bash
# Pull the latest changes from Git
git pull

# Install NPM packages as needed
rush update

# Do a clean rebuild of everything
rush rebuild

# Work on one project
cd ./my-project

# Let's assume there is a "start" script in the package.json.
# (To see the available commands, type "rushx" by itself.)
rushx start
```
