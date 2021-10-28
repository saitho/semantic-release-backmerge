const pkg = require('../../package.json');

const [homepage] = pkg.homepage.split('#');
const linkify = file => `${homepage}/blob/master/${file}`;

export const ERROR_DEFINITIONS = {
    EINVALIDBRANCHNAME: ({branchName}) => ({
        message: 'Invalid `branchName` option.',
        details: `The [branchName option](${linkify(
            'README.md#branchName'
        )}) option must be a \`String\`. Your configuration for the \`branchName\` option is \`${branchName}\`.`,
    }),
    EINVALIDBRANCHES: ({branches}) => ({
        message: 'Invalid `branches` option.',
        details: `The [branches option](${linkify(
            'README.md#branches'
        )}) option must be an \`Array\`. Your configuration for the \`branches\` option is \`${branches}\`.`,
    }),
    EINVALIDMESSAGE: ({message}) => ({
        message: 'Invalid `message` option.',
        details: `The [message option](${linkify('README.md#message')}) option, if defined, must be a non empty \`String\`.

Your configuration for the \`successComment\` option is \`${message}\`.`,
    }),
    EINVALIDPLUGINS: () => ({
        message: 'Invalid `plugins` option.',
        details: `The [plugins option](${linkify(
            'README.md#plugins'
        )}) option must be an \`Array\`.`,
    }),
    EINVALIDFORCEPUSH: () => ({
        message: 'Invalid `forcePush` option.',
        details: `The [forcePush option](${linkify(
            'README.md#forcePush'
        )}) option must be a \`Boolean\`.`,
    }),
};
