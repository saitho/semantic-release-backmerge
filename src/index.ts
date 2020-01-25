import {defaultTo, castArray} from 'lodash';
import {verify} from "./verify";

let verified = false;

export function verifyConditions(pluginConfig, context) {
    const {options} = context;
    // If the Git prepare plugin is used and has `assets` or `message` configured, validate them now in order to prevent any release if the configuration is wrong
    if (options.prepare) {
        const preparePlugin =
            castArray(options.prepare).find(config => config.path && config.path === '@saithodev/semantic-release-backmerge') || {};

        pluginConfig.assets = defaultTo(pluginConfig.assets, preparePlugin.assets);
        pluginConfig.message = defaultTo(pluginConfig.message, preparePlugin.message);
        pluginConfig.branchName = defaultTo(pluginConfig.branchName, preparePlugin.branchName);
    }

    verify(pluginConfig);
    verified = true;
}

export async function publish(pluginConfig, context) {
    console.log('Publish step');
    console.log(pluginConfig);
}

export async function notify(pluginConfig, context) {
    console.log('Notify step');
    console.log(pluginConfig);
}