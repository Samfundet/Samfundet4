[**&larr; Back: Getting started**](../introduction.md)

# Installing on Windows (Docker in WSL)

> [!NOTE]
> We do not recommend running the project this way. This is essentially running nested virtualization, which will lead
> to poor performance. Prefer running [directly in WSL](./windows-wsl.md).

## Install WSL

To run the project in WSL, you obviousy first need WSL.
Follow [this guide](https://learn.microsoft.com/en-us/windows/wsl/install) by Microsoft. The main step is running the
following in an administrator PowerShell or command prompt:

```shell
wsl --install
```

## Install Docker

Next, install docker. Follow [this guide](https://docs.docker.com/desktop/install/windows-install/).
