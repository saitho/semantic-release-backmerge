# @saithodev/semantic-release-backmerge

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to back-merge a release in the project's [git](https://git-scm.com/) repository.

[![Build Status](https://travis-ci.com/saitho/semantic-release-backmerge.svg?branch=master)](https://travis-ci.com/saitho/semantic-release-backmerge)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=semantic-release-backmerge&metric=alert_status)](https://sonarcloud.io/dashboard?id=semantic-release-backmerge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

| Step               | Description                                                                                                                        |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `verifyConditions` | Verify the access to the remote Git repository, the ['branchName'](#branchName) option configuration. |
| `done`             | Create a back-merge into the configured branch if the release is successful.                                                                       |

## Install

```bash
$ npm install @saithodev/semantic-release-backmerge -D
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@saithodev/semantic-release-backmerge",
      {
        "branchName": "dev",
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

## Configuration

### Options

| Options   | Description                                                                     | Default   |
|-----------|---------------------------------------------------------------------------------|-----------|
| `branchName` | The branch where the release is merged into. See [branchName](#branchName).  | develop   |
| `plugins` | Plugins defined here may stage files to be included in a back-merge commit. See [plugins](#plugins).   |  []  |
| `message` | The message for the back-merge commit (if files were changed by plugins. See [message](#message).   | `chore(release): Preparations for next release [skip ci]`     |
| `forcePush` | If set the back-merge will be force-pushed. See [forcePush](#forcePush).   | false |

#### `branchName`

Branch name of the branch that should receive the back-merge. If none is given, the default value is used.
You may use [Lodash template](https://lodash.com/docs#template) variables here. The following variables are available:

| Parameter           | Description                                                                                                                             |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `branch`            | The branch from which the release is done.                                                                                              |
| `branch.name`       | The branch name.                                                                                                                        |
| `branch.type`       | The [type of branch](https://github.com/semantic-release/semantic-release/blob/beta/docs/usage/workflow-configuration.md#branch-types). |
| `branch.channel`    | The distribution channel on which to publish releases from this branch.                                                                 |
| `branch.range`      | The range of [semantic versions](https://semver.org) to support on this branch.                                                         |
| `branch.prerelease` | The pre-release detonation to append to [semantic versions](https://semver.org) released from this branch.                              |

#### `plugins`

Use this if you have to make changes to the files for your development branch (e.g. setting a -dev version).
It uses the same plugin structure as semantic-release, but only trigger the "success" step after rebase from develop onto master is done and just before it is pushed.

*Note:* Please make sure that the files you changed are staged to Git workspace. Only then they will be committed.

#### `message`

The message for the back-merge commit is generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter           | Description                                                                                                                             |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `branch`            | The branch from which the release is done.                                                                                              |
| `branch.name`       | The branch name.                                                                                                                        |
| `branch.type`       | The [type of branch](https://github.com/semantic-release/semantic-release/blob/beta/docs/usage/workflow-configuration.md#branch-types). |
| `branch.channel`    | The distribution channel on which to publish releases from this branch.                                                                 |
| `branch.range`      | The range of [semantic versions](https://semver.org) to support on this branch.                                                         |
| `branch.prerelease` | The pre-release detonation to append to [semantic versions](https://semver.org) released from this branch.                              |
| `lastRelease`       | `Object` with `version`, `gitTag` and `gitHead` of the last release.                                                                    |
| `nextRelease`       | `Object` with `version`, `gitTag`, `gitHead` and `notes` of the release being done.                                                     |

**Note**: It is recommended to include `[skip ci]` in the commit message to not trigger a new build. Some CI service support the `[skip ci]` keyword only in the subject of the message.

#### `forcePush`

Setting this option will force-push the commits from back-merge onto the develop branch.

**Warning:** This will override commits that are not in the develop branch, so make sure that really is what you want!
