---
layout: page
title: api-documenter yaml
navigation_source: docs_nav
---

<p>&nbsp;</p>

```
usage: api-documenter yaml [-h] [-i FOLDER1] [-o FOLDER2] [--office]

Generates API documentation as a collection of files conforming to the
universal reference YAML format, which is used by the docs.microsoft.com
pipeline.

Optional arguments:
  -h, --help            Show this help message and exit.
  -i FOLDER1, --input-folder FOLDER1
                        Specifies the input folder containing the *.api.json
                        files to be processed. If omitted, the default is ".
                        /input"
  -o FOLDER2, --output-folder FOLDER2
                        Specifies the output folder where the documentation
                        will be written. ANY EXISTING CONTENTS WILL BE
                        DELETED! If omitted, the default is "./yaml"
  --office              Enables some additional features specific to Office
                        Add-ins
```
