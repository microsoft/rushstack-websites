---
layout: page
title: Configuring tab completion
navigation_source: docs_nav
---

As of version 5.34.0, Rush supports tab completion so that shell commands can be input more quickly
by pressing the TAB key. The setup instructions below are based on the article
[Tab completion for the .NET Core CLI](https://docs.microsoft.com/en-us/dotnet/core/tools/enable-tab-autocomplete)
which provides some additional tips.

## PowerShell

To enable tab completion for PowerShell, create or edit the profile stored in the `$PROFILE` variable.
For more information, see
[How to create your profile](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles#how-to-create-a-profile)
and [Profiles and execution policy](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles#profiles-and-execution-policy).

Add the following code to your profile:

```powershell
# PowerShell parameter completion shim for the Rush CLI
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

To enable tab completion for Bash, add the following code to your **.bashrc** file:

```bash
# bash parameter completion for the Rush CLI

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

#### Next up: [Selecting subsets of projects]({% link pages/developer/selecting_subsets.md %})
