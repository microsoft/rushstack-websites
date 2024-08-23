---
title: Speed up Git with Sparo
---

Monorepos often grow quickly as they assimilate more and more projects. Although Rush provides various mechanisms for speeding up [install times](../advanced/subspaces.md) and [build times](../maintainer/cobuilds.md), for very large repositories even basic operations such as `git clone` and `git checkout` may become frustratingly slow.

## Git optimizations

Git offers some built-in features that may be sufficient to speed up a medium-sized repository:

- [Shallow clone](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt-code--depthcodeemltdepthgtem) allows cloning only a few commits, but is generally only suitable for throwaway clones such as a CI job.

- [Partial clone](https://git-scm.com/docs/partial-clone) allows cloning without file contents ("blobless" clone) or even commit details (treeless clone), greatly accelerating your `git clone` time and allowing such details to be fetched during `git checkout`.

- [Large file storage (LFS)](https://git-lfs.com/) can move large binary files to a separate server, downloading them during checkout only as needed. Usage of LFS is tricky however, because this feature relies on `.gitattributes` filtering external to Git: Your `.gitattributes` rules can select what's "large" according to file extension, but there is no easy way to select based on the real file size or update frequency. If you accidentally select too many files, performance may be worse than without LFS. Additionally, changes to `.gitattributes` cannot be retroactively applied without rewriting the entire Git history -- a very disruptive action for an active repository.

Fortunately, Git offers even more advanced features such as **sparse checkout**, **single-branch clone**, **filesystem monitor**, **background maintenance**, and a variety of opt-in settings for tuning behaviors. These features can be accessed directly via the Git command-line, but configuration can be complex. Casual users often struggle with adoption.

## How Sparo helps

For an easier alternative for applying advanced Git optimizations, try the [Sparo](https://tiktok.github.io/sparo) tool. It directly integrates with Rush and automatically optimizes Git. The basic strategy is to _**fetch only what you need**_ along three dimensions: (1) skip irrelevant branches, (2) skip irrelevant history (partial clone), (3) skip checkout of irrelevant project folders (sparse checkout).

Sparo simplifies sparse checkout using [Sparo profiles](https://tiktok.github.io/sparo/pages/guide/sparo_profiles/), which can specify intelligent selections such as: _"Checkout only the two apps that my team works on, plus all their dependencies in the Rush workspace."_ In this way, engineers do not need to spend time determining the exact folder paths to be checked out. Sparo checkouts always include a base set of ["skeleton folders"](https://tiktok.github.io/sparo/pages/reference/skeleton_folders/); this ensures that every project's **package.json** file is always available. Sparo can also optionally collect anonymized Git timing metrics, helping your build team to analyze performance over time.

The [Sparo website](https://tiktok.github.io/sparo/) provides more background.

## Using Sparo

The Git and Sparo command lines can be used interchangeably. The only requirement is that your working directory must be cloned initially using `sparo clone` instead of `git clone`.

Here's a quick walkthrough using [azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js.git), a large public RushJS monorepo from GitHub:

### Step 1: Clone the repo

```shell
# Install the Sparo command-line
npm install -g sparo

# Clone your Rush repository -- only the minimal "skeleton" gets cloned
sparo clone https://github.com/Azure/azure-sdk-for-js.git
```

### Step 2: Create a profile

```shell
cd azure-sdk-for-js

# Create a sparse checkout profile, saved in common/sparo-profiles/my-team.json
sparo init-profile --profile my-team
```

Edit the created **my-team.json** file to add a [project selector](../developer/selecting_subsets.md). For example:

**common/sparo-profiles/my-team.json**

```js
{
  "selections": [
     {
       // This demo profile will check out the "@azure/arm-commerce" project
       // and all of its dependencies:
       "selector": "--to",
       "argument": "@azure/arm-commerce"
     }
  ]
}
```

### Step 3: Checkout your profile

After saving your changes to **my-team.json**, now it's time to apply it:

```shell
sparo checkout --profile my-team
```

Try it out! For example:

```shell
rush install

# The build should succeed because Sparo ensured that dependency projects
# were included in the sparse checkout:
rush build --to @azure/arm-commerce
```

For everyday work, consider choosing mirrored subcommands such as `sparo revert` instead of `git revert`. The Sparo wrapper provides (1) better defaults, (2) suggestions for better performance, and (3) optional anonymized performance metrics.

Examples:

```shell
sparo pull

sparo commit -m "Example command"
```

## See also

- [Sparo website](https://tiktok.github.io/sparo/)
- [Faster Git for Frontend Monorepos: Introducing Sparo](https://developers.tiktok.com/blog/2024-sparo-faster-git-for-frontend-monorepos) - blog post from the Sparo maintainers
