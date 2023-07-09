---
title: Other config files
---

Besides the configs files defined by Heft itself, a number of tool-specific config files are also
consulted when building a project.

|                                           |                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/config/api-extractor.json**                       |
| **Associated task:**                      | [api-extractor](../plugins/api-extractor.md)                               |
| **Description:**                          | Configures API reports, .d.ts rollups, and generation of API documentation |
| [**Riggable?**](../intro/rig_packages.md) | Yes                                                                        |

|                                           |                                         |
| ----------------------------------------- | --------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/.eslintrc.js** |
| **Associated task:**                      | [eslint](../plugins/eslint.md)          |
| **Description:**                          | Configures lint rules                   |
| [**Riggable?**](../intro/rig_packages.md) | via `"extends"` only                    |

|                                           |                                                    |
| ----------------------------------------- | -------------------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/config/jest.config.json** |
| **Associated task:**                      | [jest](../plugins/jest.md)                         |
| **Description:**                          | Configures how unit tests are run                  |
| [**Riggable?**](../intro/rig_packages.md) | NO via `"preset"` only                             |

|                                           |                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/package.json**                                |
| **Associated task:**                      | N/A                                                                    |
| **Description:**                          | Defines a project, which can optionally be published as an NPM package |
| [**Riggable?**](../intro/rig_packages.md) | N/A                                                                    |

|                                           |                                          |
| ----------------------------------------- | ---------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/tsconfig.json** |
| **Associated task:**                      | [typescript](../plugins/typescript.md)   |
| **Description:**                          | Configures the TypeScript compiler       |
| [**Riggable?**](../intro/rig_packages.md) | via `"extends"` only                     |

|                                           |                                        |
| ----------------------------------------- | -------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/tslint.json** |
| **Associated task:**                      | [tslint](../plugins/tslint.md)         |
| **Description:**                          | Configures lint rules                  |
| [**Riggable?**](../intro/rig_packages.md) | via `"extends"` only                   |

|                                           |                                              |
| ----------------------------------------- | -------------------------------------------- |
| **Supported file path:**                  | **&lt;project folder&gt;/webpack.config.js** |
| **Associated task:**                      | [webpack](../plugins/webpack.md)             |
| **Description:**                          | Configures bundling                          |
| [**Riggable?**](../intro/rig_packages.md) | via `import` only                            |
