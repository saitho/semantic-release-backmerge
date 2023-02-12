import {isString, isNil, isArray, isBoolean} from 'lodash';
import {resolveConfig} from './helpers/resolve-config';
import {getError} from './helpers/get-error';

const AggregateError = require('aggregate-error');
const isNonEmptyString = (value) => isString(value) && value.trim();

export function verify(pluginConfig) {
    const VALIDATORS = {
        branchName: isNonEmptyString,
        backmergeBranches: isArray,
        message: isNonEmptyString,
        plugins: isArray,
        forcePush: isBoolean,
    };

    const options = resolveConfig(pluginConfig);
    const reducedErrors = Object.entries(options).reduce(
        (errors, [option, value]) =>
            !isNil(value) && VALIDATORS.hasOwnProperty(option) && !VALIDATORS[option](value)
                ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
                : errors,
        []
    );

    if (reducedErrors.length > 0) {
        throw new AggregateError(reducedErrors);
    }
}
