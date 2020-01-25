import {isString, isNil} from 'lodash';
import {resolveConfig} from './helpers/resolve-config';
import {getError} from './helpers/get-error';

const AggregateError = require('aggregate-error');
const isNonEmptyString = (value) => isString(value) && value.trim();

export function verify(pluginConfig) {
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