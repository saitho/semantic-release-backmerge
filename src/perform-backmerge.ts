import {resolveConfig} from "./helpers/resolve-config";
import Git from "./helpers/git";
import {template} from 'lodash';
import {loadPlugins} from "./helpers/plugins";
import {Config} from "./definitions/config";

export async function performBackmerge(git: Git, pluginConfig: Partial<Config>, context) {
    const {
        branch,
        lastRelease,
        nextRelease
    }: any = context;
    const options = resolveConfig(pluginConfig);
    const masterBranchName = branch.name;
    const developBranchName: string = template(options.branchName)({branch: branch});
    const message = options.message;

    if (!options.allowSameBranchMerge && developBranchName === masterBranchName) {
        context.logger.error(
            'Branch for back-merge is the same as the branch which includes the release. ' +
            'Aborting back-merge workflow.'
        );
        return;
    }

    context.logger.log('Release succeeded. Performing back-merge into branch "' + developBranchName + '".');

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
        await git.commit(
            message
                ? template(message)({branch: branch, lastRelease, nextRelease})
                : `chore(release): Preparations for next release [skip ci]`
        );
    }

    context.logger.log(`Pushing backmerge to develop branch ${developBranchName}`);
    await git.push(context.options.repositoryUrl, developBranchName, options.forcePush);

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
