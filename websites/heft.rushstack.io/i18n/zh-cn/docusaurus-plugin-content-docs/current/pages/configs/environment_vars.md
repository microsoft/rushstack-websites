---
title: Environment variables
---

Heft's behavior can be customized using the shell environment variables described below:

## HEFT_JEST_DETECT_OPEN_HANDLES

This environment variable provides an alternate method for specifying the
`--detect-open-handles` parameter for `@rushstack/heft-jest-plugin`.

## HEFT_JEST_DISABLE_CODE_COVERAGE

This environment variable provides an alternate method for specifying the
`--disable-code-coverage` parameter for `@rushstack/heft-jest-plugin`.

## HEFT_JEST_MAX_WORKERS

This environment variable provides an alternate method for specifying the
`--max-workers` parameter for `@rushstack/heft-jest-plugin`.

## HEFT_JEST_TEST_TIMEOUT_MS

This environment variable provides an alternate method for specifying the
`--test-timeout-ms` parameter for `@rushstack/heft-jest-plugin`.

## RUSHSTACK_FILE_ERROR_BASE_FOLDER

Controls how source file paths are displayed when printing diagnostic messages such as errors or warnings.

Possible values:

- **_(an absolute path)_**: the printed path will be relative to the specified absolute path
- `{PROJECT_FOLDER}`: a special token indicating that the printed path will be relative to the project folder (that contains **package.json**)
- `{ABSOLUTE_PATH}`: a special token indicating that the printed path should be an absolute path

The default value is `{PROJECT_FOLDER}`, however when Rush invokes commands such as Heft, it sets `RUSHSTACK_FILE_ERROR_BASE_FOLDER` to be the path of the root folder that contains **rush.json**.

> NOTE: The `RUSHSTACK_FILE_ERROR_BASE_FOLDER` functionality is implemented by the general-purpose [FileError](https://api.rushstack.io/pages/node-core-library.fileerror/) API from `@rushstack/node-core-library`.

## WEBPACK_DEV_SERVER

By default `@rushstack/heft-webpack4-plugin` and `@rushstack/heft-webpack5-plugin` look for an NPM package called `webpack-dev-server` when launching Webpack. Use the `WEBPACK_DEV_SERVER` environment to configure a different NPM package name, such as a private fork of this package.
