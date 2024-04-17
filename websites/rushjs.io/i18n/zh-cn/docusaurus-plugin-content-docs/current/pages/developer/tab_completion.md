---
title: 配置 tab 补全
---

在 5.34.0 版本中，Rush 支持 tab 补全，这样可以让用户按下 TAB 键来快速输入 shell 命令。以下内容参考自
[.NET Core CLI 的 tab 补全](https://docs.microsoft.com/en-us/dotnet/core/tools/enable-tab-autocomplete)。

## PowerShell

为了在 PowerShell 中开启 tab 补全，需要创建或编辑 `$PROFILE` 中的变量，更多信息可以参考：[如何创建 profile](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles#how-to-create-a-profile) 和 [Profile 的执行原理](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles#profiles-and-execution-policy).

在你的 profile 中添加以下代码：

```powershell
# 适用于 Rush CLI 的 PowerShell 参数补全工具
Register-ArgumentCompleter -Native -CommandName rush -ScriptBlock {
  param($commandName, $commandAst, $cursorPosition)
    [string]$value = $commandAst.ToString()
    # Handle input like `rush install; rush bui` + Tab
    [int]$position = [Math]::Min($cursorPosition, $value.Length)

    rush tab-complete --position $position --word "$value" | ForEach-Object {
      [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
    }
 }
```

## Bash

为了在 Bash 中开启自动补全，需要在 **.bashrc** 文件中添加以下代码：

```bash
# 适用于 Rush CLI 的 bash 参数补全工具

_rush_bash_complete()
{
  local word=${COMP_WORDS[COMP_CWORD]}

  local completions
  completions="$(rush tab-complete --position "${COMP_POINT}" --word "${COMP_LINE}" 2>/dev/null)"
  if [ $? -ne 0 ]; then
    completions=""
  fi

  COMPREPLY=( $(compgen -W "$completions" -- "$word") )
}

complete -f -F _rush_bash_complete rush
```

## Zsh

[Zsh](https://www.zsh.org/) 的环境变量会稍有不同，需要在 `~/.zshrc` 文件中添加以下代码：

```zsh
(( ${+commands[rush]} )) && {
  _rush_completion() {
    compadd -- $(rush tab-complete --position ${CURSOR} --word "${BUFFER}" 2>>/dev/null)
  }
  compdef _rush_completion rush
}
```

它会检查 rush 命令是否存在，因此这段代码需要添加在 PATH 已经设置好之后（或者在 [nvm](https://github.com/nvm-sh/nvm) 初始化之后）。或者，你也可以删除第一行的 rush 命令检查。
