---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/heft](./heft.md) &gt; [IScopedLogger](./heft.iscopedlogger.md)

## IScopedLogger interface

A logger which is used to emit errors and warnings to the console, as well as to write to the console. Messaged emitted by the scoped logger are prefixed with the name of the scoped logger.

**Signature:**

```typescript
export interface IScopedLogger 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [hasErrors](./heft.iscopedlogger.haserrors.md) | <code>readonly</code> | boolean | Indicates if the logger has emitted any errors. |
|  [loggerName](./heft.iscopedlogger.loggername.md) | <code>readonly</code> | string | The name of the scoped logger. Logging messages will be prefixed with this name. |
|  [terminal](./heft.iscopedlogger.terminal.md) | <code>readonly</code> | [ITerminal](./node-core-library.iterminal.md) | The terminal used to write messages to the console. |

## Methods

|  Method | Description |
|  --- | --- |
|  [emitError(error)](./heft.iscopedlogger.emiterror.md) | Call this function to emit an error to the heft runtime. |
|  [emitWarning(warning)](./heft.iscopedlogger.emitwarning.md) | Call this function to emit an warning to the heft runtime. |
|  [resetErrorsAndWarnings()](./heft.iscopedlogger.reseterrorsandwarnings.md) | Reset the errors and warnings for this scoped logger. |

