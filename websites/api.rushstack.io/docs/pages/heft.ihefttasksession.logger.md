---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/heft](./heft.md) &gt; [IHeftTaskSession](./heft.ihefttasksession.md) &gt; [logger](./heft.ihefttasksession.logger.md)

## IHeftTaskSession.logger property

The scoped logger for the task. Messages logged with this logger will be prefixed with the phase and task name, in the format `[<phaseName>:<taskName>]`. It is highly recommended that writing to the console be performed via the logger, as it will ensure that logging messages are labeled with the source of the message.

**Signature:**

```typescript
readonly logger: IScopedLogger;
```
