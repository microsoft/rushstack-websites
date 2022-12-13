---
title: Peer dependencies
---

_This hands-on demo uses the `lockfile-explorer-demos` environment.
For setup instructions, read the [Demos repository](./demos_repo.md) article._

## Step 1: A peer dependency

**GitHub checkout branch:** [demo/peer-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-1)

```bash
cd lockfile-explorer-demos

# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/peer-1 remotes/origin/demo/peer-1
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-1/common/images/lfx-demo-peer-1.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-1/common/images/lfx-demo-peer-1.svg"
/></a><br/>

## Step 2: An "unmet" peer dependency

**GitHub checkout branch:** [demo/peer-2](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-2)

```bash
# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/peer-2 remotes/origin/demo/peer-2
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-2/common/images/lfx-demo-peer-2.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-2/common/images/lfx-demo-peer-2.svg"
/></a><br/>

## Step 3: Why do we need peers?

**GitHub checkout branch:** [demo/peer-3](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-3)

```bash
# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/peer-3 remotes/origin/demo/peer-3
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-3/common/images/lfx-demo-peer-3.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-3/common/images/lfx-demo-peer-3.svg"
/></a><br/>

## Step 4: Catching missing peers

**GitHub checkout branch:** [demo/peer-4](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-4)

```bash
# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/peer-4 remotes/origin/demo/peer-4
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-4/common/images/lfx-demo-peer-4.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-4/common/images/lfx-demo-peer-4.svg"
/></a><br/>

## Step 5: A missing peer is sometimes okay

**GitHub checkout branch:** [demo/peer-5](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-5)

```bash
# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/peer-5 remotes/origin/demo/peer-5
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-5/common/images/lfx-demo-peer-5.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/peer-5/common/images/lfx-demo-peer-5.svg"
/></a><br/>
