# @saithodev/semantic-release-backmerge

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to back-merge a release in the project's [git](https://git-scm.com/) repository.

[![Build Status](https://travis-ci.com/saitho/semantic-release-backmerge.svg?branch=master)](https://travis-ci.com/saitho/semantic-release-backmerge)
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
    ["@saithodev/semantic-release-backmerge", {
      "branchName": "dev"
    }]
  ]
}
```

## Configuration

### Options

| Options   | Description                                                                     | Default   |
|-----------|---------------------------------------------------------------------------------|-----------|
| `branchName` | The branch where the release is merged into. See [branchName](#branchName).  | develop   |

#### `branchName`

Branch name of the branch that should receive the back-merge. If none is given, the default value is used.