---
layout: page
title: api-extractor run
navigation_source: docs_nav
---

<p>&nbsp;</p>

```
usage: api-extractor run [-h] [-c FILE] [-l] [-v] [--diagnostics]
                         [--typescript-compiler-folder PATH]


Invoke API Extractor on a project

Optional arguments:
  -h, --help            Show this help message and exit.
  -c FILE, --config FILE
                        Use the specified api-extractor.json file path,
                        rather than guessing its location
  -l, --local           Indicates that API Extractor is running as part of a
                        local build, e.g. on a developer's machine. This
                        disables certain validation that would normally be
                        performed for a ship/production build. For example,
                        the *.api.md report file is automatically copied in a
                        local build.
  -v, --verbose         Show additional informational messages in the output.
  --diagnostics         Show diagnostic messages used for troubleshooting
                        problems with API Extractor. This flag also enables
                        the "--verbose" flag.
  --typescript-compiler-folder PATH
                        By default API Extractor uses its own TypeScript
                        compiler version to analyze your project. This can
                        often cause compiler errors due to incompatibilities
                        between different TS versions. Use
                        "--typescript-compiler-folder" to specify the folder
                        path for your compiler version.
```
