import {FastForwardMode, MergeMode} from "../definitions/config.js";
import execa, {ExecaReturnValue} from "execa";
import debugPkg from "debug";
const debug = debugPkg('semantic-release:backmerge');

export default class Git {
    /**
     * @var string Options to pass to `execa`.
     */
    protected execaOpts: object = {};

    constructor(execaOpts: object) {
        this.execaOpts = execaOpts;
    }

    protected runGitCommand(args: string[], isLocal = true, options: object = {}, retry = 0): Promise<ExecaReturnValue> {
        const maxRetries = isLocal ? 0 : 3; // retry remote Git operations up to 3 times if they fail
        return new Promise<ExecaReturnValue>(async (resolve, reject) => {
            try {
                const result = await execa('git', args, {...this.execaOpts, ...options})
                resolve(result)
            } catch (error) {
                console.log('catch error')
                console.log(error)
                console.log(retry, maxRetries)

                if (retry >= maxRetries) {
                    reject(error)
                    return
                }
                // Retry
                retry++
                console.log('Unable to connect to Git. Retrying in 1 second (' + retry + '/' + maxRetries + ').')
                setTimeout(() => {
                    this.runGitCommand(args, isLocal, options, retry)
                        .then(resolve)
                        .catch(reject)
                }, 1000)
            }
        });
    }

    /**
     * Add a list of file to the Git index. `.gitignore` will be ignored.
     *
     * @param {Array<String>} files Array of files path to add to the index.
     */
    async add(files: string[]) {
        const shell = await this.runGitCommand(
            ['add', '--force', '--ignore-errors', ...files],
            true,
            {reject: false}
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
        await this.runGitCommand(['commit', '-m', message]);
    }

    /**
     * Stash unstaged commits
     *
     * @throws {Error} if the commit failed.
     */
    async stash() {
        await this.runGitCommand(['stash']);
    }

    /**
     * Unstash changes
     *
     * @throws {Error} if the commit failed.
     */
    async unstash() {
        await this.runGitCommand(['stash', 'pop']);
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
    async push(origin: string, branch: string, forcePush: boolean = false, skipPipeline: boolean = false) {
        const args = ['push', origin, `HEAD:${branch}`];
        if (forcePush) {
            args.push('-f');
        }
        if (skipPipeline) {
            args.push('-o ci.skip');
        }
        await this.runGitCommand(args, false);
    }


    /**
     * Fetch commits from the remote repository.
     *
     * @throws {Error} if the fetch failed.
     */
    async fetch(url?: string) {
        const args = ['fetch'];
        if (url) {
            args.push(url);
        }
        await this.runGitCommand(args, false)
    }

    /**
     * Configures Git to fetch all references
     *
     * @throws {Error} if the config failed.
     */
    async configFetchAllRemotes() {
        await this.runGitCommand(['config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*'], false)
    }

    /**
     * Checks out a branch from the remote repository.
     *
     * @param {String} branch The branch to check out.
     *
     * @throws {Error} if the checkout failed.
     */
    async checkout(branch: string) {
        await this.runGitCommand(['checkout', '-B', branch], false);
    }

    /**
     * Get list of files that are tracked and modified
     * Each entry consists of the status and the file path.
     */
    getModifiedFiles(): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            this.runGitCommand(['status', '-s', '-uno'])
                .then((result: ExecaReturnValue) => {
                    const lines = result.stdout.split('\n');
                    resolve( lines.filter((item: string) => item.length) );
                })
                .catch((error: any) => reject(error));
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
        await this.runGitCommand(['rebase', `origin/${branch}`]);
    }

    /**
     * Merges the currently checked out branch onto another branch.
     *
     * @param {String} branch The branch to rebase onto.
     * @param {MergeMode} mergeMode
     * @param {FastForwardMode} fastForwardMode
     *
     * @throws {Error} if the merge failed.
     */
    async merge(branch: string, mergeMode: MergeMode = 'none', fastForwardMode: FastForwardMode = "none") {
        const args = ['merge']
        if (mergeMode !== 'none') {
            args.push('-X' + mergeMode)
        }
        if (fastForwardMode !== 'none') {
            args.push('--' + fastForwardMode)
        }
        args.push('origin/' + branch)
        await this.runGitCommand(args);
    }
}
