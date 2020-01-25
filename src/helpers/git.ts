import * as execa from 'execa';
import {ExecaReturnValue} from 'execa';
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
    commit(message: string) {
        return execa('git', ['commit', '-m', message], this.execaOpts);
    }

    /**
     * Push to the remote repository.
     *
     * @param {String} origin The remote repository URL.
     * @param {String} branch The branch to push.
     *
     * @throws {Error} if the push failed.
     */
    push(origin: string, branch: string) {
        return execa('git', ['push', origin, `HEAD:${branch}`], this.execaOpts);
    }

    fetch() {
        return execa('git', ['fetch', '-p'], this.execaOpts);
    }

    configFetchAllRemotes() {
        return execa(
            'git',
            ['config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*'],
            this.execaOpts
        );
    }

    async checkout(branch: string): Promise<ExecaReturnValue> {
        try {
            await execa('git', ['branch', branch, 'origin/' + branch]);
        } catch (e) {
        }
        return execa('git', ['checkout', branch], this.execaOpts);
    }

    rebase(baseBranch: string) {
        return execa('git', ['rebase', `origin/${baseBranch}`], this.execaOpts);
    }
}