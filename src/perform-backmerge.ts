import {Context} from "semantic-release";
import {resolveConfig} from "./helpers/resolve-config";
import Git from "./helpers/git";

export async function performBackmerge(pluginConfig, context: Context) {
    const {
        env,
        cwd,
        branch,
    }: any = context;
    const options = resolveConfig(pluginConfig);
    const masterBranchName = branch.name;
    const developBranchName: string = options.branchName;

    if (developBranchName === masterBranchName) {
        context.logger.error(
            'Branch for back-merge is the same as the branch which includes the release. ' +
            'Aborting back-merge workflow.'
        );
        return;
    }

    context.logger.log(
        'Release succeded. Performing back-merge into branch "' + developBranchName + '".'
    );

    const git = new Git({env, cwd});

    let result;

    // Branch is detached. Checkout master first to be able to check out other branches
    result = await git.checkout(masterBranchName);
    context.logger.log(result.stdout);

    // Make sure all remotes are fetched
    await git.configFetchAllRemotes();

    // Get latest commits before checking out
    await git.fetch();

    result = await git.checkout(developBranchName);
    context.logger.log(result.stdout);

    result = await git.rebase(masterBranchName);
    context.logger.log(result.stdout);

    result = await git.push(context.options.repositoryUrl, developBranchName);
    context.logger.log(result.stdout);
}