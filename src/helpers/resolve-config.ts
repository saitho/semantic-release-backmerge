import {isNil} from 'lodash';
import {Config} from "../definitions/config";

export function resolveConfig(config: Partial<Config>): Config {
    const {branchName, backmergeStrategy, plugins, message, forcePush, allowSameBranchMerge, clearWorkspace, restoreWorkspace} = config
    return {
        branchName: isNil(branchName) ? 'develop' : branchName,
        backmergeStrategy: isNil(backmergeStrategy) ? 'rebase' : backmergeStrategy,
        plugins: isNil(plugins) ? [] : plugins,
        message: message,
        forcePush: isNil(forcePush) ? false : forcePush,
        allowSameBranchMerge: isNil(allowSameBranchMerge) ? false : allowSameBranchMerge,
        clearWorkspace: isNil(clearWorkspace) ? false : clearWorkspace,
        restoreWorkspace: isNil(restoreWorkspace) ? false : restoreWorkspace
    };
}
