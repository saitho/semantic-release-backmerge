import lodash from 'lodash';
const {isNil} = lodash;
import {Config} from "../definitions/config.js";

export function resolveConfig(config: Partial<Config>): Config {
    const {backmergeBranches, backmergeStrategy, plugins, message, forcePush, skipPipeline, allowSameBranchMerge, clearWorkspace, restoreWorkspace, mergeMode, fastForwardMode} = config
    return {
        backmergeBranches: isNil(backmergeBranches) ? ['develop'] : backmergeBranches,
        backmergeStrategy: isNil(backmergeStrategy) ? 'rebase' : backmergeStrategy,
        plugins: isNil(plugins) ? [] : plugins,
        message: isNil(message) ? `chore(release): Preparations for next release [skip ci]` : message,
        forcePush: isNil(forcePush) ? false : forcePush,
        skipPipeline: isNil(skipPipeline) ? true : skipPipeline,
        allowSameBranchMerge: isNil(allowSameBranchMerge) ? false : allowSameBranchMerge,
        clearWorkspace: isNil(clearWorkspace) ? false : clearWorkspace,
        restoreWorkspace: isNil(restoreWorkspace) ? false : restoreWorkspace,
        mergeMode: isNil(mergeMode) ? 'none' : mergeMode,
        fastForwardMode: isNil(fastForwardMode) ? 'none' : fastForwardMode,
    };
}
