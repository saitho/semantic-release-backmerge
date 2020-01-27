function getPackageData(plugin) {
    if (Array.isArray(plugin)) {
        return {packageName: plugin[0], pluginConfig: plugin[1]};
    }

    if (typeof plugin === 'string') {
        return {packageName: plugin, pluginConfig: {}};
    }

    return null;
}

interface IPlugin {
    packageName: string;
    pluginConfig: object;
    pluginPackage: any;
}

export class PluginGroup {
    protected plugins: Array<IPlugin> = [];
    constructor(plugins: Array<IPlugin>) {
        this.plugins = plugins;
    }
    async success(context) {
        for (const pluginPackage of this.plugins) {
            context.logger.log('Executing "success" step of package ' + pluginPackage.packageName);
            await pluginPackage.pluginPackage.success(pluginPackage.pluginConfig, context);
        }
    }
}

export function loadPlugins(pluginConfig: any, context): PluginGroup {
    const plugins = [];
    for (const plugin of pluginConfig.plugins) {
        const {packageName, pluginConfig} = getPackageData(plugin);
        if (!packageName) {
            context.logger.log('Invalid plugin provided. Expected string or array, got ' + (typeof plugin));
            continue;
        }

        const pluginPackage = require(packageName);
        if (typeof pluginPackage.success !== 'function') {
            context.logger.log('Method "success" not found in package ' + packageName + '.');
            continue;
        }
        context.logger.log('Plugin ' + packageName + ' loaded successfully.');
        plugins.push({packageName, pluginConfig, pluginPackage});
    }

    return new PluginGroup(plugins);
}