import lodash from 'lodash';
const {isString, isNil, isArray, isBoolean} = lodash;
import {resolveConfig} from './helpers/resolve-config.js';
import {getError} from './helpers/get-error.js';
import { Config } from './definitions/config.js';
import AggregateError from "aggregate-error"

const isNonEmptyString = (value: string) => isString(value) && value.trim();

export function verify(pluginConfig: Partial<Config>) {
    const VALIDATORS: any = {
        //branchName: isNonEmptyString,
        //branches: isArray,
        message: isNonEmptyString,
        plugins: isArray,
        forcePush: isBoolean,
    };

    const options = resolveConfig(pluginConfig);
    const reducedErrors = Object.entries(options).reduce(
        (errors: any[], [option, value]) => {
            return !isNil(value) && VALIDATORS.hasOwnProperty(option) && !VALIDATORS[option](value)
                ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
                : errors
        },
        []
    );

    if (!isNonEmptyString(pluginConfig.branchName || '') && !isArray(pluginConfig.branches)) {
        reducedErrors.push('Please specify a valid "branches" setting.')
    }

    if (reducedErrors.length > 0) {
        throw new AggregateError(reducedErrors);
    }
}
