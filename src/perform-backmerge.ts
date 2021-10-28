import {resolveConfig} from "./helpers/resolve-config";
import Git from "./helpers/git";
import {template} from 'lodash';
import {loadPlugins} from "./helpers/plugins";
import {Config} from "./definitions/config";

async function performBackmergeIntoBranch(git: Git, pluginConfig: Partial<Config>, context, options: Config, developBranchName: string) {
    const {
        branch,
        lastRelease,
        nextRelease
    }: any = context;
    const masterBranchName = branch.name;
    if (!options.allowSameBranchMerge && developBranchName === masterBranchName) {
        throw new Error(
            'Branch for back-merge is the same as the branch which includes the release. ' +
            'Aborting back-merge workflow.'
        );
    }

    context.logger.log('Performing back-merge into branch "' + developBranchName + '".');

    if (developBranchName !== masterBranchName) {
        // Branch is detached. Checkout master first to be able to check out other branches
        context.logger.log('Branch is detached. Checking out master branch.');
        await git.checkout(masterBranchName);
        context.logger.log('Checking out develop branch.');
        await git.checkout(developBranchName);
        context.logger.log(`Performing backmerge with "${options.backmergeStrategy}" strategy.`);
        if (options.backmergeStrategy === 'merge') {
            await git.merge(masterBranchName, options.mergeMode);
        } else {
            await git.rebase(masterBranchName);
        }
    } else {
        context.logger.log('Checking out develop branch directly.');
        await git.checkout(developBranchName);
    }

    await triggerPluginHooks(options, context);
    const stagedFiles = await git.getStagedFiles();
    context.logger.log('Found ' + stagedFiles.length + ' staged files for back-merge commit');
    if (stagedFiles.length) {
        for (const file of stagedFiles) {
            context.logger.log(file);
        }
        const message = options.message;
        await git.commit(
            message
                ? template(message)({branch: branch, lastRelease, nextRelease})
                : `chore(release): Preparations for next release [skip ci]`
        );
    }

    context.logger.log(`Pushing backmerge to develop branch ${developBranchName}`);
    const getGitAuthUrl = require('semantic-release/lib/get-git-auth-url');
    const authedRepositoryUrl = await getGitAuthUrl({...context, branch: {name: developBranchName}});
    await git.push(authedRepositoryUrl, developBranchName, options.forcePush);
}

export async function performBackmerge(git: Git, pluginConfig: Partial<Config>, context) {
    const branch = context.branch;
    const options = resolveConfig(pluginConfig);

    // fallback to `branchName` if `branches` are empty. todo: remove with next major release as this is deprecated
    if (options.branchName != null && options.branchName.length) {
        options.branches = [options.branchName]
        context.logger.log('The property "branchName" is deprecated. Please use "branches" instead: `branches: ["' + options.branchName + '"]`')
    }

    // Make sure all remotes are fetched
    context.logger.log(`Fetching all remotes.`);
    await git.configFetchAllRemotes();

    // Get latest commits before checking out
    context.logger.log(`Fetching latest commits from repository at "${context.options.repositoryUrl}".`);
    await git.fetch(context.options.repositoryUrl);

    if (options.clearWorkspace) {
        context.logger.log('Stashing uncommitted files from Git workspace.');
        await git.stash();
    }

    for(const developBranch of options.branches) {
        let developBranchName: string;
        if (typeof(developBranch) === 'object') {
            if (!developBranch.hasOwnProperty('from') || !developBranch.hasOwnProperty('to')) {
                console.log(developBranch)
                context.logger.log(developBranch.toString())
                context.logger.error('Invalid branch configuration found and ignored.')
                continue;
            }
            if (branch.name !== developBranch.from) {
                context.logger.log(
                    'Branch "' + developBranch.to + '" was skipped as release did not originate from branch "' + developBranch.from + '".'
                );
                continue;
            }
            developBranchName = developBranch.to.toString()
        } else {
            developBranchName = developBranch.toString();
        }

        try {
            await performBackmergeIntoBranch(git, pluginConfig, context, options, template(developBranchName)({branch: branch}))
        } catch (e) {
            context.logger.error('Process aborted due to an error while backmerging a branch.')
            context.logger.error(e)
            break
        }
    }

    if (options.restoreWorkspace) {
        context.logger.log('Restoring stashed files to Git workspace.');
        await git.unstash();
    }
}

async function triggerPluginHooks(pluginConfig, context) {
    context.logger.log('Loading plugins');
    const plugins = loadPlugins(pluginConfig, context);
    context.logger.log('Executing "done" step of plugins');
    await plugins.success(context);
}
