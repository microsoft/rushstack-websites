---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/heft](./heft.md) &gt; [CancellationToken](./heft.cancellationtoken.md)

## CancellationToken class

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

A cancellation token. Can be used to signal that an ongoing process has either been cancelled or timed out.

**Signature:**

```typescript
export declare class CancellationToken 
```

## Remarks

This class will eventually be removed once the `AbortSignal` API is available in the lowest supported LTS version of Node.js. See here for more information: https://nodejs.org/docs/latest-v16.x/api/globals.html\#class-abortsignal

The constructor for this class is marked as internal. Third-party code should not call the constructor directly or create subclasses that extend the `CancellationToken` class.

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [isCancelled](./heft.cancellationtoken.iscancelled.md) | <code>readonly</code> | boolean | **_(BETA)_** Whether or not the token has been cancelled. |
|  [onCancelledPromise](./heft.cancellationtoken.oncancelledpromise.md) | <code>readonly</code> | Promise&lt;void&gt; | **_(BETA)_** Obtain a promise that resolves when the token is cancelled. |

