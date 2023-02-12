# [2.2.0](https://github.com/saitho/semantic-release-backmerge/compare/v2.1.3...v2.2.0) (2023-02-12)


### Bug Fixes

* message default value ([4ada405](https://github.com/saitho/semantic-release-backmerge/commit/4ada4059c2f98f0a5e40f533f546951eebf18b25))


### Features

* rename "branches" to "backmergeBranches" ([3c16d6a](https://github.com/saitho/semantic-release-backmerge/commit/3c16d6aa4c8a44356930bfade80b2d530c0ba0d4))

## [2.1.3](https://github.com/saitho/semantic-release-backmerge/compare/v2.1.2...v2.1.3) (2023-01-11)


### Bug Fixes

* limit to semantic-release below 20.0.0 ([4dbca4a](https://github.com/saitho/semantic-release-backmerge/commit/4dbca4a24b51c238ebc1ec613af656725e09739a))
* update dev-dependencies ([3771228](https://github.com/saitho/semantic-release-backmerge/commit/3771228bb856089682c70773784f175cdf4367d3))

## [2.1.2](https://github.com/saitho/semantic-release-backmerge/compare/v2.1.1...v2.1.2) (2022-03-01)


### Bug Fixes

* abort process when encountering unrecoverable error ([#33](https://github.com/saitho/semantic-release-backmerge/issues/33)) ([5e9b60c](https://github.com/saitho/semantic-release-backmerge/commit/5e9b60ccb23a2018d9c0699ea10a01e588c53f73))

## [2.1.1](https://github.com/saitho/semantic-release-backmerge/compare/v2.1.0...v2.1.1) (2022-02-19)


### Bug Fixes

* improve logging ([#31](https://github.com/saitho/semantic-release-backmerge/issues/31)) ([e5a04d7](https://github.com/saitho/semantic-release-backmerge/commit/e5a04d7d5f081f395c7994a434f04b7f7d6eba4e))

# [2.1.0](https://github.com/saitho/semantic-release-backmerge/compare/v2.0.0...v2.1.0) (2021-11-01)


### Features

* add `branches` setting ([70d4c4f](https://github.com/saitho/semantic-release-backmerge/commit/70d4c4fae2b3e7394dd66ee86afa9270c9ffa7e3))
* multi-branch and conditional backmerges ([5df3ec3](https://github.com/saitho/semantic-release-backmerge/commit/5df3ec389ba504e17e70059db6508b8b97cbb279))

# [2.0.0](https://github.com/saitho/semantic-release-backmerge/compare/v1.5.3...v2.0.0) (2021-10-22)


### Bug Fixes

* use Git auth URL for pushing ([#27](https://github.com/saitho/semantic-release-backmerge/issues/27)) ([9b76e14](https://github.com/saitho/semantic-release-backmerge/commit/9b76e14ed01068732230d0c1bca066da2761e5aa))


### chore

* require semantic-release >=13.0.0 ([13288a4](https://github.com/saitho/semantic-release-backmerge/commit/13288a405d820e4cbea536a297c7a173cc5f3719))


### BREAKING CHANGES

* semantic-release >=13.0.0 is set as minimum
dependency to use this plugin.

## [1.5.3](https://github.com/saitho/semantic-release-backmerge/compare/v1.5.2...v1.5.3) (2021-07-20)


### Bug Fixes

* **git:** fix -X option ([0865f6e](https://github.com/saitho/semantic-release-backmerge/commit/0865f6e3e659b4f7ff0fb07e4e0b7dc201824bd0))

## [1.5.2](https://github.com/saitho/semantic-release-backmerge/compare/v1.5.1...v1.5.2) (2021-07-18)


### Bug Fixes

* checkout with -B ([#21](https://github.com/saitho/semantic-release-backmerge/issues/21)) ([d695ad4](https://github.com/saitho/semantic-release-backmerge/commit/d695ad47cfae17793db8f5f489904417819a7e84))

## [1.5.1](https://github.com/saitho/semantic-release-backmerge/compare/v1.5.0...v1.5.1) (2021-07-06)


### Bug Fixes

* use repository url from semantic release config ([f4cd9b4](https://github.com/saitho/semantic-release-backmerge/commit/f4cd9b4a894d4d162d2babfc09299567e3f14896))

# [1.5.0](https://github.com/saitho/semantic-release-backmerge/compare/v1.4.2...v1.5.0) (2021-06-27)


### Features

* add merge mode ([#13](https://github.com/saitho/semantic-release-backmerge/issues/13)) ([c58f040](https://github.com/saitho/semantic-release-backmerge/commit/c58f0405829a224435383fc84dead29937cc4210))

## [1.4.2](https://github.com/saitho/semantic-release-backmerge/compare/v1.4.1...v1.4.2) (2021-04-12)


### Bug Fixes

* **revert:** reverts "fix: fetch repository with URL" ([#16](https://github.com/saitho/semantic-release-backmerge/issues/16)) ([e470e7a](https://github.com/saitho/semantic-release-backmerge/commit/e470e7a75b86e330d773eaa81d7870d901780208))

## [1.4.1](https://github.com/saitho/semantic-release-backmerge/compare/v1.4.0...v1.4.1) (2021-04-09)


### Bug Fixes

* fetch repository with URL ([#12](https://github.com/saitho/semantic-release-backmerge/issues/12)) ([2efae25](https://github.com/saitho/semantic-release-backmerge/commit/2efae257d431680bdcaf3cedaf85e1832e107ee0))

# [1.4.0](https://github.com/saitho/semantic-release-backmerge/compare/v1.3.0...v1.4.0) (2021-03-25)


### Features

* configure backmerge strategy ([7098421](https://github.com/saitho/semantic-release-backmerge/commit/709842180f3eb742d68984fb6b1725bcab10b55b))

# [1.3.0](https://github.com/saitho/semantic-release-backmerge/compare/v1.2.1...v1.3.0) (2021-03-25)


### Features

* add options to clear and restore workspace ([9bd009b](https://github.com/saitho/semantic-release-backmerge/commit/9bd009be3eaed6a36cba69df7a02487bbdafd7ba))

## [1.2.1](https://github.com/saitho/semantic-release-backmerge/compare/v1.2.0...v1.2.1) (2021-01-01)


### Bug Fixes

* add setting allowSameBranchMerge ([#6](https://github.com/saitho/semantic-release-backmerge/issues/6)) ([138abb5](https://github.com/saitho/semantic-release-backmerge/commit/138abb52e1f68e8fb98cfa7a96da9348a1eb0fa0))

# [1.2.0](https://github.com/saitho/semantic-release-backmerge/compare/v1.1.3...v1.2.0) (2020-09-19)


### Bug Fixes

* make full branch object available to message template ([b63d597](https://github.com/saitho/semantic-release-backmerge/commit/b63d5971d26753e21fc454be85c2c5a3202b43ee))


### Features

* allow merging back into the original branch ([639ed4a](https://github.com/saitho/semantic-release-backmerge/commit/639ed4a704c5f86f81f5170fa6271a68ad9e8215))
* allow using branch variables in branch name option ([#5](https://github.com/saitho/semantic-release-backmerge/issues/5)) ([f3d1caa](https://github.com/saitho/semantic-release-backmerge/commit/f3d1caad79618ca1e21259f526427dd8d041d179))

## [1.1.3](https://github.com/saitho/semantic-release-backmerge/compare/v1.1.2...v1.1.3) (2020-07-30)


### Bug Fixes

* **deps:** update lodash and execa to latest versions ([be58ece](https://github.com/saitho/semantic-release-backmerge/commit/be58ecea51216a24fb599967183056eb75938d55))
