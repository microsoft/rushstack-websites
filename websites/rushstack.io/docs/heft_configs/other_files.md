---
layout: page
title: Other config files
navigation_source: docs_nav
---

Besides the configs files defined by Heft itself, a number of tool-specific config files are also
consulted when building a project.

| **Supported file path:** | **&lt;project folder&gt;/config/api-extractor.json** |
| **Associated task:** | [api-extractor]({% link pages/heft_tasks/api-extractor.md %}) |
| **Description:** | Configures API reports, .d.ts rollups, and generation of API documentation |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  | Yes |

| **Supported file path:** | **&lt;project folder&gt;/.eslintrc.js** |
| **Associated task:** | [eslint]({% link pages/heft_tasks/eslint.md %}) |
| **Description:** | Configures lint rules |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  | via `"extends"` only |

| **Supported file path:** | **&lt;project folder&gt;/config/jest.config.json** |
| **Associated task:** | [jest]({% link pages/heft_tasks/jest.md %}) |
| **Description:** | Configures how unit tests are run |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  | NO via `"preset"` only |

| **Supported file path:** | **&lt;project folder&gt;/package.json** |
| **Associated task:** | N/A |
| **Description:** | Defines a project, which can optionally be published as an NPM package |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  | N/A |

| **Supported file path:** | **&lt;project folder&gt;/tsconfig.json** |
| **Associated task:** | [typescript]({% link pages/heft_tasks/typescript.md %}) |
| **Description:** | Configures the TypeScript compiler |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  | via `"extends"` only |

| **Supported file path:** | **&lt;project folder&gt;/tslint.json** |
| **Associated task:** | [tslint]({% link pages/heft_tasks/tslint.md %}) |
| **Description:** | Configures lint rules |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  |  via `"extends"` only |

| **Supported file path:** | **&lt;project folder&gt;/webpack.config.js** |
| **Associated task:** | [webpack]({% link pages/heft_tasks/webpack.md %}) |
| **Description:** | Configures bundling |
| [**Riggable?**]({% link pages/heft/rig_packages.md %})  | via `import` only |

