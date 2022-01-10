---
layout: page
title: rush update-cloud-credentials (experimental)
navigation_source: docs_nav
---

```
usage: rush update-cloud-credentials [-h] [-i]
                                     [--credential CREDENTIAL_STRING] [-d]


(EXPERIMENTAL) If the build caching feature is configured, this command
facilitates updating the credentials used by a cloud-based provider.

Optional arguments:
  -h, --help            Show this help message and exit.
  -i, --interactive     Run the credential update operation in interactive
                        mode, if supported by the provider.
  --credential CREDENTIAL_STRING
                        A static credential, to be cached.
  -d, --delete          If specified, delete stored credentials.
```

## See also

- [Enabling the build cache]({% link pages/maintainer/build_cache.md %})
