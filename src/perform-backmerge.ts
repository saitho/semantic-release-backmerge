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
    const releaseBranchName = branch.name;
    if (!options.allowSameBranchMerge && developBranchName === releaseBranchName) {
        throw new Error(
            'Branch for back-merge is the same as the branch which includes the release. ' +
            'Aborting back-merge workflow.'
        );
    }

    context.logger.log('Performing back-merge into develop branch "' + developBranchName + '".');

    if (developBranchName !== releaseBranchName) {
        // Branch is detached. Checkout master first to be able to check out other branches
        context.logger.log(`Branch is detached. Checking out release branch "${releaseBranchName}".`);
        await git.checkout(releaseBranchName);
        context.logger.log(`Checking out develop branch "${developBranchName}".`);
        await git.checkout(developBranchName);
        context.logger.log(`Performing backmerge with "${options.backmergeStrategy}" strategy.`);
        if (options.backmergeStrategy === 'merge') {
            await git.merge(releaseBranchName, options.mergeMode);
        } else {
            try {
                await git.rebase(releaseBranchName)
            } catch (e) {
                if (e.stderr == null || !e.stderr.includes('have unstaged changes')) {
                   throw e
                }
                context.logger.error('Rebase failed: You have unstaged changes.')
                const modifiedFiles = await git.getModifiedFiles()
                if (modifiedFiles.length) {
                    context.logger.error(`${modifiedFiles.length} modified file(s):`)
                    for (const file of modifiedFiles) {
                        context.logger.error(file)
                    } 
                }
                throw new Error(
                    'Unable to rebase branch (see error output above).'
                );
            }
        }
    } else {
        context.logger.log(`Checking out develop branch "${developBranchName}" directly.`);
        await git.checkout(developBranchName);
    }

    await triggerPluginHooks(options, context);
    // in this case there are only staged files
    const stagedFiles = await git.getModifiedFiles();
    context.logger.log('Found ' + stagedFiles.length + ' staged files for back-merge commit');
    if (stagedFiles.length) {
        for (const file of stagedFiles) {
            context.logger.log(file);
        }
        const message = options.message;
        await git.commit(
            template(message)({branch: branch, lastRelease, nextRelease})
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
            process.exit(1)
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
