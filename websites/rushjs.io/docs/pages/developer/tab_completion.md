---
title: Configuring tab completion
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

## Fish

To enable tab completion for [Fish shell](https://fishshell.com/), add the following code to the file **~/.config/fish/completions/rush.fish**:

```fish
# Fish parameter completions for the Rush CLI
complete rush --no-files

function __fish_rush
	set -l position (string length (commandline -cp))
	set -l word (commandline -opc)
    rush tab-complete --word "$word" --position "$position"
end

complete rush -x -a "(__fish_rush)"
```

## Zsh

[Zsh](https://www.zsh.org/) has slightly different env variables, add the following into **~/.zshrc**:

```zsh
(( ${+commands[rush]} )) && {
  _rush_completion() {
    compadd -- $(rush tab-complete --position ${CURSOR} --word "${BUFFER}" 2>>/dev/null)
  }
  compdef _rush_completion rush
}
```

It checks for the existence of rush. This needs to be added after the PATH is properly set (or after [nvm](https://github.com/nvm-sh/nvm) is initialized). Otherwise, you will need to remove the first line.
