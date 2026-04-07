# Approving Dependabot Pull Requests

Dependabot suggests packages/dependencies which need to be updated. When there is no production environment to consider, it is advantageous to update packages often so that one avoids using old versions of dependencies when we are eventually going to deploy to production.
> When in production, packages and dependency upgrades require greater care and consideration.

When approving dependabot pull requests and merging them, the main goal is to NOT break master in a major way for other developers. It is time-consuming to check that every little dependency upgrade does not break any of our code. If you follow these tips and steps, the pull request should be good to approve and merge.

## Tips:

- Generally, to SAVE TIME you should check and approve dependabot pull requests in the order of when the last one was merged. That is; approve and merge a dependabot pull request, then go on to the next one.

- You will save time by running the pipeline and merging up to date master into the dependabot branch (change branch) locally. That is; not doing it in GitHub.

- Tell Web when you approve and merge dependabot pull requests so that they can rebuild their docker instance after they pull from the new version of the master branch.

- If there are major version changes (e.g., Django 5.2 --> 5.3, not Django 5.2.2 --> 5.2.4) one should take greater care when checking the pull request.

- Dependabot tells you if the dependency is a frontend or backend dependency. 

- Check what parts of the dependency/package code are being affected by the upgrade. This is described in the pull request description.

- Package version upgrades are created by the package developer teams in such a way that they don't break projects using recent versions of the package, therefore upgrading often is a good strategy for avoiding that package upgrades come with a lot of work fixing problems in our code as a consequence of extensive changes.

## 1) Make sure that the change branch is up to date with the base branch (master)

Checkout the change branch locally and merge the most current branch into local master.

*You can also do this by checking that the branch does not need to be updated through GitHub. GitHub shows you this close to where you find the button for merging pull requests*

> The GitHub pipeline requires that the change branch is up to date with the base branch (master), but there is also a problem where it seems like dependabot does not have permission to deploy to Chromatic instances. This problem can be resolved by updating the change branch (we have permissions to deploy Chromatic instances).

## 2) Make sure that the changes do not break Samfundet4

When approving dependabot pull requests you need to make sure that upgrading does not break any of our current codebase. This can happen if there are major changes in the package code.

You can make sure that the changes do not break Samfundet4 by:

1) Checking that the dependabot pull request passes our GitHub pipeline
> You can run pipeline commands in Docker. See these commands [here](./docker-project-specific-commands.md).
> ```pipeline``` is most useful. You will have to run frontend commands one by one separately.

2) Checkout the change branch localy

3) Run `docker compose up --build` to build your local Samfundet4 instance with the updated dependencies.

4) Checking that generally Samfundet4 runs as expected

5) Check Samfundet4 functionality which specifically uses the dependency that is being upgraded

###### How to check usage of specific dependencies:

Dependabot makes changes in one or multiple of these files:

```
frontend/package.json
frontend/yarn.lock

backend/poetry.lock
backend/pyproject.toml
```

These changes will highlight what dependency is being upgraded and maybe if there are "sub packages" being upgraded. With this information you can find which parts of the Samfundet4 codebase that rely on the dependency. You can see examples further down in this document.

Search for the dependency name in Samfundet4 and check manually that the Samfundet4 functionality works as expected.

> ⚠️ In a lot of cases it is not possible to find direct usage of dependencies and packages in the high-level codebase of Samfundet4. In cases where you don't find direct usage you will have to get familiar with what the dependency/package does and manually test Samfundet4 functionality that you think probably rely on the dependency/package.

Most dependencies/packages have multiple different functions we are using, so if you want to be extra diligent you should check parts of Samfundet4 functionality that rely on different distinct functions of the dependency/package. *For example, in case tanstack is being upgraded and we use `useQuery` and `useMutation`*. When being this diligent you should check what parts of the dependency/package code are being affected by the upgrade (see tips).

> Checking that it works as expected can in some cases be challenging because some parts of Samfundet4 are broken because of our code and not the dependency code.

## 3) Approve 

If you think you have done a good job verifying that the dependency upgrade does not break anything, and you feel you understand what parts of Samfundet4 the upgrade has an effect on, you are ready to approve the pull request.

If you are unsure about whether the pull request should be merged (maybe because there is a large difference in version number), then you should ask anyone with more experience for help.

Remember; in development nothing bad can really happen. The worst thing that can happen is other developers are affected by a broken master branch. This is in most cases fairly quick to fix. You can't break important stuff like event sales by merging into a development branch.

# Interpreting exactly what dependency/package is being upgraded:

**The diff file in `frontend/yarn.lock` of a pull request created by dependabot might look something like this:**

