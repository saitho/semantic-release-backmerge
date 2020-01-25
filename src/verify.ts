import {isString, isNil} from 'lodash';
import * as verifyGit from '@semantic-release/git/lib/verify';
import {resolveConfig} from './resolve-config';
import {getError} from './get-error';

const AggregateError = require('aggregate-error');
const isNonEmptyString = (value) => isString(value) && value.trim();

export function verify(pluginConfig) {
    // Verify Git plugin settings
    verifyGit(pluginConfig);

    const VALIDATORS = {
        branchName: isNonEmptyString,
    };

    const options = resolveConfig(pluginConfig);
    const errors = Object.entries(options).reduce(
        (errors, [option, value]) =>
            !isNil(value) && VALIDATORS.hasOwnProperty(option) && !VALIDATORS[option](value)
                ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
                : errors,
        []
    );

    if (errors.length > 0) {
        throw new AggregateError(errors);
    }
}