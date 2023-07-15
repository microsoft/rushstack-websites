---
title: Heft command line
---

## Heft 基础配置

```
用法：heft [-h] [--debug] [--unmanaged] <command> ...

Heft是为Web项目设计的可插入构建系统。

位置参数：
  <command>
    clean      清理项目，删除临时任务文件夹和
              指定的清理路径。
    run        运行提供的一些Heft阶段。
    run-watch  以监视模式运行提供的一些Heft阶段。

可选参数：
  -h, --help   显示此帮助信息并退出。
```

## jest-plugin

[jest-plugin](../plugins/jest.md) 添加了这些自定义命令行参数：

```
  --config RELATIVE_PATH
                        使用此参数来控制哪个Jest
                        配置文件将被用来运行Jest测试。如果
                        没有指定，它将默认为 "config/jest.config.
                        json"。这对应于Jest文档中的 "--config" 参数。
  --debug-heft-reporter
                        通常，Heft会安装一个自定义的Jest报告器，使得
                        测试结果与其他任务日志的呈现一致。如果你怀疑
                        HeftJestReporter存在问题，可以指定 "--debug-heft-reporter" 来
                        临时禁用它，以便你可以与
                        Jest的默认报告器呈现的方式进行比较。
                        在你的错误报告中包含此输出。不要在
                        生产环境中使用 "--debug-heft-reporter"。
  --detect-open-handles
                        尝试收集和打印阻止
                        Jest正常退出的打开句柄。此选项有一
                        重大的性能代价，只应用于调试。这对应于Jest的
                        文档中的 "--detectOpenHandles" 参数。
  --disable-code-coverage
                        禁用任何配置的代码覆盖率。如果没有
                        配置代码覆盖率，此参数无效。
  --find-related-tests SOURCE_FILE
                        查找和运行覆盖了作为参数传入的
                        源文件的测试。这对应于Jest的
                        文档中的 "--findRelatedTests" 参数。这个参数与
                        监视模式不兼容。
  --max-workers COUNT_OR_PERCENTAGE
                        使用此参数来控制测试允许使用的
                        最大工作进程数。此参数类似于
                        Jest文档中的参数，并可以是一个表示
                        运行测试时要生成的工作进程数量的整数，也可以是一个
                        表示要利用机器上可用CPU的百分比的字符串。
                        示例值："3"，"25%"。
  --silent
                        防止测试通过控制台打印信息。这对应于Jest的
                        文档中的 "--silent" 参数。
  -t REGEXP, --test-name-pattern REGEXP
                        只运行名称匹配正则表达式的测试。
                        REGEXP与完整名称匹配，这是测试名称和所有
                        周围的describe块的组合。这对应于Jest的
                        文档中的 "--testNamePattern" 参数。
  --test-path-ignore-patterns REGEXP
                        避免运行源文件路径匹配一个或多个正则表达式的
                        测试。在Windows上，你需要使用 "/" 代替 "\"。这
                        对应于Jest文档中的 "--testPathIgnorePatterns"
                        参数。
  --test-path-pattern REGEXP
                        只运行源文件路径匹配正则表达式的测试。
                        在Windows上，你需要使用 "/" 代替 "\"。这对应于
                        Jest文档中的 "--testPathPattern" 参数。
  --test-timeout-ms TIMEOUT
                        改变测试的默认超时时间；如果测试
                        在这个毫秒数内未完成，它会失败。单个测试可以覆盖默认值。
                        如果未指定，默认值通常是5000 ms。这对应于Jest的
                        文档中的 "--testTimeout" 参数。
  -u, --update-snapshots
                        在运行测试时更新Jest快照。这对应于Jest的
                        "--updateSnapshots" 参数。
```

## node-service-plugin

[node-service-plugin](../plugins//node-service.md) 添加了以下自定义命令行参数：

```
  --serve
                        为测试目的启动一个本地Web服务器。此
                        参数只在watch模式下运行时可用。
```

## serverless-stack-plugin

[serverless-stack-plugin](../plugins//serverless-stack.md) 添加了以下自定义命令行参数：

```
  --sst
                        调用SST后处理。需要AWS凭证。
  --sst-stage STAGE_NAME
                        指定Serverless Stack阶段；相当于
                        "sst" CLI的 "--stage" 参数
```

## storybook-plugin

[storybook-plugin](../plugins//storybook.md) 添加了以下自定义命令行参数：

```
  --storybook
                        被"@rushstack/heft-storybook-plugin"包使用来启动
                        Storybook。
```

## webpack5-plugin

[webpack5-plugin](../plugins//webpack.md) 添加了以下自定义命令行参数：

```
  --serve
                        使用webpack-dev-server启动一个本地Web服务器用于测试目的。
                        此参数只在watch模式下运行时可用。
```
