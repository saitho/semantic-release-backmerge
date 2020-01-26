import {performBackmerge} from "../src/perform-backmerge";
import Git from "../src/helpers/git";
import {instance, mock, verify, when, anyString} from "ts-mockito";

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
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branchName: 'develop'}, context)
            .then(() => {
                verify(mockedLogger.log('Release succeeded. Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch()).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop')).once();
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