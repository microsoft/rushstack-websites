---
layout: page
title: Publishing packages
navigation_source: docs_nav
---

# How to use Rush in your build flow to automate publishing of updated packages

There are two stages in a Rush publishing flow. The first stage is during development. Developers are asked to provide change files to track changes that deserve a space in change log. The second stage is at publishing time. Rush can be used to gather all change files to increase version, update change log, and publish new packages to a npm registry.

## 1. Track Changes

Only changes to public packages need to be tracked. People can control which package should get published and which package should not get published in rush.json by specifying field [shouldPublish]({% link pages/maintainer/setup_new_repo.md %}). Once public packages have been defined, repo admins can enforce developers to provide change files if they have modified any public packages. Developers can use a tool to generate change files after answering a few questions.

### How to enforce developers to provide change files

    rush change --verify

This command fails if a developer modifies a public package without providing related change files. It is recommended to add this command as a step of CI builds so that build fails when change files are missing.

### How a developer generates change files

    rush change

Running `rush change` will prompt a developer with a few questions and generate appropriate change files after questions have been answered. A change file contains what type of version increase this change needs and a description of the change. The change file should be committed with related changes into the repo.

## 2. Publish packages

    rush publish

When it is time to publish updated packages, `rush publish` is the command that increases package version and publish updated packages. It does quite a few things internally to make it happen: gather all change files to figure out what kind of version increase is needed, what packages need to have version increase, increase the versions of dependencies, clean up change files, and so on.

This command should have its own build definition. So people can just trigger it to run when it is time to publish packages.

`rush publish` is configurable to serve difference purposes. For example, it supports a dry run mode so that the changes can be verified and tested before real publishing. More usage cases are listed here:

### Dry run mode

    rush publish --apply

It does the whole process in a dry run mode which means the changes are not committed and packages are not really published. It is useful if you want to check if the version increases and change log updates look right for you.

    rush publish --apply --target-branch targetBranch

The same dry run mode. The only difference between this one and the previous one is that the changes are committed to the provided target branch.

### Publish mode

There are extra parameters for configuring the publishing process: which registry to publish to, what token to use, and whether to include commit details.

    rush publish --apply --target-branch targetBranch --publish

This command increases versions, commit changes to targetBranch, and publish packages to a registry based on environmental npm registry value.

    rush publish --apply --target-branch targetBranch --publish --registry registryUrl --npm-auth-token npmToken

In addition to what previous command can do, this command allows packages to be published to the specified registry with a specified npm token.

    rush publish --apply --target-branch targetBranch --publish --registry registryUrl --npm-auth-token npmToken --add-commit-details

In addition to what previous command can do, This command will include commit details in the change logs.

### Pack mode

Instead of publishing, you also have the option to pack the outputs locally into `.tgz` files.

    rush publish --pack --include-all --publish

> Note: the `--publish` flag disables dry mode, which allows writing the file contents to the disk.
>
> You can also use this command in combination with `--release-folder` to hint where the files should be outputted.

## 3. Version Policy

Version policy is a new concept introduced into Rush to solve the problem of how to notify packages to do different types of version increase when the number of packages is large. For example, rush and rush-lib are always published together and use the same version. Those two versions should always be increased together. Another example is that developers can create different branches to service different major versions. People should not be able to modify the major version in that branch. Version policy solves this kind of problems by defining different policies, one enforcing rush and rush-lib always have the same version and the other locking the major version in a branch.

### What is a version policy?

A version policy is set of rules that define how the version should be increased. It is defined in common/config/rush/version-policies.json. An example can be found in [here](https://github.com/microsoft/rushstack/blob/master/common/config/rush/version-policies.json). A public package specifies what version policy it is associated with by providing versionPolicyName in rush.json. An example can be found in [Rush and Rush-lib configuration](https://github.com/microsoft/rushstack/blob/master/rush.json#L46). Multiple packages can use one version policy if they all follow the same rules. When a package is associated with a version policy, it becomes public and can be published when ‘rush publish’ runs.

The schema of version-policies.json is defined [here](https://github.com/microsoft/rushstack/blob/master/apps/rush-lib/src/schemas/version-policies.schema.json).

### Two types of version policies

There are currently two types of version policies supported: lockstep version policy and individual version policy. Projects using one lockstep version policy all have the same version. Projects using an individual version policy get version increased according to their change files and the restrictions of the policy. For example, if an individual version policy has a locked major version, all packages using this policy will have their major version locked.

```
[
  {
    "policyName": "myPublic",
    "definitionName": "lockStepVersion",
    "version": "1.0.0-dev.6",
    "nextBump": "prerelease"
  },
  {
    "policyName": "myInternal",
    "definitionName": "individualVersion",
    "lockedMajor": 3
  }
]
```

### Publishing process when version policies are used

You need two steps to publish your packages when version policies are used. The first step is to increase the package versions. And the second step is to publish the packages. The reason to break up publishing into two steps is that it is very often that you need to test the packages after version increase and before package publishing.

#### Command to increase version

`rush version --bump`

Running `rush version --bump` will increase package versions based on their associated version policies.

#### Command to publish packages

`rush publish --include-all`

Running `rush publish --include-all` will publish all the public packages that have version increased.

## 4. Summary

In summary, you can use Rush to automate the whole publishing flow for your repo.
