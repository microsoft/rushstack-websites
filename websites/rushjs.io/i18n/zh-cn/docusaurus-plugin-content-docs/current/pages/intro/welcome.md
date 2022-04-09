---
title: 欢迎使用 Rush
---

<img src="/images/rush.svg" alt="Rush" title="Rush" style={{ width: '12rem', paddingBottom: '1rem' }}/>

**Rush** 可以让 JavaScript 开发者更轻松地同时构建、发布多个 NPM 包。如果你正在将你的所有项目整合到一个仓库内，那么你来对地方了！Rush 是一个快速、专业的解决方案，它可以帮助你：

- **仅需一次 NPM 安装:** 仅需一步，Rush 便可以将你项目的所有依赖安装到一个公共文件夹下，该文件夹并不像 "package.json" 一样位于项目的根目录（放到根目录的设计可能存在幻影依赖的问题），相反，Rush 使用符号链接来为每个项目重新构建一个准确的 "node_modules" 文件。

⏵ **该算法支持 [PNPM, NPM, and Yarn](../../maintainer/package_managers) 等包管理工具.**

- **本地自动链接：** 在 Rush 仓库内的所有项目之间被自动链接，当代码发生变动时，你可以在不发布的情况下看到下游所有的变动，同时，也不会困扰于 `npm link` 如何使用；如果你不想让某一个仓库被链接，那也很容易做到。

**快速构建：** Rush 会检测依赖图，并按照正确的顺序构建你的项目。如果两个库没有被互相依赖，Rush 会使用独立的 NodeJS 进程来并行构建（同时这些并行的进程会以 [可读的顺序](https://www.npmjs.com/package/@rushstack/stream-collator) 下显示控制台输出）。在实践中，这种多进程方式可以比所有异步函数运行在在单线程的 Gulpfile 中提供显著的速度提升。

- **子集构建和增量构建：** 如果你仅仅想构建一部分项目，可以使用 `rush rebuild --to <project>` 来实现一个仅包含上游依赖的清理式构建，它会重新构建该 project 及其依赖的项目；`rush rebuild --from <project>` 可以实现一个仅包含下游依赖的清理式构建，它会重新构建该 project 以及所有依赖该 project 的项目。如果你的工具链启用了 [package-deps-hash](https://www.npmjs.com/package/@rushstack/package-deps-hash), `rush build` 会生成一个强有力的跨项目增量构建（也支持子集构建）。

- **循环依赖：** 当一个库间接依赖自己的旧版本时，处于循环中的项目会使用最后一个发布的版本，而其他项目仍然会获得最新的版本。

- **批量发布：** 发布时，Rush 可以检测哪些包发生了变动，同时会自动的提高相应的版本号，并在每个文件夹那执行 `npm publish`, 如果你喜欢，你可以配置你的服务器，让它每小时自动执行 `rush publish`。

- **跟踪更新日志：** 每当创建一个 PR, 你可以要求开发者为受到影响的项目提供一个 major/minor/path 的更新条目。发布时，这些日志会被以优雅的格式整合到 [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/libraries/node-core-library/CHANGELOG.md) 文件中.

- **企业级政策**：想要在某个依赖被加进 package.json 前对该依赖进行审核，但是又担心重复的问题？想要让你的项目内的所有依赖都有相同版本？是否有不专业的私人邮箱混入到了你公司的 Git 历史中？Rush 可以让多人开发和多项目混合时保持一致的生态。

**还有更多！** Rush 由 [Microsoft SharePoint](http://aka.ms/spfx) 团队创建。我们每天构建数百个适用于生产环境的 NPM 包，从内部到开源的 Git 仓库，服务第三方 SDK 和实时服务的百万用户。如果在包管理上存在需要解决的重要问题，那么很有可能被 Rush 的某个功能特习惯解决。
