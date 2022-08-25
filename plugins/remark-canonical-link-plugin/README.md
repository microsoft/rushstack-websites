# remark-canonical-link-plugin

A [remark plugin](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) that adds a canonical link to each page to prevent search engines from indexing unofficial deployments of the website.

This plugin runs after the markdown file has been parsed and turned into an AST, but before the AST is translated into HTML.

## Usage

This plugin takes only one option, called `prefix`, which is a string representing the canonical URL prefix. Unlike the website URL configured in a Docusaurus config file, this prefix is fixed and doesn't change depending on the target being deployed (for example, if you use `deploy-fork` to deploy a fork, we want to ensure that the pages point canonically to the production website for SEO visibility).

For example:

```js
{
  prefix: 'https://rushjs.io';
}
```

If you visit the page `/pages/banana` on a forked website, running the plugin with this configuration will produce the following node in the `<head>` section:

```html
<link rel="canonical" href="https://rushjs.io/pages/banana" />
```

## TODO

Note that Docusaurus uses an older version of `unist-util-visit`, because later versions are distributed only as ESM modules. However, the typings included in this old version are not as good, so this plugin may include a few small typing shims to compensate.
