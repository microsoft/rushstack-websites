---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/node-core-library](./node-core-library.md) &gt; [IExecutableSpawnOptions](./node-core-library.iexecutablespawnoptions.md)

## IExecutableSpawnOptions interface

Options for [Executable.spawn()](./node-core-library.executable.spawn.md)

**Signature:**

```typescript
export interface IExecutableSpawnOptions extends IExecutableResolveOptions 
```
**Extends:** [IExecutableResolveOptions](./node-core-library.iexecutableresolveoptions.md)

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [stdio?](./node-core-library.iexecutablespawnoptions.stdio.md) |  | [ExecutableStdioMapping](./node-core-library.executablestdiomapping.md) | <p>_(Optional)_ The stdio mappings for the child process.</p><p>NOTE: If IExecutableSpawnSyncOptions.input is provided, it will take precedence over the stdin mapping (stdio\[0\]).</p> |

