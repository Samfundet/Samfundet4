[**&larr; Back: Getting started**](../introduction.md)

<!-- WORK IN PROGRESS -->

# Git setup

Git is a Version Control System (VCS). You're required to set up Git in order to be able to pull and push to the
Samfundet4 project.

## Creating an SSH key

<details>
<summary><strong>Windows</strong></summary>
</details>

<details>
<summary><strong>Linux/MacOS/WSL</strong></summary>

In your terminal, run `ssh-keygen`

This will generate two files: `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`.
</details>

## Adding it to GitHub

Copy the contents of the `id_rsa.pub` file and go to the [SSH and GPG keys](https://github.com/settings/keys) GitHub
settings page. Click the green "New SSH key" button, paste the file contents in the big text box, and click "Add SSH
key".

> [!WARNING]
> Ensure you copy the right file. `id_rsa` is a private key, never meant to be shared with anyone, unlike `id_rsa.pub`.

## Configuring Git

You can configure Git both locally and globally. Locally meaning your configuration only applies to a specific
directory (i.e. project), or globally for all directories. Local configuration overrides global configuration.

## Further reading

Want to git gud to become a git god?
