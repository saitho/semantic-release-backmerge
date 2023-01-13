import {loadPlugins} from "./plugins";
import {instance, mock, verify, match} from "ts-mockito";
import {Context} from "semantic-release";

class NullLogger {
    log(_message: string) {}
    error(_message: string) {}
}

describe("plugins", () => {
    it("call success function on plugins", async () => {
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: []} as unknown as Context;

        let success1Called = false;
        let success2Called = false;

        // Mocked packages must exist in package.json. So we use package that are not used in the file itself
        jest.mock('typedoc', () => {
            return {
                success: function () {
                    success1Called = true;
                }
            }
        });
        jest.mock('typescript', () => {
            return {
                success: function (pluginConfig: { someConfig: boolean; }) {
                    success2Called = pluginConfig.someConfig;
                }
            }
        });

        const pluginList = loadPlugins(
            {plugins: ['typedoc', ['typescript', { someConfig: true }]]},
            context
        );
        verify(mockedLogger.log('Plugin typedoc loaded successfully.')).once();
        verify(mockedLogger.log('Plugin typescript loaded successfully.')).once();

        await pluginList.success(context);
        verify(mockedLogger.log('Executing "success" step of package typedoc')).once();
        expect(success1Called).toBe(true);
        verify(mockedLogger.log('Executing "success" step of package typescript')).once();
        expect(success2Called).toBe(true);
    });

    it("log message if plugin configuration is invalid", () => {
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: []} as unknown as Context

        loadPlugins({plugins: [ {foo: 'bar'} ]}, context);
        verify(mockedLogger.log(match('Invalid plugin provided. Expected string or array'))).once();
    });

    it("log message if plugin has no 'success' function", () => {
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: []} as unknown as Context

        jest.mock('cz-conventional-changelog', () => {
            return {};
        });
        loadPlugins({plugins: ['cz-conventional-changelog']}, context);
        verify(mockedLogger.log(match('Method "success" not found in package cz-conventional-changelog'))).once();
    });

    it("log message if plugin has 'success' property but its not a function", () => {
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: []} as unknown as Context

        jest.mock('commitizen', () => {
            return {
                success: 'not a function'
            };
        });
        loadPlugins({plugins: ['commitizen']}, context);
        verify(mockedLogger.log(match('Method "success" not found in package commitizen'))).once();
    });
});
