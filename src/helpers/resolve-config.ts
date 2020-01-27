import {isNil} from 'lodash';

export function resolveConfig({branchName, message, plugins, forcePush}) {
    return {
        branchName: isNil(branchName) ? 'develop' : branchName,
        plugins: isNil(plugins) ? [] : plugins,
        message: message,
        forcePush: isNil(forcePush) ? false : forcePush,
    };
}