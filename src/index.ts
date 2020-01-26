import {defaultTo, castArray} from 'lodash';
import {verify} from "./verify";
import {performBackmerge} from "./perform-backmerge";
import {Context} from "semantic-release";
import Git from "./helpers/git";

let verified = false;

/**
 * Triggered at the beginning of the release process.
 * Verify plugin configurations.
 * @param pluginConfig
 * @param context
 */
export function verifyConditions(pluginConfig, context: Context) {
    const {options} = context;
    if (options.prepare) {
        const preparePlugin = castArray(options.prepare)
                .find(config => config.path && config.path === '@saithodev/semantic-release-backmerge') || {};
        pluginConfig.branchName = defaultTo(pluginConfig.branchName, preparePlugin.branchName);
    }

    verify(pluginConfig);
    verified = true;
}

/**
 * Triggered when release succeeded
 * @param pluginConfig
 * @param context
 */
export async function success(pluginConfig, context: Context) {
    if (!verified) {
        await verify(pluginConfig);
        verified = true;
    }

    const {env, cwd}: any = context;
    const git = new Git({env, cwd});
    await performBackmerge(git, pluginConfig, context);
}