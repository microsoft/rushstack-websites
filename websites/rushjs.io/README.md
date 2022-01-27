# rushjs.io

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
$ GIT_USER=<Your GitHub username> USE_SSH=true rushx deploy
```

(Typically, this deployment will happen in a CI/CD pipeline, which will have the credentials
necessary to write to the https://github.com/microsoft/rushjs.io-website repo that serves as the
GitHub Pages deployment target.)
