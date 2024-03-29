---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/ts-command-line](./ts-command-line.md) &gt; [CommandLineParameterProvider](./ts-command-line.commandlineparameterprovider.md) &gt; [getChoiceListParameter](./ts-command-line.commandlineparameterprovider.getchoicelistparameter.md)

## CommandLineParameterProvider.getChoiceListParameter() method

Returns the CommandLineChoiceListParameter with the specified long name.

**Signature:**

```typescript
getChoiceListParameter(parameterLongName: string, parameterScope?: string): CommandLineChoiceListParameter;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  parameterLongName | string |  |
|  parameterScope | string | _(Optional)_ |

**Returns:**

[CommandLineChoiceListParameter](./ts-command-line.commandlinechoicelistparameter.md)

## Remarks

This method throws an exception if the parameter is not defined.

