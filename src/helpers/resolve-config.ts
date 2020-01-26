import {isNil} from 'lodash';

export function resolveConfig({branchName, message, plugins}) {
    return {
        branchName: isNil(branchName) ? 'develop' : branchName,
        plugins: isNil(plugins) ? [] : plugins,
        message: message
    };
}