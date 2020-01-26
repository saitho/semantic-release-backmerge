import {resolveConfig} from "./helpers/resolve-config";
import Git from "./helpers/git";

export async function performBackmerge(git: Git, pluginConfig, context) {
    const options = resolveConfig(pluginConfig);

    const masterBranchName = context.branch.name;
    const developBranchName: string = options.branchName;

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
    await git.push(context.options.repositoryUrl, developBranchName);
}