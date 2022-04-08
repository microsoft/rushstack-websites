# Rush Stack Websites

[![Main CI](https://dev.azure.com/RushStack/GitHubProjects/_apis/build/status/rushstack-websites/RushStack%20Websites%20Deploy?branchName=main)](https://dev.azure.com/RushStack/GitHubProjects/_build/latest?definitionId=27&branchName=main) [![Latest Deployment](https://dev.azure.com/RushStack/GitHubProjects/_apis/build/status/rushstack-websites/RushStack%20Websites%20Deploy?branchName=main)](https://dev.azure.com/RushStack/GitHubProjects/_build/latest?definitionId=28&branchName=main)

The following websites are maintained in this monorepo:

- https://rushjs.io
- https://rushstack.io
- https://api.rushstack.io
- Coming soon: https://api-extractor.com
- Coming soon: https://tsdoc.org

## Targets

The Docusaurus websites in this monorepo support a concept called "target", which describes the environment
sites are being built for. There are 3 possible targets:

### "local"

The `local` target is intended for use when a Docusaurus development server is running locally. This
target will automatically be selected if you run `rushx start` in any of the website projects.

You can also force this target by setting the environment variable `TARGET=local`.

### "fork"

The `fork` target is intended for use when you are building static Docusaurus sites for deployment,
but you'll be deploying them to GitHub Pages on your fork of the `rushstack-websites` project. This is
useful for deploying demo sites to share with others, to test on phones and tablets, etc. This target
will automatically be selected if you run a production build (`rushx build`) of a website project and
you have cloned a _fork_ of the `rushstack-websites` project.

You can also force this target by setting the environment variable `TARGET=fork`.

### "prod"

The `prod` target is intended for use when you will be deploying a website project to GitHub Pages
in its live production repo. Typically this target is only used by a CI pipeline, and it is automatically
selected if you run a production build on a clone of the `microsoft/rushstack-websites` repo.

You can also force this target by setting the environment variable `TARGET=prod`.

## Deploying a fork

To facilitate testing of multi-site changes, you can opt to build and deploy all of the website projects
at once from a fork of `rushstack-websites`. To do so, first make sure you've forked the project
and cloned your fork locally, and then run:

```console
rush install
rush build
GIT_USER=<your-git-username> rush deploy-fork
```

The commands above will automatically build all of the supported websites with `TARGET=fork`, then deploy
them in a group to the `gh-pages` branch of your forked repo. You can then access these sites via individual
site paths, for example:

```text
https://<your-git-username>.github.io/rushstack-websites/rushstack.io/
```

Cross-site links between the different sites will automatically be linked up to navigate to your deployed
versions of those sites.

## Deploying to production

The production Rushstack websites are deployed periodically by the maintainers using an Azure DevOps pipeline. Check the badge at the top of this README for the latest status and deployment history.

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all others rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
