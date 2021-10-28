import {defaultTo, castArray, isArray} from 'lodash';
import {verify} from "./verify";
import {performBackmerge} from "./perform-backmerge";
import {Context} from "semantic-release";
import Git from "./helpers/git";
import {Config} from "./definitions/config";

let verified = false;

/**
 * Triggered at the beginning of the release process.
 * Verify plugin configurations.
 * @param pluginConfig
 * @param context
 */
export async function verifyConditions(pluginConfig: Config, context: Context) {
    // pluginConfig also contains config keys for semantic-release.
    // since we also use a "plugin" setting, we need to get the plugin config ourselves
    // otherwise we may get the "branches" setting of semantic-release itself

    const ourPlugin = context.options.plugins.filter((plugin) => {
        return isArray(plugin) && plugin[0] === '@saithodev/semantic-release-backmerge'
    })[0] ?? []
    const realPluginConfig = ourPlugin[1] ?? {}

    const {options} = context;
    if (options.prepare) {
        const preparePlugin = castArray(options.prepare)
                .find(config => config.path && config.path === '@saithodev/semantic-release-backmerge') || {};
        pluginConfig.branchName = defaultTo(realPluginConfig.branchName, preparePlugin.branchName);
        pluginConfig.branches = defaultTo(realPluginConfig.branches, preparePlugin.branches);
        pluginConfig.backmergeStrategy = defaultTo(realPluginConfig.backmergeStrategy, preparePlugin.backmergeStrategy);
        pluginConfig.plugins = defaultTo(realPluginConfig.plugins, preparePlugin.plugins);
        pluginConfig.forcePush = defaultTo(realPluginConfig.forcePush, preparePlugin.forcePush);
        pluginConfig.message = defaultTo(realPluginConfig.message, preparePlugin.message);
        pluginConfig.clearWorkspace = defaultTo(realPluginConfig.clearWorkspace, preparePlugin.clearWorkspace);
        pluginConfig.restoreWorkspace = defaultTo(realPluginConfig.restoreWorkspace, preparePlugin.restoreWorkspace);
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
        verify(pluginConfig);
        verified = true;
    }

    const {env, cwd}: any = context;
    const git = new Git({env, cwd});
    await performBackmerge(git, pluginConfig, context);
}
