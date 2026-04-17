---
title: monodex crawl
---

```
Crawl source and index into Qdrant (incremental sync). Reports warnings when AST chunking fails and fallback is used. These warnings indicate partitioner defects to investigate


Usage: monodex crawl [OPTIONS] --label <LABEL> <--commit <COMMIT>|--working-dir>


Options:
      --catalog <CATALOG>     Catalog name (from config file, uses default context if not provided)
      --debug                 Enable verbose debug logging for network requests and other operations
      --label <LABEL>         Label name for this crawl (e.g., "main", "feature-x", "local") REQUIRED: Must be explicitly specified to avoid accidental overwrites. Label ID will be computed as <catalog>:<label>
      --commit <COMMIT>       Git commit to crawl (branch name, tag, or commit SHA)
      --working-dir           Crawl the working directory instead of a Git commit. Indexes uncommitted changes
      --incremental-warnings  Allow files with chunking warnings to participate in incremental skipping
  -h, --help                  Print help
```
