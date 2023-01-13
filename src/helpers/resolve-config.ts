import lodash from 'lodash';
const {isNil} = lodash;
import {Config} from "../definitions/config.js";

export function resolveConfig(config: Partial<Config>): Config {
    const {branchName, branches, backmergeStrategy, plugins, message, forcePush, allowSameBranchMerge, clearWorkspace, restoreWorkspace, mergeMode} = config
    return {
        // @deprecated branchName – todo: remove with next major release
        branchName: isNil(branchName) ? '' : branchName,
        branches: isNil(branches) ? ['develop'] : branches,
        backmergeStrategy: isNil(backmergeStrategy) ? 'rebase' : backmergeStrategy,
        plugins: isNil(plugins) ? [] : plugins,
        message: message || '',
        forcePush: isNil(forcePush) ? false : forcePush,
        allowSameBranchMerge: isNil(allowSameBranchMerge) ? false : allowSameBranchMerge,
        clearWorkspace: isNil(clearWorkspace) ? false : clearWorkspace,
        restoreWorkspace: isNil(restoreWorkspace) ? false : restoreWorkspace,
        mergeMode: isNil(mergeMode) ? 'none' : mergeMode,
    };
}
