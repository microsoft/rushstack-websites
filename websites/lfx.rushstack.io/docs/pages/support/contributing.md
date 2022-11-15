---
title: Contributing
---

Lockfile Explorer is developed in the monorepo for the [Rush Stack](@rushstack/) family of projects:

&nbsp;&nbsp;&nbsp;&nbsp; [https://github.com/microsoft/rushstack](https://github.com/microsoft/rushstack)

Contribute to the documentation website in the
[rushstack-websites](https://github.com/microsoft/rushstack-websites/blob/main/websites/lfx.rushstack.io/) monorepo.

For general instructions for building Rush and guidelines for submitting PRs, please read the
[Contributing](@rushstack/pages/contributing/get_started/) documentation for the Rush Stack
monorepo.

The relevant monorepo project folders are:

- [apps/lockfile-explorer](https://github.com/microsoft/rushstack/tree/main/apps/lockfile-explorer)
  - the published NPM package, containing the command-line binary and localhost Node.js service
- [apps/lockfile-explorer-web](https://github.com/microsoft/rushstack/tree/main/apps/lockfile-explorer-web)
  - the React web application project. This NPM package is not published; instead, its bundle is copied
    into the `@rushstack/lockfile-explorer` package.
