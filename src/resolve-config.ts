import {isNil} from 'lodash';
import * as resolveGitConfig from '@semantic-release/git/lib/resolve-config';

export function resolveConfig({assets, message, branchName}) {
    const object = resolveGitConfig({assets, message});
    object.branchName = isNil(branchName) ? 'develop' : branchName;
    return object;
}