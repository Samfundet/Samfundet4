[**&larr; Back: Getting started**](../introduction.md)

> [!WARNING]
> This script has not been maintained in a while and may not work.

# Install script

We have a script that handles all installation for you. Git operations use SSH, and the script will help you create
an SSH key if needed. 

Copy these commands (press button on the right-hand side of the block)
and run from the directory you would clone the project.

```sh
# Interactive
X_INTERACTIVE=y /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Samfundet/Samfundet4/master/{bash_utils.sh,install.sh})" && . ~/.bash_profile && cd Samfundet4; unset X_INTERACTIVE;
```

<details>
<summary>Non-interactive (show/hide)</summary>

```sh
# Non-interactive
X_INTERACTIVE=n /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Samfundet/Samfundet4/master/{bash_utils.sh,install.sh})" && . ~/.bash_profile && cd Samfundet4; unset X_INTERACTIVE;
```

<!--
cd ~/my-projects/test; rm -rf Samfundet4; X_INTERACTIVE=y /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Samfundet/Samfundet4/master/{bash_utils.sh,install.sh})" && . ~/.bash_profile && cd Samfundet4; unset X_INTERACTIVE;
 -->
</details>

<details>
<summary>Flags explained (show/hide)</summary>

> - X_INTERACTIVE (y/n): determines how many prompts you receive before performing an action.  
    > curl:
> - -f: fail fast
> - -s: silent, no progress-meter
> - -S: show error on fail
> - -L: follow redirect

</details>
