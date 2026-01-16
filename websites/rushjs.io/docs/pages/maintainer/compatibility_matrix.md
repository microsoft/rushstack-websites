---
title: Compatibility matrix
---

## "Supported" ranges

| Rush version | Node.js version                             | PNPM version             | Git version |
| ------------ | ------------------------------------------- | ------------------------ | ----------- |
| `5.122.0`    | `^16.20.0` <br/> `^18.18.0` <br/> `^20.9.0` | `^7.33.5` <br/> `^8.7.6` | `^2.26.3`   |

## Associated source code constants

| Variable                             | Current Value | Source file                                                                                                                    | Description                                                                                                                                                                                     |
| ------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MINIMUM_SUPPORTED_NPM_VERSION`      | `'4.5.0'`     | [SetupChecks.ts](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/logic/SetupChecks.ts)                 | Rush fails if the NPM versions older than this version                                                                                                                                          |
| `MINIMUM_SUPPORTED_PNPM_VERSION`     | `'5.0.0'`     | [SetupChecks.ts](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/logic/SetupChecks.ts)                 | Rush fails if the PNPM versions older than this version                                                                                                                                         |
| `UPCOMING_NODE_LTS_VERSION`          | `20`          | [NodeJsCompatibility.ts](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/logic/NodeJsCompatibility.ts) | This constant is the major version of the next LTS node Node.js release.                                                                                                                        |
| `reportAncientIncompatibleVersion()` | `'<14.18.0'`  | [NodeJsCompatibility.ts](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/logic/NodeJsCompatibility.ts) | Used to report when the Node.js version is known to have serious incompatibilities. In that situation, the user should downgrade Rush to an older release that supported their Node.js version. |

## Node.js CI validation

Rush Stack's continuous integration currently builds:

[rushstack/.github/workflows/ci.yml](https://github.com/microsoft/rushstack/blob/main/.github/workflows/ci.yml)

```yaml
matrix:
  include:
    - NodeVersion: 16.20.x
      NodeVersionDisplayName: 16
      OS: ubuntu-latest
    - NodeVersion: 18.18.x
      NodeVersionDisplayName: 18
      OS: ubuntu-latest
    - NodeVersion: 20.9.x
      NodeVersionDisplayName: 20
      OS: ubuntu-latest
    - NodeVersion: 18.18.x
      NodeVersionDisplayName: 18
      OS: windows-latest
```
