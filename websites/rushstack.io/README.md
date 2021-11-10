# rushstack.io

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Local development

To build dependencies and then start the local dev server:

```
rush build --to-except .
rushx start
```

For ease of iteration, you can also start the local dev server without the API Docs:

```
SKIP_API_DOCS=1 rushx start
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
necessary to write to the `rushstack.io-website` GitHub repo.)

## Updating API docs

To update the API docs using latest APIs extracted from the Rush Stack repo, first navigate
to your local clone of the https://github.com/microsoft/rushstack repo:

```
rush install
rush build
```

Then, in this folder:

```
rush build --to-except .
rushx update-api-docs <path-to-local-rushstack>
mv docs/api_nav.json data
```

Check in the resulting `docs/api` and `data` folder changes and include it in your PR.
