---
title: '@rushstack/heft-config-file'
---

[@rushstack/heft-config-file](https://github.com/microsoft/rushstack/tree/main/libraries/heft-config-file)
库是用于加载 Heft 的配置文件的标准引擎。它提供了许多功能，如：

- JSON 架构验证
- 具有直观错误消息的 `"extends"` 继承
- 支持 [rig package](../intro/rig_packages.md) 解析
- 四种不同的 `"extends"` 继承类型（append，merge，replace，computed）与预设的默认值
- 属性继承指令以自定义它们

## 属性继承指令

在使用 `"extends"` 继承时，Heft 配置文件通常对每个 JSON 字段预配置了直观的默认策略。（对于一个真实世界的例子，看一看 `propertyInheritance` 字段在 [JestPlugin.ts](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/heft-plugins/heft-jest-plugin/src/JestPlugin.ts#L675) 中的使用。）

如果你需要为某个特定设置使用不同的继承类型，你可以向你的 JSON 文件添加**属性继承指令**。例如，假设我们正在扩展一个具有预定义 `exampleObject` 值的假设文件，该值是一个带键的对象，以及一个 `exampleArray` 值，该值是一个数组对象：

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/example-config-file.schema.json",
  "extends": "base-project/config/example-config-file.json",

  "$exampleObject.inheritanceType": "merge", // valid choices are: "merge", "replace"
  "exampleObject": {
    "$exampleObjectMember.inheritanceType": "merge", // valid choices are: "merge", "replace"
    "exampleObjectMember": { ... },

    "$exampleArrayMember.inheritanceType": "append", // valid choices are: "append", "replace"
    "exampleArrayMember": [ ... ]
  },

  "$exampleArray.inheritanceType": "replace", // valid choices are: "append", "replace"
  "exampleArray": [ ... ]
}
```

一旦对象被设置为 override 的 `inheritanceType`，所有子属性 `inheritanceType` 的值将被忽略，因为最顶层的对象已经覆盖了所有子属性。

需要注意的一点是，键对象和数组使用了不同的逻辑。这是为了明确指出，数组将被按原样追加，合并过程中不会进行任何额外的处理（例如，如果数组应该是一个集，那么不会进行去重）。如果需要这样的行为，可以在实现端完成。在 `@rushstack/heft-config-file` 包中去重数组并不完全有意义，因为非原始对象的数组的去重并没有易于定义的方式。
