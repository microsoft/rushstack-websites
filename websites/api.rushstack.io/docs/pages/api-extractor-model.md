---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/api-extractor-model](./api-extractor-model.md)

## api-extractor-model package

Use this library to read and write \*.api.json files as defined by the [API Extractor](https://api-extractor.com/) tool. These files are used to generate a documentation website for your TypeScript package. The files store the API signatures and doc comments that were extracted from your package.

## Classes

|  Class | Description |
|  --- | --- |
|  [ApiCallSignature](./api-extractor-model.apicallsignature.md) | Represents a TypeScript function call signature. |
|  [ApiClass](./api-extractor-model.apiclass.md) | Represents a TypeScript class declaration. |
|  [ApiConstructor](./api-extractor-model.apiconstructor.md) | Represents a TypeScript class constructor declaration that belongs to an <code>ApiClass</code>. |
|  [ApiConstructSignature](./api-extractor-model.apiconstructsignature.md) | Represents a TypeScript construct signature that belongs to an <code>ApiInterface</code>. |
|  [ApiDeclaredItem](./api-extractor-model.apideclareditem.md) | The base class for API items that have an associated source code excerpt containing a TypeScript declaration. |
|  [ApiDocumentedItem](./api-extractor-model.apidocumenteditem.md) | An abstract base class for API declarations that can have an associated TSDoc comment. |
|  [ApiEntryPoint](./api-extractor-model.apientrypoint.md) | Represents the entry point for an NPM package. |
|  [ApiEnum](./api-extractor-model.apienum.md) | Represents a TypeScript enum declaration. |
|  [ApiEnumMember](./api-extractor-model.apienummember.md) | Represents a member of a TypeScript enum declaration. |
|  [ApiFunction](./api-extractor-model.apifunction.md) | Represents a TypeScript function declaration. |
|  [ApiIndexSignature](./api-extractor-model.apiindexsignature.md) | Represents a TypeScript index signature. |
|  [ApiInterface](./api-extractor-model.apiinterface.md) | Represents a TypeScript class declaration. |
|  [ApiItem](./api-extractor-model.apiitem.md) | The abstract base class for all members of an <code>ApiModel</code> object. |
|  [ApiMethod](./api-extractor-model.apimethod.md) | Represents a TypeScript member function declaration that belongs to an <code>ApiClass</code>. |
|  [ApiMethodSignature](./api-extractor-model.apimethodsignature.md) | Represents a TypeScript member function declaration that belongs to an <code>ApiInterface</code>. |
|  [ApiModel](./api-extractor-model.apimodel.md) | A serializable representation of a collection of API declarations. |
|  [ApiNamespace](./api-extractor-model.apinamespace.md) | Represents a TypeScript namespace declaration. |
|  [ApiPackage](./api-extractor-model.apipackage.md) | Represents an NPM package containing API declarations. |
|  [ApiProperty](./api-extractor-model.apiproperty.md) | Represents a TypeScript property declaration that belongs to an <code>ApiClass</code>. |
|  [ApiPropertyItem](./api-extractor-model.apipropertyitem.md) | The abstract base class for [ApiProperty](./api-extractor-model.apiproperty.md) and [ApiPropertySignature](./api-extractor-model.apipropertysignature.md)<></>. |
|  [ApiPropertySignature](./api-extractor-model.apipropertysignature.md) | Represents a TypeScript property declaration that belongs to an <code>ApiInterface</code>. |
|  [ApiTypeAlias](./api-extractor-model.apitypealias.md) | Represents a TypeScript type alias declaration. |
|  [ApiVariable](./api-extractor-model.apivariable.md) | Represents a TypeScript variable declaration. |
|  [Excerpt](./api-extractor-model.excerpt.md) | The <code>Excerpt</code> class is used by [ApiDeclaredItem](./api-extractor-model.apideclareditem.md) to represent a TypeScript code fragment that may be annotated with hyperlinks to declared types (and in the future, source code locations). |
|  [ExcerptToken](./api-extractor-model.excerpttoken.md) | Represents a fragment of text belonging to an [Excerpt](./api-extractor-model.excerpt.md) object. |
|  [HeritageType](./api-extractor-model.heritagetype.md) | Represents a type referenced via an "extends" or "implements" heritage clause for a TypeScript class or interface. |
|  [Parameter](./api-extractor-model.parameter.md) | Represents a named parameter for a function-like declaration. |
|  [SourceLocation](./api-extractor-model.sourcelocation.md) | The source location where a given API item is declared. |
|  [TypeParameter](./api-extractor-model.typeparameter.md) | Represents a named type parameter for a generic declaration. |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [ApiItemKind](./api-extractor-model.apiitemkind.md) | The type returned by the [ApiItem.kind](./api-extractor-model.apiitem.kind.md) property, which can be used to easily distinguish subclasses of [ApiItem](./api-extractor-model.apiitem.md)<></>. |
|  [EnumMemberOrder](./api-extractor-model.enummemberorder.md) | Options for customizing the sort order of [ApiEnum](./api-extractor-model.apienum.md) members. |
|  [ExcerptTokenKind](./api-extractor-model.excerpttokenkind.md) |  |
|  [FindApiItemsMessageId](./api-extractor-model.findapiitemsmessageid.md) | Unique identifiers for messages returned as part of <code>IFindApiItemsResult</code>. |
|  [ReleaseTag](./api-extractor-model.releasetag.md) | A "release tag" is a custom TSDoc tag that is applied to an API to communicate the level of support provided for third-party developers. |

## Functions

|  Function | Description |
|  --- | --- |
|  [ApiAbstractMixin(baseClass)](./api-extractor-model.apiabstractmixin.md) | Mixin function for [ApiAbstractMixin](./api-extractor-model.apiabstractmixin.md)<></>. |
|  [ApiExportedMixin(baseClass)](./api-extractor-model.apiexportedmixin.md) | Mixin function for [ApiExportedMixin](./api-extractor-model.apiexportedmixin.md)<></>. |
|  [ApiInitializerMixin(baseClass)](./api-extractor-model.apiinitializermixin.md) | Mixin function for [ApiInitializerMixin](./api-extractor-model.apiinitializermixin.md)<></>. |
|  [ApiItemContainerMixin(baseClass)](./api-extractor-model.apiitemcontainermixin.md) | Mixin function for [ApiDeclaredItem](./api-extractor-model.apideclareditem.md)<></>. |
|  [ApiNameMixin(baseClass)](./api-extractor-model.apinamemixin.md) | Mixin function for [ApiNameMixin](./api-extractor-model.apinamemixin.md)<></>. |
|  [ApiOptionalMixin(baseClass)](./api-extractor-model.apioptionalmixin.md) | Mixin function for [ApiOptionalMixin](./api-extractor-model.apioptionalmixin.md)<></>. |
|  [ApiParameterListMixin(baseClass)](./api-extractor-model.apiparameterlistmixin.md) | Mixin function for [ApiParameterListMixin](./api-extractor-model.apiparameterlistmixin.md)<></>. |
|  [ApiProtectedMixin(baseClass)](./api-extractor-model.apiprotectedmixin.md) | Mixin function for [ApiProtectedMixin](./api-extractor-model.apiprotectedmixin.md)<></>. |
|  [ApiReadonlyMixin(baseClass)](./api-extractor-model.apireadonlymixin.md) | Mixin function for [ApiReadonlyMixin](./api-extractor-model.apireadonlymixin.md)<></>. |
|  [ApiReleaseTagMixin(baseClass)](./api-extractor-model.apireleasetagmixin.md) | Mixin function for [ApiReleaseTagMixin](./api-extractor-model.apireleasetagmixin.md)<></>. |
|  [ApiReturnTypeMixin(baseClass)](./api-extractor-model.apireturntypemixin.md) | Mixin function for [ApiReturnTypeMixin](./api-extractor-model.apireturntypemixin.md)<></>. |
|  [ApiStaticMixin(baseClass)](./api-extractor-model.apistaticmixin.md) | Mixin function for [ApiStaticMixin](./api-extractor-model.apistaticmixin.md)<></>. |
|  [ApiTypeParameterListMixin(baseClass)](./api-extractor-model.apitypeparameterlistmixin.md) | Mixin function for [ApiTypeParameterListMixin](./api-extractor-model.apitypeparameterlistmixin.md)<></>. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [ApiAbstractMixin](./api-extractor-model.apiabstractmixin.md) | The mixin base class for API items that have an abstract modifier. |
|  [ApiExportedMixin](./api-extractor-model.apiexportedmixin.md) | The mixin base class for API items that can be exported. |
|  [ApiInitializerMixin](./api-extractor-model.apiinitializermixin.md) | The mixin base class for API items that can have an initializer. |
|  [ApiItemContainerMixin](./api-extractor-model.apiitemcontainermixin.md) | The mixin base class for API items that act as containers for other child items. |
|  [ApiNameMixin](./api-extractor-model.apinamemixin.md) | The mixin base class for API items that have a name. For example, a class has a name, but a class constructor does not. |
|  [ApiOptionalMixin](./api-extractor-model.apioptionalmixin.md) | The mixin base class for API items that can be marked as optional by appending a <code>?</code> to them. For example, a property of an interface can be optional. |
|  [ApiParameterListMixin](./api-extractor-model.apiparameterlistmixin.md) | The mixin base class for API items that can have function parameters (but not necessarily a return value). |
|  [ApiProtectedMixin](./api-extractor-model.apiprotectedmixin.md) | The mixin base class for API items that can have the TypeScript <code>protected</code> keyword applied to them. |
|  [ApiReadonlyMixin](./api-extractor-model.apireadonlymixin.md) | The mixin base class for API items that cannot be modified after instantiation. Examples such as the readonly modifier and only having a getter but no setter. |
|  [ApiReleaseTagMixin](./api-extractor-model.apireleasetagmixin.md) | The mixin base class for API items that can be attributed with a TSDoc tag such as <code>@internal</code>, <code>@alpha</code>, <code>@beta</code>, or <code>@public</code>. These "release tags" indicate the support level for an API. |
|  [ApiReturnTypeMixin](./api-extractor-model.apireturntypemixin.md) | The mixin base class for API items that are functions that return a value. |
|  [ApiStaticMixin](./api-extractor-model.apistaticmixin.md) | The mixin base class for API items that can have the TypeScript <code>static</code> keyword applied to them. |
|  [ApiTypeParameterListMixin](./api-extractor-model.apitypeparameterlistmixin.md) | The mixin base class for API items that can have type parameters. |
|  [IApiAbstractMixinOptions](./api-extractor-model.iapiabstractmixinoptions.md) | Constructor options for [ApiAbstractMixin](./api-extractor-model.apiabstractmixin.md)<></>. |
|  [IApiCallSignatureOptions](./api-extractor-model.iapicallsignatureoptions.md) | Constructor options for [ApiCallSignature](./api-extractor-model.apicallsignature.md)<></>. |
|  [IApiClassOptions](./api-extractor-model.iapiclassoptions.md) | Constructor options for [ApiClass](./api-extractor-model.apiclass.md)<></>. |
|  [IApiConstructorOptions](./api-extractor-model.iapiconstructoroptions.md) | Constructor options for [ApiConstructor](./api-extractor-model.apiconstructor.md)<></>. |
|  [IApiConstructSignatureOptions](./api-extractor-model.iapiconstructsignatureoptions.md) | Constructor options for [ApiConstructor](./api-extractor-model.apiconstructor.md)<></>. |
|  [IApiDeclaredItemOptions](./api-extractor-model.iapideclareditemoptions.md) | Constructor options for [ApiDeclaredItem](./api-extractor-model.apideclareditem.md)<></>. |
|  [IApiDocumentedItemOptions](./api-extractor-model.iapidocumenteditemoptions.md) | Constructor options for [ApiDocumentedItem](./api-extractor-model.apidocumenteditem.md)<></>. |
|  [IApiEntryPointOptions](./api-extractor-model.iapientrypointoptions.md) | Constructor options for [ApiEntryPoint](./api-extractor-model.apientrypoint.md)<></>. |
|  [IApiEnumMemberOptions](./api-extractor-model.iapienummemberoptions.md) | Constructor options for [ApiEnumMember](./api-extractor-model.apienummember.md)<></>. |
|  [IApiEnumOptions](./api-extractor-model.iapienumoptions.md) | Constructor options for [ApiEnum](./api-extractor-model.apienum.md)<></>. |
|  [IApiExportedMixinOptions](./api-extractor-model.iapiexportedmixinoptions.md) | Constructor options for [IApiExportedMixinOptions](./api-extractor-model.iapiexportedmixinoptions.md)<></>. |
|  [IApiFunctionOptions](./api-extractor-model.iapifunctionoptions.md) | Constructor options for [ApiFunction](./api-extractor-model.apifunction.md)<></>. |
|  [IApiIndexSignatureOptions](./api-extractor-model.iapiindexsignatureoptions.md) | Constructor options for [ApiIndexSignature](./api-extractor-model.apiindexsignature.md)<></>. |
|  [IApiInitializerMixinOptions](./api-extractor-model.iapiinitializermixinoptions.md) | Constructor options for [IApiInitializerMixinOptions](./api-extractor-model.iapiinitializermixinoptions.md)<></>. |
|  [IApiInterfaceOptions](./api-extractor-model.iapiinterfaceoptions.md) | Constructor options for [ApiInterface](./api-extractor-model.apiinterface.md)<></>. |
|  [IApiItemConstructor](./api-extractor-model.iapiitemconstructor.md) | This abstraction is used by the mixin pattern. It describes a class type that inherits from [ApiItem](./api-extractor-model.apiitem.md)<></>. |
|  [IApiItemContainerMixinOptions](./api-extractor-model.iapiitemcontainermixinoptions.md) | Constructor options for [ApiItemContainerMixin](./api-extractor-model.apiitemcontainermixin.md)<></>. |
|  [IApiItemOptions](./api-extractor-model.iapiitemoptions.md) | Constructor options for [ApiItem](./api-extractor-model.apiitem.md)<></>. |
|  [IApiMethodOptions](./api-extractor-model.iapimethodoptions.md) | Constructor options for [ApiMethod](./api-extractor-model.apimethod.md)<></>. |
|  [IApiMethodSignatureOptions](./api-extractor-model.iapimethodsignatureoptions.md) |  |
|  [IApiNameMixinOptions](./api-extractor-model.iapinamemixinoptions.md) | Constructor options for [IApiNameMixinOptions](./api-extractor-model.iapinamemixinoptions.md)<></>. |
|  [IApiNamespaceOptions](./api-extractor-model.iapinamespaceoptions.md) | Constructor options for [ApiClass](./api-extractor-model.apiclass.md)<></>. |
|  [IApiOptionalMixinOptions](./api-extractor-model.iapioptionalmixinoptions.md) | Constructor options for [IApiOptionalMixinOptions](./api-extractor-model.iapioptionalmixinoptions.md)<></>. |
|  [IApiPackageOptions](./api-extractor-model.iapipackageoptions.md) | Constructor options for [ApiPackage](./api-extractor-model.apipackage.md)<></>. |
|  [IApiPackageSaveOptions](./api-extractor-model.iapipackagesaveoptions.md) | Options for [ApiPackage.saveToJsonFile()](./api-extractor-model.apipackage.savetojsonfile.md)<></>. |
|  [IApiParameterListMixinOptions](./api-extractor-model.iapiparameterlistmixinoptions.md) | Constructor options for [ApiParameterListMixin](./api-extractor-model.apiparameterlistmixin.md)<></>. |
|  [IApiParameterOptions](./api-extractor-model.iapiparameteroptions.md) | Represents parameter information that is part of [IApiParameterListMixinOptions](./api-extractor-model.iapiparameterlistmixinoptions.md) |
|  [IApiPropertyItemOptions](./api-extractor-model.iapipropertyitemoptions.md) | Constructor options for [ApiPropertyItem](./api-extractor-model.apipropertyitem.md)<></>. |
|  [IApiPropertyOptions](./api-extractor-model.iapipropertyoptions.md) | Constructor options for [ApiProperty](./api-extractor-model.apiproperty.md)<></>. |
|  [IApiPropertySignatureOptions](./api-extractor-model.iapipropertysignatureoptions.md) | Constructor options for [ApiPropertySignature](./api-extractor-model.apipropertysignature.md)<></>. |
|  [IApiProtectedMixinOptions](./api-extractor-model.iapiprotectedmixinoptions.md) | Constructor options for [IApiProtectedMixinOptions](./api-extractor-model.iapiprotectedmixinoptions.md)<></>. |
|  [IApiReadonlyMixinOptions](./api-extractor-model.iapireadonlymixinoptions.md) | Constructor options for [ApiReadonlyMixin](./api-extractor-model.apireadonlymixin.md)<></>. |
|  [IApiReleaseTagMixinOptions](./api-extractor-model.iapireleasetagmixinoptions.md) | Constructor options for [ApiReleaseTagMixin](./api-extractor-model.apireleasetagmixin.md)<></>. |
|  [IApiReturnTypeMixinOptions](./api-extractor-model.iapireturntypemixinoptions.md) | Constructor options for [ApiReturnTypeMixin](./api-extractor-model.apireturntypemixin.md)<></>. |
|  [IApiStaticMixinOptions](./api-extractor-model.iapistaticmixinoptions.md) | Constructor options for [IApiStaticMixinOptions](./api-extractor-model.iapistaticmixinoptions.md)<></>. |
|  [IApiTypeAliasOptions](./api-extractor-model.iapitypealiasoptions.md) | Constructor options for [ApiTypeAlias](./api-extractor-model.apitypealias.md)<></>. |
|  [IApiTypeParameterListMixinOptions](./api-extractor-model.iapitypeparameterlistmixinoptions.md) | Constructor options for [ApiTypeParameterListMixin](./api-extractor-model.apitypeparameterlistmixin.md)<></>. |
|  [IApiTypeParameterOptions](./api-extractor-model.iapitypeparameteroptions.md) | Represents parameter information that is part of [IApiTypeParameterListMixinOptions](./api-extractor-model.iapitypeparameterlistmixinoptions.md) |
|  [IApiVariableOptions](./api-extractor-model.iapivariableoptions.md) | Constructor options for [ApiVariable](./api-extractor-model.apivariable.md)<></>. |
|  [IExcerptToken](./api-extractor-model.iexcerpttoken.md) |  |
|  [IExcerptTokenRange](./api-extractor-model.iexcerpttokenrange.md) | Used by [Excerpt](./api-extractor-model.excerpt.md) to indicate a range of indexes within an array of <code>ExcerptToken</code> objects. |
|  [IFindApiItemsMessage](./api-extractor-model.ifindapiitemsmessage.md) | This object is used for messages returned as part of <code>IFindApiItemsResult</code>. |
|  [IFindApiItemsResult](./api-extractor-model.ifindapiitemsresult.md) | Generic result object for finding API items used by different kinds of find operations. |
|  [IParameterOptions](./api-extractor-model.iparameteroptions.md) | Constructor options for [Parameter](./api-extractor-model.parameter.md)<></>. |
|  [IResolveDeclarationReferenceResult](./api-extractor-model.iresolvedeclarationreferenceresult.md) | Result object for [ApiModel.resolveDeclarationReference()](./api-extractor-model.apimodel.resolvedeclarationreference.md)<></>. |
|  [ISourceLocationOptions](./api-extractor-model.isourcelocationoptions.md) | Constructor options for <code>SourceLocation</code>. |
|  [ITypeParameterOptions](./api-extractor-model.itypeparameteroptions.md) | Constructor options for [TypeParameter](./api-extractor-model.typeparameter.md)<></>. |

## Namespaces

|  Namespace | Description |
|  --- | --- |
|  [ApiAbstractMixin](./api-extractor-model.apiabstractmixin.md) | Static members for [ApiAbstractMixin](./api-extractor-model.apiabstractmixin.md)<></>. |
|  [ApiExportedMixin](./api-extractor-model.apiexportedmixin.md) | Static members for [ApiExportedMixin](./api-extractor-model.apiexportedmixin.md)<></>. |
|  [ApiInitializerMixin](./api-extractor-model.apiinitializermixin.md) | Static members for [ApiInitializerMixin](./api-extractor-model.apiinitializermixin.md)<></>. |
|  [ApiItemContainerMixin](./api-extractor-model.apiitemcontainermixin.md) | Static members for [ApiItemContainerMixin](./api-extractor-model.apiitemcontainermixin.md)<></>. |
|  [ApiNameMixin](./api-extractor-model.apinamemixin.md) | Static members for [ApiNameMixin](./api-extractor-model.apinamemixin.md)<></>. |
|  [ApiOptionalMixin](./api-extractor-model.apioptionalmixin.md) | Optional members for [ApiOptionalMixin](./api-extractor-model.apioptionalmixin.md)<></>. |
|  [ApiParameterListMixin](./api-extractor-model.apiparameterlistmixin.md) | Static members for [ApiParameterListMixin](./api-extractor-model.apiparameterlistmixin.md)<></>. |
|  [ApiProtectedMixin](./api-extractor-model.apiprotectedmixin.md) | Static members for [ApiProtectedMixin](./api-extractor-model.apiprotectedmixin.md)<></>. |
|  [ApiReadonlyMixin](./api-extractor-model.apireadonlymixin.md) | Static members for [ApiReadonlyMixin](./api-extractor-model.apireadonlymixin.md)<></>. |
|  [ApiReleaseTagMixin](./api-extractor-model.apireleasetagmixin.md) | Static members for [ApiReleaseTagMixin](./api-extractor-model.apireleasetagmixin.md)<></>. |
|  [ApiReturnTypeMixin](./api-extractor-model.apireturntypemixin.md) | Static members for [ApiReturnTypeMixin](./api-extractor-model.apireturntypemixin.md)<></>. |
|  [ApiStaticMixin](./api-extractor-model.apistaticmixin.md) | Static members for [ApiStaticMixin](./api-extractor-model.apistaticmixin.md)<></>. |
|  [ApiTypeParameterListMixin](./api-extractor-model.apitypeparameterlistmixin.md) | Static members for [ApiTypeParameterListMixin](./api-extractor-model.apitypeparameterlistmixin.md)<></>. |
|  [ReleaseTag](./api-extractor-model.releasetag.md) | Helper functions for working with the <code>ReleaseTag</code> enum. |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Constructor](./api-extractor-model.constructor.md) | This abstraction is used by the mixin pattern. It describes a class constructor. |
|  [PropertiesOf](./api-extractor-model.propertiesof.md) | This abstraction is used by the mixin pattern. It describes the "static side" of a class. |

