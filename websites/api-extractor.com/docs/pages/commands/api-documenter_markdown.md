---
layout: page
title: api-documenter markdown
navigation_source: docs_nav
---

<p>&nbsp;</p>

```
usage: api-documenter markdown [-h] [-i FOLDER1] [-o FOLDER2]

Generates API documentation as a collection of files in Markdown format,
suitable for example for publishing on a GitHub site.

Optional arguments:
  -h, --help            Show this help message and exit.
  -i FOLDER1, --input-folder FOLDER1
                        Specifies the input folder containing the *.api.json
                        files to be processed. If omitted, the default is ".
                        /input"
  -o FOLDER2, --output-folder FOLDER2
                        Specifies the output folder where the documentation
                        will be written. ANY EXISTING CONTENTS WILL BE
                        DELETED! If omitted, the default is "./markdown"
```
