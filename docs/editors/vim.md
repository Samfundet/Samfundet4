[**&larr; Back: Getting started**](../introduction.md)

# Vim setup

This guide hasn't been written yet. Maybe you want to? :-)

# Neovim setup

The main issue is to get Pyright to recognize the project dependencies and disable all the annoying lsp and linting messages.

## Prerequisites

Ensure you have uv, npm and yarn installed on your machine.

You will need Pyright, Ruff, DAP and neotest installed via your package manager (like mason for example).

For the linters install mypy and stylelint.

_Example_

```
:MasonInstall mypy stylelint
```

Then restart your LSP:

```
:LspRestart
```

## Configuration

within the project root directory, create a pyrightconfig.json and paste the following lines:

```
{
  "extraPaths": ["backend"],
  "venvPath": "backend",
  "venv": ".venv",
  "typeCheckingMode": "off",
  "reportInvalidTypeForm": "none"
}
```

Then, in the backend/ directory generate the virtual environment and install dependencies:

```
uv sync
```

Now go into the frontend/ directory and install the dependencies with yarn:

```
yarn install
```

You might have to install tanstack specifically as well:

```
yarn add @tanstack/react-query
```
