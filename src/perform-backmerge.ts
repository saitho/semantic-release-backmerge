import {resolveConfig} from "./helpers/resolve-config";
import Git from "./helpers/git";
import {template} from 'lodash';
import {loadPlugins} from "./helpers/plugins";

export async function performBackmerge(git: Git, pluginConfig, context) {
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

    context.logger.log(
        'Release succeeded. Performing back-merge into branch "' + developBranchName + '".'
    );

    // Make sure all remotes are fetched
    await git.configFetchAllRemotes();

    // Get latest commits before checking out
    await git.fetch();

    if (developBranchName !== masterBranchName) {
        // Branch is detached. Checkout master first to be able to check out other branches
        await git.checkout(masterBranchName);
        await git.checkout(developBranchName);
        await git.rebase(masterBranchName);
    } else {
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

    await git.push(context.options.repositoryUrl, developBranchName, options.forcePush);
}

async function triggerPluginHooks(pluginConfig, context) {
    context.logger.log('Loading plugins');
    const plugins = loadPlugins(pluginConfig, context);
    context.logger.log('Executing "done" step of plugins');
    await plugins.success(context);
}
