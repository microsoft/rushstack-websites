---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/terminal](./terminal.md) &gt; [INormalizeNewlinesTextRewriterOptions](./terminal.inormalizenewlinestextrewriteroptions.md)

## INormalizeNewlinesTextRewriterOptions interface

Constructor options for [NormalizeNewlinesTextRewriter](./terminal.normalizenewlinestextrewriter.md)

**Signature:**

```typescript
export interface INormalizeNewlinesTextRewriterOptions 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [ensureNewlineAtEnd?](./terminal.inormalizenewlinestextrewriteroptions.ensurenewlineatend.md) |  | boolean | _(Optional)_ If <code>true</code>, then <code>NormalizeNewlinesTextRewriter.close()</code> will append a newline to the output if it ends with an incomplete line. |
|  [newlineKind](./terminal.inormalizenewlinestextrewriteroptions.newlinekind.md) |  | [NewlineKind](./node-core-library.newlinekind.md) | Specifies how newlines should be represented in the output stream. |

