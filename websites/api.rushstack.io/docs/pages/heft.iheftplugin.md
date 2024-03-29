---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/heft](./heft.md) &gt; [IHeftPlugin](./heft.iheftplugin.md)

## IHeftPlugin interface

The interface used for all Heft plugins.

**Signature:**

```typescript
export interface IHeftPlugin<TSession extends IHeftLifecycleSession | IHeftTaskSession = IHeftLifecycleSession | IHeftTaskSession, TOptions = void> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [accessor?](./heft.iheftplugin.accessor.md) | <code>readonly</code> | object | _(Optional)_ The accessor provided by the plugin. This accessor can be obtained by other plugins within the same phase by calling <code>session.requestAccessToPlugin(...)</code>, and is used by other plugins to interact with hooks or properties provided by the host plugin. |

## Methods

|  Method | Description |
|  --- | --- |
|  [apply(session, heftConfiguration, pluginOptions)](./heft.iheftplugin.apply.md) | Apply the plugin to the session. Plugins are expected to hook into session hooks to provide plugin implementation. The <code>apply(...)</code> method is called once per phase. |

