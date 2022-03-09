---
title: NPM doppelgangers
---

_This article continues the discussion from the "[Phantom dependencies](../../advanced/phantom_deps)" section. It's recommended to read that first._

## How NPM doppelgangers arise

<img src="/images/home/card-doppel.svg" style={{ float: "right", paddingLeft: "30px" }} alt="NPM doppelganger" />

Sometimes the **node_modules** data structure is forced to install two copies
of **_the same version of_** the same package. Really? How can that happen?

Suppose we have a main project **A** like this:

```json
{
  "name": "library-a",
  "version": "1.0.0",
  "dependencies": {
    "library-b": "^1.0.0",
    "library-c": "^1.0.0",
    "library-d": "^1.0.0",
    "library-e": "^1.0.0"
  }
}
```

And then **B** and **C** both depend on **F1**:

```json
{
  "name": "library-b",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^1.0.0"
  }
}
```

```json
{
  "name": "library-c",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^1.0.0"
  }
}
```

But **D** and **E** depend on **F2**:

```json
{
  "name": "library-d",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^2.0.0"
  }
}
```

```json
{
  "name": "library-e",
  "version": "1.0.0",
  "dependencies": {
    "library-f": "^2.0.0"
  }
}
```

The **node_modules** tree can share **F1** by putting it at the top of the tree,
but then **F2** has to be duplicated in subfolders:

```
- library-a/
  - package.json
  - node_modules/
    - library-b/
      - package.json
    - library-c/
      - package.json
    - library-d/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@2.0.0
    - library-e/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@2.0.0
    - library-f/
      - package.json  <-- library-f@1.0.0
```

Alternatively, the package manager could choose to put **F2** at the top,
but then **F1** gets duplicated:

```
- library-a/
  - package.json
  - node_modules/
    - library-b/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@1.0.0
    - library-c/
      - package.json
      - node_modules/
        - library-f/
          - package.json  <-- library-f@1.0.0
    - library-d/
      - package.json
    - library-e/
      - package.json
    - library-f/
      - package.json  <-- library-f@2.0.0
```

Either way, we cannot arrange the tree without having two copies of the same version
of **library-f**. We call these "doppelgangers". Traditional package managers from
other programming languages don't encounter this issue; it's a peculiar aspect of
NPM's **node_modules** tree. It is inherent in the design and unavoidable.

## Consequences of doppelgangers

Small projects rarely encounter doppelgangers, but they are fairly common in a large
scale monorepo. Here's some potential problems that can result:

- **Slower installs:** Disk space isn't too expensive these days, but imagine
  you have 20 libraries that depend on **F1**, leading to 20 duplicated copies.
  Or suppose there's a post-install script that downloads and unzips large archive
  (e.g. PhantomJS) and this happens separately for each doppelganger. That could
  impact your install time significantly.

- **Exploding bundle sizes:** Web projects commonly use a bundler such as
  [webpack](https://webpack.js.org/) that statically analyzes `require()` statements
  and collects code into a single bundle file for deployment. This file should be kept as small as
  possible, because it directly affects the load time for your web application.
  When a doppelganger appears unexpectedly (e.g. due to an `npm install` operation that
  rebalances the **node_modules** tree), this can cause two copies of a library to be embedded
  in a bundle, greatly increasing its size.

- **Non-single singletons:** Suppose **library-f** has an API which exposes a cache object
  that is intended to be a singleton instance shared by all consumers of the library.
  When two different components call `require("library-f")` they may get two different
  library instantiations, which means there will suddenly be two instances of the singleton
  (i.e. the underlying "global" variable gets allocated in two different closures).
  This can lead to very strange behavior that is difficult to debug.

- **Duplicate types:** Suppose **library-f** is a TypeScript library. The compiler will
  encounter duplicate copies of all the \*.d.ts files for that library. For example,
  each class will have two copies of its declaration, which cannot be deduplicated by
  following symlink targets, since they are separate physical files. In general identical
  class declarations are not considered interchangeable by TypeScript and will cause
  compile errors when mixed. Typescript 2.x introduced a heuristic for detecting and
  equating these duplicates, but it involves additional complexity and processing.
  Other build tasks may not be so sophisticated.

- **Semantically different doppelgangers:** Suppose **F** has a dependency **G** that
  is also consumed by other packages in the tree. In the tree, the first copy of **F1**
  starts its search for **G** under **B**, whereas the second copy of **F1**
  starts under **C**. The `require()` algorithm can find different versions of **G**
  from these two starting points. This means the runtime behavior of the two **F1**
  instances may be different. Or at compile time, if **F** exports a TypeScript class
  that inherits from a base class defined in **G**, we can end up with differing type
  signatures **_for the same class from the same version of the same package_**. This can
  lead to highly confusing compiler errors.

**How Rush helps:** Rush's symlinking strategy eliminates doppelgangers only for dependencies
that are local projects in the monorepo. If you're using NPM or Yarn as your package manager,
unfortunately doppelgangers are still possible for any indirect dependencies. Whereas if you
use PNPM with Rush, the doppelganger problem is fully solved (because PNPM's installation model
accurately simulates a true directed acyclic graph).
