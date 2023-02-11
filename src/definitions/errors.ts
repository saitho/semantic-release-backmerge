const linkify = (file: string) => `https://github.com/saitho/semantic-release-backmerge/blob/master/${file}`;

export const ERROR_DEFINITIONS = {
    // @ts-ignore
    EINVALIDBACKMERGEBRANCHES: ({backmergeBranches}) => ({
        message: 'Invalid `backmergeBranches` option.',
        details: `The [backmergeBranches option](${linkify(
            'README.md#backmergeBranches'
        )}) option must be an \`Array\`. Your configuration for the \`backmergeBranches\` option is \`${backmergeBranches}\`.`,
    }),
    // @ts-ignore
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
