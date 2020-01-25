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
};