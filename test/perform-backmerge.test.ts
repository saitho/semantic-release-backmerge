import {performBackmerge} from "../src/perform-backmerge";
import Git from "../src/helpers/git";
import {instance, mock, verify, when, anyString, anything} from "ts-mockito";

class NullLogger {
    log(message) {}
    error(message) {}
}

describe("perform-backmerge", () => {
    it("works with correct configuration", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branchName: 'develop', plugins: []}, context)
            .then(() => {
                verify(mockedLogger.log('Release succeeded. Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch()).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("with force-push", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branchName: 'develop', plugins: [], forcePush: true}, context)
            .then(() => {
                verify(mockedLogger.log('Release succeeded. Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch()).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop', true)).once();
                done();
            })
            .catch((error) => done(error));
    });


    it("plugin adding files to Git cause commit", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve(['A    file-changed-by-plugin.md'])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        let success1Called = false;
        let success2Called = false;

        // Mocked packages must exist in package.json. So we use package that are not used in the file itself
        jest.mock('typedoc', () => {
            return {
                success: function (pluginConfig, context) {
                    success1Called = true;
                }
            }
        });
        jest.mock('typescript', () => {
            return {
                success: function (pluginConfig, context) {
                    success2Called = pluginConfig.someConfig;
                }
            }
        });

        performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                message: 'my-commit-message',
                plugins: ['typedoc', ['typescript', { someConfig: true }]]
            },
            context
        )
            .then(() => {
                verify(mockedLogger.log('Release succeeded. Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch()).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.commit('my-commit-message')).once();
                verify(mockedGit.push('my-repo', 'develop', false)).once();
                expect(success1Called).toBe(true);
                expect(success2Called).toBe(true);
                done();
            })
            .catch((error) => done(error));
    });

    it("logs error if master branch is the same as develop branch", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}};
        await performBackmerge(instance(mockedGit), {branchName: 'master'}, context);
        verify(mockedLogger.error(anyString())).once();
    });
});