import lodash from 'lodash';
const {isNil} = lodash;
import {Config} from "../definitions/config.js";

export function resolveConfig(config: Partial<Config>): Config {
    let {branches, backmergeBranches, backmergeStrategy, plugins, message, forcePush, allowSameBranchMerge, clearWorkspace, restoreWorkspace, mergeMode} = config
    if (isNil(branches)) {
        backmergeBranches = isNil(backmergeBranches) ? ['develop'] : backmergeBranches;
    }
    return {
        branches: branches,
        backmergeBranches: backmergeBranches,
        backmergeStrategy: isNil(backmergeStrategy) ? 'rebase' : backmergeStrategy,
        plugins: isNil(plugins) ? [] : plugins,
        message: isNil(message) ? `chore(release): Preparations for next release [skip ci]` : message,
        forcePush: isNil(forcePush) ? false : forcePush,
        allowSameBranchMerge: isNil(allowSameBranchMerge) ? false : allowSameBranchMerge,
        clearWorkspace: isNil(clearWorkspace) ? false : clearWorkspace,
        restoreWorkspace: isNil(restoreWorkspace) ? false : restoreWorkspace,
        mergeMode: isNil(mergeMode) ? 'none' : mergeMode,
    };
}
