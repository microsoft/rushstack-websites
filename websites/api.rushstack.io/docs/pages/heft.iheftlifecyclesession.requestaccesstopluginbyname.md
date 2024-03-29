---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/heft](./heft.md) &gt; [IHeftLifecycleSession](./heft.iheftlifecyclesession.md) &gt; [requestAccessToPluginByName](./heft.iheftlifecyclesession.requestaccesstopluginbyname.md)

## IHeftLifecycleSession.requestAccessToPluginByName() method

Set a a callback which will be called if and after the specified plugin has been applied. This can be used to tap hooks on another lifecycle plugin that exists within the same phase.

**Signature:**

```typescript
requestAccessToPluginByName<T extends object>(pluginToAccessPackage: string, pluginToAccessName: string, pluginApply: (pluginAccessor: T) => void): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  pluginToAccessPackage | string |  |
|  pluginToAccessName | string |  |
|  pluginApply | (pluginAccessor: T) =&gt; void |  |

**Returns:**

void

