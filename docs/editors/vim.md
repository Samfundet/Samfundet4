[**&larr; Back: Getting started**](../introduction.md)

# Vim setup

This guide hasn't been written yet. Maybe you want to? :-)

# Neovim setup

Depending on you package manager and general setup this may differ. Just ensure pyright and ruff and vstls is installed via mason or your package manager of choice.

You might have to add the following to the pyproject.toml file:

```
[tool.pyright]
include = ["samfundet"]

exclude = [
"**/**pycache**",
"**/migrations",
".venv",
"venv",
"node_modules",
"dist",
"build",
"database",
"logs",
"diagrams",
]

typeCheckingMode = "off" # Change to "strict" if you want stricter checks

venvPath = "."
venv = ".venv"

stubPath = "stubs"

reportImplicitOverride = "none"
reportGeneralTypeIssues = "none"

useLibraryCodeForTypes = true

reportMissingImports = false
reportOptionalSubscript = false
reportOptionalCall = false

[tool.pyright.strict]
"samfundet/management/commands/_" = true
"samfundet/api/_" = true
"samfundet/core/\*" = true

[tool.pyright.report]
reportUnnecessaryTypeIgnoreComment = "none"
reportUnnecessaryCast = "none"
reportUnnecessaryIsInstance = "none"
reportUnusedImport = "warning"
reportUnusedVariable = "warning"
reportUntypedFunctionDecorator = "none"
reportCallInDefaultInitializer = "none"

```
