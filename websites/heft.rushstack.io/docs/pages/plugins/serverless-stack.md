---
title: Serverless Stack plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-serverless-stack-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-serverless-stack-plugin) |
| **Plugin name:** | [serverless-stack-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-serverless-stack-plugin/heft-plugin.json) implemented by [ServerlessStackPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-serverless-stack-plugin/src/ServerlessStackPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | (none) |
<!-- prettier-ignore-end -->

This is a Heft plugin for building apps using the [Serverless Stack (SST)](https://serverless-stack.com/) framework.
With this approach, the [SST toolchain](https://docs.serverless-stack.com/packages/cli) is only used for
synthesizing CloudFormation stacks and deploying the app, and Heft takes over the role of compiling, linting,
testing your TypeScript project.

## When to use it

If your lambda service was built using the Serverless Stack framework.

## How it works

The plugin has no effect without the `--sst` parameter. When the parameter is provided:

- `heft build --sst` will behave similar to `sst build`, which synthesizes CloudFormation stacks
  in the `build/cdk.out/` directory. See [this documentation](https://docs.serverless-stack.com/packages/cli#build)
  for details. Heft's `build-watch` mode is also supported.

- `heft start --sst` will behave similar to `sst start`, which deploys a
  [stub lambda](https://docs.serverless-stack.com/live-lambda-development#sst-start) to AWS
  and then launches the WebSocket client locally for debugging. See
  [this documentation](https://docs.serverless-stack.com/packages/cli#start) for details.

> Note that `heft build --sst` currently requires AWS credentials, which limits the ability to perform this
> validation in a monorepo environment where we can't assume that every developer works on AWS.
> Issue [serverless-stack#1537](https://github.com/serverless-stack/serverless-stack/issues/1537)
> is tracking a possible improvement.

## Configuration

The [heft-serverless-stack-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-serverless-stack-tutorial)
sample folder illustrates a complete project setup.

## CLI parameters

[heft-serverless-stack-plugin/heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-serverless-stack-plugin/heft-plugin.json) defines these parameters:

```
  --sst
                        Invokes the SST postprocessing. Requires AWS credentials.
  --sst-stage STAGE_NAME
                        Specifies the Serverless Stack stage; equivalent to
                        to the "--stage" parameter from the "sst" CLI
```