```
"form-data@npm:^4.0.0, form-data@npm:~4.0.0":
  - version: 4.0.2
  - resolution: "form-data@npm:4.0.2"
  + version: 4.0.4
  + resolution: "form-data@npm:4.0.4"
  dependencies:
    asynckit: "npm:^0.4.0"
    combined-stream: "npm:^1.0.8"
    es-set-tostringtag: "npm:^2.1.0"
  +  hasown: "npm:^2.0.2"
    mime-types: "npm:^2.1.12"
  - checksum: 10c0/e534b0cf025c831a0929bf4b9bbe1a9a6b03e273a8161f9947286b9b13bf8fb279c6944aae0070c4c311100c6d6dbb815cd955dc217728caf73fad8dc5b8ee9c
  + checksum: 10c0/373525a9a034b9d57073e55eab79e501a714ffac02e7a9b01be1c820780652b16e4101819785e1e18f8d98f0aee866cc654d660a435c378e16a72f2e7cac9695
  languageName: node
  linkType: hard
```

In the example above (from [this PR](https://github.com/Samfundet/Samfundet4/pull/1907)) the "form-data@npm" package is being upgraded from 4.0.2 to 4.0.4. In the case of "form-data@npm" there is no place in Samfundet4 where "form-data@npm" is being used directly. The package is being used indirectly through `@cypress/request@npm` and another dependency `axios@npm`. So to check what parts of Samfundet4 are using "form-data@npm" one would check what parts are using `@cypress/request@npm` and/or `axios@npm`.

In other cases, let's say if `axios@npm` is being upgraded, we might be using the dependency directly.

**A diff file in `frontend/package.json` of a pull request created by dependabot might look something like this:**

In [this PR](https://github.com/Samfundet/Samfundet4/pull/1889/files) react-markdown is being upgraded. This is a dependency we are using directly [(here)](https://github.com/Samfundet/Samfundet4/blob/dd72442032fa460e35e30fcc1976854a0ed17e7f/frontend/src/Components/SamfMarkdown/SamfMarkdown.tsx).

Whether `package.json` gets updated depends on if the dependency is direct or indirect, and for direct dependencies, whether the new version satisfies the existing version constraint.

Indirect dependency (never updates package.json):

form-data: 4.0.2 → 5.0.0 (huge jump) → only yarn.lock changes
form-data: 4.0.2 → 4.0.3 (tiny jump) → only yarn.lock changes

Direct dependency (depends on constraint):

"react": "^18.0.0" and 18.2.1 → 18.3.0 → only yarn.lock changes (satisfies ^18.0.0)

"react": "^18.0.0" and 18.2.1 → 19.0.0 → both files change (doesn't satisfy ^18.0.0)

"react": "~18.2.0" and 18.2.1 → 18.3.0 → both files change (doesn't satisfy ~18.2.0)


**A diff file in `backend/poetry.lock` of a pull request created by dependabot might look something like this:**

The package being upgraded in
[this PR](https://github.com/Samfundet/Samfundet4/pull/1898/files)
is "urllib3". This is a small upgrade and does not affect `pyproject.toml`. 
```
[[package]]
name = "urllib3"
- version = "2.4.0"
+ version = "2.5.0"
description = "HTTP library with thread-safe connection pooling, file post, and more."
optional = false
python-versions = ">=3.9"
groups = ["dev"]
files = [
-    {file = "urllib3-2.4.0-py3-none-any.whl", hash = "sha256:4e16665048960a0900c702d4a66415956a584919c03361cac9f1df5c5dd7e813"},
-    {file = "urllib3-2.4.0.tar.gz", hash = "sha256:414bc6535b787febd7567804cc015fee39daab8ad86268f1310a9250697de466"},
+    {file = "urllib3-2.5.0-py3-none-any.whl", hash = "sha256:e6b01673c0fa6a13e374b50871808eb3bf7046c4b125b216f6bf1cc604cff0dc"},
+    {file = "urllib3-2.5.0.tar.gz", hash = "sha256:3fc47733c7e419d4bc3f6b3dc2b4f890bb743906a30d56ba4a5bfa4bbff92760"},
]
```

**A diff file in `backend/pyproject.toml` of a pull request created by dependabot might look something like this:**

The package upgrade in [this PR](https://github.com/Samfundet/Samfundet4/pull/1910/files) is a somewhat large upgrade, where Django is being upgraded from 5.1.9 to 5.2.4. This affects the whole backend, but as long as we make sure to check, approve and merge (upgrade) package versions regularly there is a low chance for the backend to break.

Whether `pyproject.toml` gets updated depends on if the dependency is direct or indirect, and for direct dependencies, whether the new version satisfies the existing version constraint.