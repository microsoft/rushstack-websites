---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/module-minifier-plugin](./module-minifier-plugin.md) &gt; [MODULE\_WRAPPER\_PREFIX](./module-minifier-plugin.module_wrapper_prefix.md)

## MODULE\_WRAPPER\_PREFIX variable

Prefix to wrap `function (module, __webpack_exports__, __webpack_require__) { ... }` so that the minifier doesn't delete it. Public because alternate Minifier implementations may wish to know about it.

<b>Signature:</b>

```typescript
MODULE_WRAPPER_PREFIX: '__MINIFY_MODULE__('
```