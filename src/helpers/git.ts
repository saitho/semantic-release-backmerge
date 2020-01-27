import * as execa from 'execa';
const debug = require('debug')('semantic-release:backmerge');

export default class Git {
    /**
     * @var string Options to pass to `execa`.
     */
    protected execaOpts: object = {};

    constructor(execaOpts: object) {
        this.execaOpts = execaOpts;
    }

    /**
     * Add a list of file to the Git index. `.gitignore` will be ignored.
     *
     * @param {Array<String>} files Array of files path to add to the index.
     */
    async add(files: string[]) {
        const shell = await execa(
            'git',
            ['add', '--force', '--ignore-errors', ...files],
            {...this.execaOpts, reject: false}
        );
        debug('add file to git index', shell);
    }

    /**
     * Commit to the local repository.
     *
     * @param {String} message Commit message.
     *
     * @throws {Error} if the commit failed.
     */
    async commit(message: string) {
        await execa('git', ['commit', '-m', message], this.execaOpts);
    }

    /**
     * Push to the remote repository.
     *
     * @param {String} origin The remote repository URL.
     * @param {String} branch The branch to push.
     * @param {Boolean} forcePush If branch should be force-pushed
     *
     * @throws {Error} if the push failed.
     */
    async push(origin: string, branch: string, forcePush: boolean = false) {
        const args = ['push', origin, `HEAD:${branch}`];
        if (forcePush) {
            args.push('-f');
        }
        await execa('git', args, this.execaOpts);
    }


    /**
     * Fetch commits from the remote repository.
     *
     * @throws {Error} if the fetch failed.
     */
    async fetch() {
        await execa('git', ['fetch'], this.execaOpts);
    }

    /**
     * Configures Git to fetch all references
     *
     * @throws {Error} if the config failed.
     */
    async configFetchAllRemotes() {
        await execa(
            'git',
            ['config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*'],
            this.execaOpts
        );
    }

    /**
     * Checks out a branch from the remote repository.
     *
     * @param {String} branch The branch to check out.
     *
     * @throws {Error} if the checkout failed.
     */
    async checkout(branch: string) {
        // try {
        //     await execa('git', ['branch', branch, 'origin/' + branch]);
        // } catch (e) {
        // }
        await execa('git', ['checkout', branch], this.execaOpts);
    }

    /**
     * Get list of files that are included in next commit
     * Each entry consists of the status and the file path.
     */
    getStagedFiles(): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            execa('git', ['status', '-s', '-uno'], this.execaOpts)
                .then((result) => {
                    const lines = result.stdout.split('\n');
                    resolve( lines.filter((item) => item.length) );
                })
                .catch((error) => reject(error));
        })
    }

    /**
     * Rebases the currently checked out branch onto another branch.
     *
     * @param {String} branch The branch to rebase onto.
     *
     * @throws {Error} if the rebase failed.
     */
    async rebase(branch: string) {
        await execa('git', ['rebase', `origin/${branch}`], this.execaOpts);
    }
}