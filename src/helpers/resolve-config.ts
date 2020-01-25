import {isNil} from 'lodash';

export function resolveConfig({branchName}) {
    return {
        branchName: isNil(branchName) ? 'develop' : branchName
    };
}