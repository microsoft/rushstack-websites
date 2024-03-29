---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/api-extractor-model](./api-extractor-model.md) &gt; [ApiItemContainerMixin](./api-extractor-model.apiitemcontainermixin.md) &gt; [findMembersWithInheritance](./api-extractor-model.apiitemcontainermixin.findmemberswithinheritance.md)

## ApiItemContainerMixin.findMembersWithInheritance() method

Finds all of the ApiItem's immediate and inherited members by walking up the inheritance tree.

**Signature:**

```typescript
findMembersWithInheritance(): IFindApiItemsResult;
```
**Returns:**

[IFindApiItemsResult](./api-extractor-model.ifindapiitemsresult.md)

## Remarks

Given the following class heritage:

```
export class A {
  public a: number|boolean;
}

export class B extends A {
  public a: number;
  public b: string;
}

export class C extends B {
  public c: boolean;
}
```
Calling `findMembersWithInheritance` on `C` will return `B.a`<></>, `B.b`<></>, and `C.c`<></>. Calling the method on `B` will return `B.a` and `B.b`<></>. And calling the method on `A` will return just `A.a`<></>.

The inherited members returned by this method may be incomplete. If so, there will be a flag on the result object indicating this as well as messages explaining the errors in more detail. Some scenarios include:

- Interface extending from a type alias.

- Class extending from a variable.

- Extending from a declaration not present in the model (e.g. external package).

- Extending from an unexported declaration (e.g. ae-forgotten-export). Common in mixin patterns.

- Unexpected runtime errors...

Lastly, be aware that the types of inherited members are returned with respect to their defining class as opposed to with respect to the inheriting class. For example, consider the following:

```
export class A<T> {
  public a: T;
}

export class B extends A<number> {}
```
When called on `B`<></>, this method will return `B.a` with type `T` as opposed to type `number`<></>, although the latter is more accurate.

