---
title: Submitting a pull request
---

1. Make sure the Rush tool is installed, following the
   [Building the projects](../contributing/building.md) instructions.

2. Install dependencies for all projects in the monorepo:

   ```shell
   # Run this command in the folder where you cloned the TSDoc repo from GitHub
   $ rush install
   ```

   > Note: After you run `rush install`, your repo will be in a "Rush-linked" state,
   > with special symlinks in the node_modules folders. DO NOT run `npm install` in this state.
   > If you want to go back to working in standalone mode, first run `rush unlink && rush purge`.

3. Build and test all the projects in the monorepo:

   ```shell
   $ rush build
   ```

   You can also build just the **@microsoft/tsdoc** library like this:

   ```shell
   $ cd ./tsdoc
   $ npm run build
   ```

4. Manual testing: Before submitting your PR, you should also try running the
   [/api-demo](https://github.com/microsoft/tsdoc/tree/main/api-demo) and [/playground](https://github.com/microsoft/tsdoc/tree/main/playground) projects to make sure they
   weren't broken by your change.

5. Change logs: If your PR modifies the published NPM package, you will need to write a
   change entry for our [CHANGELOG.md](https://github.com/microsoft/tsdoc/blob/main/tsdoc/CHANGELOG.md) change log. Please read the
   "[recommended practices](https://rushjs.io/pages/best_practices/change_logs/)" for
   authoring change logs.

   ```shell
   $ rush change
   # (The tool will ask you to write a sentence describing your change.)
   ```

   The `rush change` command will create a file under the **common/changes** folder.
   Add this file to Git and include in your pull request. Please see
   [Everyday commands](https://rushjs.io/pages/developer/everyday_commands/) for
   more details about how these files are used.

## Contributor Notice

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
