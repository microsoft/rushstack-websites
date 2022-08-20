---
title: Getting started
---

## 3 minute demo

Want to see Rush in action? The only prerequisite you need is [NodeJS](https://nodejs.org/en/download/).

**From your shell, install Rush like this:**

```sh
npm install -g @microsoft/rush
```

**For command-line help, do this:**

```sh
rush -h
```

**To see Rush build some real projects, try running these commands:**

```sh
git clone https://github.com/microsoft/rushstack
cd rushstack

# Install the NPM packages:
# (If you don't have a GitHub email configured, add the "--bypass-policy" option.)
rush update

# Incremental install:
rush update  # <-- instantaneous!

# Force all projects to be rebuilt:
rush rebuild

# Incremental build:
rush build    # <-- instantaneous!

# Use "--verbose" to view the console logs for each project as it is built.
# Projects build in parallel processes, but their logs are collated.
rush rebuild --verbose
```

## Let's get started!

Choose your tutorial scenario...

- [I'm a developer.](../../developer/new_developer) Learn how to work in a repo that already uses Rush.
- [I'm a repo maintainer.](../../maintainer/setup_new_repo) Learn how to convert your repo to use the Rush system.
