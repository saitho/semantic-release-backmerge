# @saithodev/semantic-release-backmerge

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to back-merge a release in the project's [git](https://git-scm.com/) repository.

**Note:** semantic-release in its core is not intended to be used with Git Flow where a stable (`master`/`main`) branch and a unstable branch (`develop`/`next`) exist. This plugin enables to use semantic-release with such branches, however it does NOT guarantee using semantic-release with Git Flow.

Especially automatic hotfix releases may not be possible as those usually lead to merge conflicts with develop that have to be resolved manually.
In such cases the release workflow will fail, causing a red pipeline!

[![Build Status](https://travis-ci.com/saitho/semantic-release-backmerge.svg?branch=master)](https://travis-ci.com/saitho/semantic-release-backmerge)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=semantic-release-backmerge&metric=alert_status)](https://sonarcloud.io/dashboard?id=semantic-release-backmerge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

| Step               | Description                                                                                                |
|--------------------|------------------------------------------------------------------------------------------------------------|
| `verifyConditions` | Verify the access to the remote Git repository, the ['backmergeBranches'](#backmergeBranches) option configuration. |
| `done`             | Create a back-merge into the configured branch if the release is successful.                               |

## Install

```bash
$ npm install @saithodev/semantic-release-backmerge -D
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

**Note:** As this plugin will rebase your "develop" branch onto your "master" branch, you may not have any unstaged files in your workspace.
If you do, you may set the [clearWorkspace](#clearWorkspace) option to stash them and restore them with [restoreWorkspace](#restoreWorkspace) if needed.

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@saithodev/semantic-release-backmerge",
      {
        "backmergeBranches": ["dev"],
        "plugins": [
          [
            "@semantic-release/exec",
            {
              "successCmd": "echo 'Version in master is ${nextRelease.version}' > test.txt && git add test.txt"
            }
          ]
        ]
      }
    ]
  ]
}
```

### Jenkins

If you're using Jenkins, you may need to set the username and password for Git as below (see [#12](https://github.com/saitho/semantic-release-backmerge/issues/12)):

```jenkinsfile
withCredentials([usernamePassword(credentialsId: JENKINS_GIT_CREDENTIALS_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
    sh("git config credential.username ${GIT_USERNAME}")
    sh("git config credential.helper '!f() { echo password=$GIT_PASSWORD; }; f'")
}
withCredentials([usernameColonPassword(credentialsId: JENKINS_GIT_CREDENTIALS_ID, variable: 'GIT_CREDENTIALS')]) {
    nodejs(JENKINS_NODE_JS_INSTALLATION_LABEL) {
        sh("npx semantic-release")
    }
}
```

### Backmerging into protected branches

You can backmerge into protected branches if repository admins/owners are allowed to do that.
Make sure to provide an admin/owner's access token or credentials (e.g. via `GITHUB_TOKEN`).

**For GitHub Actions** you also need to disable `persist-credentials` in the checkout action:
```yaml
- uses: actions/checkout@v2
  with:
    persist-credentials: false
```
The personal access token in `GITHUB_TOKEN` needs access to the `repo` scope.

## Configuration

### Options

| Options   | Description                                                                     | Default   |
|-----------|---------------------------------------------------------------------------------|-----------|
| `backmergeBranches` | The branches where the release is merged into. See [backmergeBranches](#backmergeBranches).  | ['develop']   |
| `backmergeStrategy` | How to perform the backmerge. See [backmergeStrategy](#backmergeStrategy).  | rebase   |
| `plugins` | Plugins defined here may stage files to be included in a back-merge commit. See [plugins](#plugins).   |  []  |
| `message` | The message for the back-merge commit (if files were changed by plugins. See [message](#message).   | `chore(release): Preparations for next release [skip ci]`     |
| `forcePush` | If set the back-merge will be force-pushed. See [forcePush](#forcePush).   | false |
| `skipPipeline` | If set the back-merge will run with the `-o ci.skip` flag to skip the CI/CD pipeline See [skipPipeline](#skipPipeline).   | false |
| `clearWorkspace` | Whether to stash the current workspace before backmerge. See [clearWorkspace](#clearWorkspace).   | false |
| `restoreWorkspace` | Restore the stashed workspace after backmerge completed. See [restoreWorkspace](#restoreWorkspace).   | false |
| `mergeMode` | Mode for merging (when `backmergeStrategy=merge`). See [mergeMode](#mergeMode).   | none |
| `fastForwardMode` | Fast forwarding option for merging (when `backmergeStrategy=merge`). See [fastForwardMode](#fastForwardMode).   | none |

#### `backmergeBranches`

Branch names that should receive the back-merge. If none is given, the default value is used.
This argument takes a list of branch name strings or objects. A branch object looks like this:
`{from: "master", to: "dev"}`
In this example, a release from `master` branch is merged into `dev` branch. With that you can perform conditional backmerges,
i.e. backmerges that only occur when merged from a certain branch.

Here is an example where all releases will backmerge into `develop` and releases from `next` branch will be backmerged into `staging` as well.

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@saithodev/semantic-release-backmerge",
      {
        "backmergeBranches": ["develop", {"from": "next", "to": "staging"}]
      }
    ]
  ]
}
```

You may use [Lodash template](https://lodash.com/docs#template) variables in branch name strings. The following variables are available:

| Parameter           | Description                                                                                                                             |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `branch`            | The branch from which the release is done.                                                                                              |
| `branch.name`       | The branch name.                                                                                                                        |
| `branch.type`       | The [type of branch](https://github.com/semantic-release/semantic-release/blob/beta/docs/usage/workflow-configuration.md#branch-types). |
| `branch.channel`    | The distribution channel on which to publish releases from this branch.                                                                 |
| `branch.range`      | The range of [semantic versions](https://semver.org) to support on this branch.                                                         |
| `branch.prerelease` | The prerelease detonation to append to [semantic versions](https://semver.org) released from this branch.                              |

#### `plugins`

Use this if you have to make changes to the files for your development branch (e.g. setting a -dev version).
It uses the same plugin structure as semantic-release, but only trigger the "success" step after rebase from develop onto master is done and just before it is pushed.

*Note:* Please make sure that the files you changed are staged to Git workspace. Only then they will be committed.

#### `message`

The message for the back-merge commit is generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter           | Description                                                                                                                            |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `branch`            | The branch from which the release is done.                                                                                             |
| `branch.name`       | The branch name.                                                                                                                       |
| `branch.type`       | The [type of branch](https://github.com/semantic-release/semantic-release/blob/beta/docs/usage/workflow-configuration.md#branch-types). |
| `branch.channel`    | The distribution channel on which to publish releases from this branch.                                                                |
| `branch.range`      | The range of [semantic versions](https://semver.org) to support on this branch.                                                        |
| `branch.prerelease` | The prerelease detonation to append to [semantic versions](https://semver.org) released from this branch.                              |
| `lastRelease`       | `Object` with `version`, `gitTag` and `gitHead` of the last release.                                                                   |
| `nextRelease`       | `Object` with `version`, `gitTag`, `gitHead` and `notes` of the release being done.                                                    |

#### `allowSameBranchMerge`

If you want to be able to back-merge into the same branch as the branch that was being released from, enable this setting.

**Note**: It is recommended to include `[skip ci]` in the commit message to not trigger a new build. Some CI service support the `[skip ci]` keyword only in the subject of the message.

#### `forcePush`

Setting this option will force-push the commits from back-merge onto the develop branch.

**Warning:** This will override commits that are not in the develop branch, so make sure that really is what you want!

#### `skipPipeline`

Setting this option will skip the CI/CD pipeline on the target branch of the back-merge.

#### `clearWorkspace`

Setting this option will stash all uncommitted changes from Git workspace before attempting rebase.

#### `restoreWorkspace`

Setting this option will restore the stashed changes after the backmerge completed.

#### `backmergeStrategy`

This setting will determine whether the _develop_ branch should be rebased onto _master_ or _master_ should be merged into _develop_.
Allowed values: rebase (default), merge

#### `mergeMode`

This setting will be used to determine how merge conflicts are resolved when using the `merge` backmerge strategy.

Allowed values: none (default), ours, theirs

none = no merge conflict resolve (process will abort on merge conflicts!)

ours = apply changes from _develop_ branch

theirs = apply changes from _master_ branch

#### `fastForwardMode`

This setting will be used to determine the fast forwarding strategy when using the `merge` backmerge strategy.

Allowed values: none (default), ff, no-ff, ff-only

none = default setting which is the same as ff.

ff = when possible resolve the merge as a fast-forward (only update the branch pointer to match the merged branch; do not create a merge commit). When not possible (when the merged-in history is not a descendant of the current history), create a merge commit.

no-ff = create a merge commit in all cases, even when the merge could instead be resolved as a fast-forward.

ff-only = resolve the merge as a fast-forward when possible. When not possible, refuse to merge and exit with a non-zero status.
