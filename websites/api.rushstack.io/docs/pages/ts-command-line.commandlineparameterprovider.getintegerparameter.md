---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/ts-command-line](./ts-command-line.md) &gt; [CommandLineParameterProvider](./ts-command-line.commandlineparameterprovider.md) &gt; [getIntegerParameter](./ts-command-line.commandlineparameterprovider.getintegerparameter.md)

## CommandLineParameterProvider.getIntegerParameter() method

Returns the CommandLineIntegerParameter with the specified long name.

**Signature:**

```typescript
getIntegerParameter(parameterLongName: string, parameterScope?: string): CommandLineIntegerParameter;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  parameterLongName | string |  |
|  parameterScope | string | _(Optional)_ |

**Returns:**

[CommandLineIntegerParameter](./ts-command-line.commandlineintegerparameter.md)

## Remarks

This method throws an exception if the parameter is not defined.

