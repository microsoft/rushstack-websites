---
layout: page
title: rush purge
navigation_source: docs_nav
---

```
usage: rush purge [-h] [--unsafe]

The "rush purge" command is used to delete temporary files created by Rush.
This is useful if you are having problems and suspect that cache files may be
corrupt.

Optional arguments:
  -h, --help  Show this help message and exit.
  --unsafe    (UNSAFE!) Also delete shared files such as the package manager
              instances stored in the ".rush" folder in the user's home
              directory. This is a more aggressive fix that is NOT SAFE to
              run in a live environment because it will cause other
              concurrent Rush processes to fail.
```
