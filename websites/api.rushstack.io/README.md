# api.rushstack.io

This project builds the API section of the `rushstack.io` website.

The API section is hosted as a separate Docusaurus deployment:

- URL: https://api.rushstack.io/
- GitHub Pages: https://github.com/microsoft/api.rushstack.io-website/

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
