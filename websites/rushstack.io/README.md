# rushstack.io

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Local development

To build dependencies and then start the local dev server:

```
rush build --to-except .
rushx start
```

## Building a production build

To produce the static site in the `build` directory:

```
rushx build
```

You can serve this production build locally to test it:

```
rushx serve
```

## Deployment

To build the production site and then push it to the `gh-pages` branch of the target repo:

```
# This is Bash's syntax; for Windows shell, change "export" to be "set"
export GIT_USER=<Your GitHub username>

# (Optional) Specify this if you use SSH instead of HTTPS authentication
export USE_SSH=true

# Specify the deployment target
export TARGET=prod

rushx deploy
```

(Typically, this deployment will happen in a CI/CD pipeline, which will have the credentials
necessary to write to the https://github.com/microsoft/rushstack.io-website repo that serves as the
GitHub Pages deployment target.)

## Managing translations

Instructions for internationalization with Docusaurus: https://docusaurus.io/docs/i18n/introduction

The supported locales for this project can be found in the `"i18n"` section of
[docusaurus.config.js](./docusaurus.config.js).

> **NOTE:** Each locale is built as a distinct standalone single-page application. The localhost
> dev server builds only one locale at a time. To view multiple locales together, you must deploy
> the site.

Common commands:

- `rushx start --locale zh-cn` - launch the localhost dev server in the specified language.

- `rushx write-translations --locale zh-cn` - Update the `i18n/*.json` files with any new strings.
