[**&larr; Back: Documentation Overview**](../README.md#documentation-overview)

# Work methodology

1. Create an issue describing the task.
    - If you can solve the task quickly, don't spend time creating an issue, just solve it!
    - Assign the issue to someone
    - Add relevant labels
2. Create a branch for the task.
    - Desired branch name is in the format `<your name>/<title>`
    - You may include the issue number in the branch title if you wish
    - Example: `bob/125-fix-button-bug`
    - Branch names should always be lowercase
3. Write code, commit, push.
    - Remember to write good commit messages, even if they'll be squashed when merging, it helps reviewers :~)
4. Create a Pull Request (PR)
5. Request review from others.
   - Tip: Post a link to the PR and tag specific people you want to review it in the #review channel on Slack
   - You should also review your own PRs with a critical eye
     - Is my PR too big? Should I split it up into multiple smaller PRs?
     - Does the PR include many unnecessary changes, such as blank line changes?
6. Never resolve threads started by others. Instead, write:
    - "Done"
    - Reasons for disagreement
    - Reasons for not fixing it (typical case: out of scope for this PR)
    - Describe how you solved the issue in an alternative way
7. Owners of any threads hit `Resolve` once they are satisfied.
8. Update and/or resolve any conflicts with the master branch.
9. Owner of the PR merges it.


# Approving pull requests

## Approving pull requests from dependabot

- [Read about](./approving-dependabot-prs.md) how to go about approving dependabot pull requests.


## Approving Web pull requests

Many of the principles for reviewing pull requests created by someone in Web are the same as those for [approving pull requests from Dependabot](./approving-dependabot-prs.md). The main goals are to avoid breaking functionality, help improve code quality, and validate that the code additions and changes are necessary and actually solve the intended issue.

This is done by reading the code, pulling the branch and manually verifying the the changes or additions are doing what they are indended to do. In some cases you might want to make temporary changes to the code to check for potential imporvements.