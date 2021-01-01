import {isNil} from 'lodash';

export function resolveConfig({branchName, message, plugins, forcePush, allowSameBranchMerge}) {
    return {
        branchName: isNil(branchName) ? 'develop' : branchName,
        plugins: isNil(plugins) ? [] : plugins,
        message: message,
        forcePush: isNil(forcePush) ? false : forcePush,
        allowSameBranchMerge: isNil(allowSameBranchMerge) ? false : allowSameBranchMerge
    };
}
