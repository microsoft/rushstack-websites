---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/heft](./heft.md) &gt; [IHeftTaskRunIncrementalHookOptions](./heft.ihefttaskrunincrementalhookoptions.md) &gt; [watchGlobAsync](./heft.ihefttaskrunincrementalhookoptions.watchglobasync.md)

## IHeftTaskRunIncrementalHookOptions.watchGlobAsync property

Reads the specified globs and returns the result, filtering out files that have not changed since the last execution. All file system calls while reading the glob are tracked and will be watched for changes.

If a change to the monitored files is detected, the task will be scheduled for re-execution.

**Signature:**

```typescript
readonly watchGlobAsync: WatchGlobFn;
```
