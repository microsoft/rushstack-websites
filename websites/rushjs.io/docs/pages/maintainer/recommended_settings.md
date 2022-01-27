---
title: Recommended settings
---

Once your repo is up and running, there are a number of settings in **rush.json** that
we recommend enabling. These stricter settings help to improve repo health and reduce
maintenance headaches. They are disabled by default because they sometimes require
some fixes to your code base, and may not be appropriate for all situations.

## repository.url

If your repo uses the `rush change` command to track change logs, we strongly recommend to set
the `repository.url` in your **rush.json**. This ensures that `rush change` will be able to
accurately find the base branch for comparison, especially in situations where the developer's
repo has been "forked" from the main repo.

Example excerpt from **rush.json**:

```js
  "repository": {
    // Replace this with the URL that you use when running "git clone" for your repo
    "url": "https://github.com/microsoft/rush-example"
  }
```

## ensureConsistentVersions

We recommend to set `ensureConsistentVersions` to `true` in **rush.json**. This causes
Rush to automatically perform the `rush check` validation whenever any of the following
commands are invoked:

- `rush install`
- `rush update`
- `rush link`
- `rush version`
- `rush publish`

This validation checks each project's **package.json** file and ensures that all dependencies
are of the same version throughout the repository. This is desirable in general and avoids
a lot of problems related to inconsistent versions.

Sometimes there are special cases where multiple versions are desirable. For example,
maybe you want upgrade your projects to the new TypeScript compiler in stages, rather than
all at once. During this transition, you may need two different `typescript` releases
installed for your repo. For those exceptions, you can add an entry to the
`allowedAlternativeVersions` section of the **common-versions.json**.

> NOTE: In earlier releases of Rush, the CI script examples included `rush check` as
> a build step. The `ensureConsistentVersions` setting removes the need for that.
> If you enable `ensureConsistentVersions`, then you can delete `rush check` from your
> CI build steps.

## strictPeerDependencies

If you're using the PNPM package manager, we strongly recommend setting `strictPeerDependencies`
to `true` in **rush.json**. This causes Rush to use PNPM's `--strict-peer-dependencies` option
during installation. With this protection, `rush install` will fail if there are unsatisfied
peer dependencies, which is an invalid state that can cause build failures or incompatible
dependency versions. (For historical reasons, JavaScript package managers generally do not treat
this invalid state as an error.)
