---
title: Other config files
---

Besides the configs files defined by Heft itself, a number of tool-specific config files are also
consulted when building a project.

| **Supported file path:** | **&lt;project folder&gt;/config/api-extractor.json** |
| **Associated task:** | [api-extractor](/heft_tasks/api-extractor) |
| **Description:** | Configures API reports, .d.ts rollups, and generation of API documentation |
| [**Riggable?**](/heft/rig_packages)  | Yes |

| **Supported file path:** | **&lt;project folder&gt;/.eslintrc.js** |
| **Associated task:** | [eslint](/heft_tasks/eslint) |
| **Description:** | Configures lint rules |
| [**Riggable?**](/heft/rig_packages)  | via `"extends"` only |

| **Supported file path:** | **&lt;project folder&gt;/config/jest.config.json** |
| **Associated task:** | [jest](/heft_tasks/jest) |
| **Description:** | Configures how unit tests are run |
| [**Riggable?**](/heft/rig_packages)  | NO via `"preset"` only |

| **Supported file path:** | **&lt;project folder&gt;/package.json** |
| **Associated task:** | N/A |
| **Description:** | Defines a project, which can optionally be published as an NPM package |
| [**Riggable?**](/heft/rig_packages)  | N/A |

| **Supported file path:** | **&lt;project folder&gt;/tsconfig.json** |
| **Associated task:** | [typescript](/heft_tasks/typescript) |
| **Description:** | Configures the TypeScript compiler |
| [**Riggable?**](/heft/rig_packages)  | via `"extends"` only |

| **Supported file path:** | **&lt;project folder&gt;/tslint.json** |
| **Associated task:** | [tslint](/heft_tasks/tslint) |
| **Description:** | Configures lint rules |
| [**Riggable?**](/heft/rig_packages)  |  via `"extends"` only |

| **Supported file path:** | **&lt;project folder&gt;/webpack.config.js** |
| **Associated task:** | [webpack](/heft_tasks/webpack) |
| **Description:** | Configures bundling |
| [**Riggable?**](/heft/rig_packages)  | via `import` only |
