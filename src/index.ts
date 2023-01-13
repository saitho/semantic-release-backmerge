import lodash from 'lodash';
const {defaultTo, castArray, isArray} = lodash;
import {verify} from "./verify.js";
import {performBackmerge} from "./perform-backmerge.js";
import {Context} from "semantic-release";
import Git from "./helpers/git.js";
import {Config} from "./definitions/config.js";

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

    const {options} = context;
    if (!options) {
        return
    }

    const ourPlugin = options.plugins.filter((plugin) => {
        return isArray(plugin) && plugin[0] === '@saithodev/semantic-release-backmerge'
    })[0] ?? []
    const realPluginConfig = ourPlugin[1] ?? {}

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
export async function success(pluginConfig: Partial<Config>, context: Context) {
    if (!verified) {
        verify(pluginConfig);
        verified = true;
    }

    const {env, cwd}: any = context;
    const git = new Git({env, cwd});
    await performBackmerge(git, pluginConfig, context);
}
