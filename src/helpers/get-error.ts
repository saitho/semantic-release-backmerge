import SemanticReleaseError from '@semantic-release/error';
import {ERROR_DEFINITIONS} from '../definitions/errors.js';

export function getError(code: string, ctx: { [x: string]: any; }) {
    // @ts-ignore
    const {message, details} = ERROR_DEFINITIONS[code](ctx);
    return new SemanticReleaseError(message, code, details);
}