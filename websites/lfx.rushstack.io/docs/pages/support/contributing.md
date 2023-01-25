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

## Building Lockfile Explorer in "watch mode"

If you're contributing a feature or fix for Lockfile Explorer, it's convenient to build these two projects in
"watch mode". This way, whenever you save a change to a source file, the affected project will automatically
rebuild itself, and restart the Node.js service and/or reload the web browser.

Before you get started:

```bash
cd rushstack

# Install NPM packages
rush install

# Build all the dependency projects
rush build --to-except lockfile-explorer --to-except lockfile-explorer-web
```

Starting watch mode for the server:

```bash
cd apps/lockfile-explorer
rushx start
```

Starting watch mode for the client app:

```bash
cd apps/lockfile-explorer-web
rushx start
```

## Final testing by installing locally

When you're ready to create your PR, it's a good idea to build a full production release and try
installing it locally:

```
cd rushstack

# Install NPM packages
rush install

# Make a production build of the published NPM package
rush build --to lockfile-explorer --production

cd apps/lockfile-explorer

# Create a publishable tarball such as "rushstack-lockfile-explorer-1.2.3.tgz"
# This command is similar to "npm pack" or "pnpm pack", but for a Rush workspace:
rush-pnpm pack

# Try globally installing the tarball on your local machine
npm install -g rushstack-lockfile-explorer-1.2.3.tgz

# When you run the "lockfile-explorer" shell command, it should now launch your
# locally built package
```
