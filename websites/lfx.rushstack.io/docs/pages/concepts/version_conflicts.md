---
title: Version conflicts
---

From a high level perspective, Lockfile Explorer is a tool for coordinating versions of library packages.
This is a classic problem in computer science, sometimes jokingly called **dependency hell** or **DLL hell**.

## An example problem

> **Some notation**
>
> We'll use an expression like `calendar@1.0.0` to indicate the published version `1.0.0` of the
> NPM package `calendar`. NPM package names sometimes also include a scope, for example `@my-company/calendar`,
> in which case we would write `@my-company/calendar@1.0.0`.
>
> As a shorthand, where the package name doesn't matter, we may replace the package name with a
> capital letter variable such as `A@1.2.3` or `B@3.2.1`. If the extra SemVer parts are unimportant,
> we may write `A@1` as a shorthand for `A@1.0.0`. These shorthand notations are not legal NPM package
> names or versions.

As a motivating example, suppose we're developing a project `my-app` that depends on two hypothetical
library packages `calendar@1.0.0` and `video-player@2.0.0`. Let's suppose that these two libraries
both depend on `fancy-button`, but different versions:

- `calendar@1.0.0` depends on `fancy-button@3.0.0`
- `video-player@2.0.0` depends on `fancy-button@4.0.0`

Why are the versions inconsistent? Perhaps the latest release of `calendar` was published sometime ago,
whereas `video-player` just got a new release, so it's using the new version 4 of `fancy-button`.
This creates a **"diamond dependency"**, where `my-app` directly depends on `calendar` and `video-player`
but indirectly depends on `fancy-button`. And in this case, the diamond dependency causes **side-by-side
versions** of `fancy-button`. Specifically the versions `3.0.0` and `4.0.0`.

Side-by-side versions may cause performance issues, such as bloating the size of your bundled app.
They may cause compile failures, for example if the TypeScript types for `fancy-button` conflict
with each other. They may also cause runtime failures, for example initializing multiple instances
of an object that is supposed to be a singleton.

## Possible solutions

How can we eliminate these side-by-side versions? Here's some possible ideas:

1. Ideally, we should upgrade `calendar` to a newer version that uses `fancy-button@4.0.0`.
   In our example, `1.0.0` was the latest release, so this means we need to contact the maintainers
   and get them to publish a new release. This can often take days or even months.

2. Force `calendar` to use `fancy-button@4.0.0`. The PNPM package manager provides mechanisms such
   as `.pnpmfile.cjs` that can override the **package.json** file for `calendar` to force it to use
   a different version. This can be a handy shortcut, but it is risky: `calendar` wasn't tested with
   `fancy-button@4.0.0`. If Version 4 includes a breaking change, for example renaming an API,
   then the code will malfunction.

3. Downgrade `video-player` to an older version that uses `fancy-button@3.0.0`. This is a less
   happy solution, since an older release of `video-player` may be missing features that we need.
   We may have to go very far back in time to find a compatible version, or it may be the case
   that there is no such version -- the first release of `video-player` was already using `fancy-button`
   version 4.

It's not always obvious which approach is best. It can require some trial and error.
Our example here involved only four packages (`my-app`, `calendar`, `video-player`, and `fancy-button`),
whereas a typical monorepo has thousands of package dependencies. And side-by-side versions are just one
of many possible version conflicts that can arise among libraries. It does feel like dependency "hell."

However, take heart! With some practice, and some guiding principles, and help from Lockfile Explorer,
you can learn how to solve these problems.

## Is there a shortcut?

Version conflicts arise from a lack of **coherence** in authoring of source code: In our example,
the maintainers of `calendar`, `video-player`, and `fancy-button` work in different Git repositories.
They publish at different times. They probably don't even communicate with each other. When
`fancy-button` releases `4.0.0`, we can't upgrade `my-app` until each intermediary dependency has
upgraded and published a new version. This time lag can be considerable, especially if Version 4
has breaking API changes that require nontrivial work to fix. Lack of coherence creates time lags,
which cause this trouble.

**Shortcut 1: Full coherence** The fully coherent way of working is the **monorepo**:
All your source code goes in a single branch of a single repo. If a breaking change is made to the
API for `fancy-button`, all consumers must be fixed at the time when that change is merged.
The cost of fixing downstream consumers is paid by the person who introduced the break
("you broke it, you fix it"), which avoids creating downstream victims, and ensures costs and effects
are fully analyzed before a prospective change is released. Monorepos work great for a large code base
that's maintained by partner teams within a single organization, but of course it's not a realistic model
for external libraries maintained by different parties on the internet. Nonetheless, if you think about it,
the various mitigations that we'll be presenting are basically approximating a monorepo, by manipulating
your `node_modules` dependencies as if they were part of your own set of projects.

**Shortcut 2: Complete decoupling:** The other escape hatch is to develop fully self-contained libraries,
whose **package.json** files have no dependencies at all. (In fact, this model was enforced by the
Bower package manager that predated NPM.) Unfortunately a complete lack of code sharing brings its
own problems, of duplicated code and reinvented wheels.
