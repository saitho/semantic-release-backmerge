import {resolveConfig} from "./helpers/resolve-config";
import Git from "./helpers/git";
import * as srPlugins from "semantic-release/lib/plugins";
import {template} from 'lodash';

export async function performBackmerge(git: Git, pluginConfig, context) {
    const {
        branch,
        lastRelease,
        nextRelease
    }: any = context;
    const options = resolveConfig(pluginConfig);
    const masterBranchName = branch.name;
    const developBranchName: string = options.branchName;
    const message = options.message;

    if (developBranchName === masterBranchName) {
        context.logger.error(
            'Branch for back-merge is the same as the branch which includes the release. ' +
            'Aborting back-merge workflow.'
        );
        return;
    }

    context.logger.log(
        'Release succeeded. Performing back-merge into branch "' + developBranchName + '".'
    );

    // Branch is detached. Checkout master first to be able to check out other branches
    await git.checkout(masterBranchName);

    // Make sure all remotes are fetched
    await git.configFetchAllRemotes();

    // Get latest commits before checking out
    await git.fetch();

    await git.checkout(developBranchName);
    await git.rebase(masterBranchName);

    await triggerPluginHooks(pluginConfig, context);
    const stagedFiles = await git.getStagedFiles();
    context.logger.log('Found ' + stagedFiles.length + ' staged files for back-merge commit');
    if (stagedFiles.length) {
        for (const file of stagedFiles) {
            context.logger.log(file);
        }
        await git.commit(
            message
                ? template(message)({branch: branch.name, lastRelease, nextRelease})
                : `chore(release): Preparations for next release [skip ci]`
        );
    }

    await git.push(context.options.repositoryUrl, developBranchName);
}

async function triggerPluginHooks(pluginConfig, context) {
    const subcontext: any = {...context};
    subcontext.options.plugins = pluginConfig.plugins || [];
    if (!subcontext.options.plugins.length) {
        return;
    }
    const plugins: any = await srPlugins(subcontext, {});
    await plugins.success(context);
}