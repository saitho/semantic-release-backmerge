import {performBackmerge} from "../src/perform-backmerge";
import Git from "../src/helpers/git";
import {instance, mock, verify, when, anyString, anything} from "ts-mockito";

class NullLogger {
    log(message) {}
    error(message) {}
}

describe("perform-backmerge", () => {
    jest.mock('semantic-release/lib/get-git-auth-url', () => jest.fn((c) => c.options.repositoryUrl));

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
        performBackmerge(instance(mockedGit), {branches: ['develop']}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("merge into the same branch", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: ['master'], allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("disallow merging into the same branch", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        await performBackmerge(instance(mockedGit), {branches: ['master'], allowSameBranchMerge: false}, context);
        verify(mockedLogger.error(anyString())).once();
    });

    it("works with template in branch name", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: ['${branch.name}'], allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("works without plugin definition", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: ['develop']}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
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
        performBackmerge(instance(mockedGit), {branches: ['develop'], forcePush: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop', true)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("if files were changed a commit will be created", async () => {
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

        await performBackmerge(
            instance(mockedGit),
            {
                branches: ['develop'],
                message: 'my-commit-message'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();
        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.rebase('master')).once();
        verify(mockedGit.commit('my-commit-message')).once();
        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("stash and unstash", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branches: ['develop'],
                clearWorkspace: true,
                restoreWorkspace: true
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        const checkoutDevelopAction = mockedGit.checkout('develop');
        verify(mockedGit.stash()).calledBefore(checkoutDevelopAction);
        verify(checkoutDevelopAction).once();
        verify(mockedGit.rebase('master')).once();

        const pushAction = mockedGit.push('my-repo', 'develop', false)
        verify(pushAction).once();
        verify(mockedGit.unstash()).calledAfter(pushAction);
    });

    it("merge as backmerge strategy", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branches: ['develop'],
                backmergeStrategy: 'merge'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'none')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("checkout mode ours", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branches: ['develop'],
                backmergeStrategy: 'merge',
                mergeMode: 'ours'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'ours')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("merge mode theirs", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branches: ['develop'],
                backmergeStrategy: 'merge',
                mergeMode: 'theirs'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'theirs')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("merge mode ours", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branches: ['develop'],
                backmergeStrategy: 'merge',
                mergeMode: 'ours'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'ours')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });
});

describe("perform-backmerge to multiple branches", () => {
    jest.mock('semantic-release/lib/get-git-auth-url', () => jest.fn((c) => c.options.repositoryUrl));

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
        performBackmerge(instance(mockedGit), {branches: ['develop', 'dev']}, context)
            .then(() => {
                verify(mockedGit.checkout('master')).twice();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.rebase('master')).twice();

                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.push('my-repo', 'develop', false)).once();

                verify(mockedLogger.log('Performing back-merge into branch "dev".')).once();
                verify(mockedGit.checkout('dev')).once();
                verify(mockedGit.push('my-repo', 'dev', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("works with all-skipped configuration", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: [{from: "main", to: "next"}]}, context)
            .then(() => {
                verify(mockedLogger.log('Branch "next" was skipped as release did not originate from branch "main".')).once();
                verify(mockedGit.push('my-repo', 'next', false)).never();
                done();
            })
            .catch((error) => done(error));
    });

    it("abort when merging into the same branch and it's disallowed", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        await performBackmerge(instance(mockedGit), {branches: ['master', 'develop'], allowSameBranchMerge: false}, context);
        verify(mockedLogger.error('Process aborted due to an error while backmerging a branch.')).once();
        verify(mockedLogger.error(anyString())).once();
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).never();
    });

    it("skip conditional backmerge if the release branch does not match the 'from' branch", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: [{from: 'main', to: 'next'}, 'master'], allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.log('Branch "next" was skipped as release did not originate from branch "main".')).once();
                verify(mockedLogger.log('Performing back-merge into branch "next".')).never();
                verify(mockedGit.push('my-repo', 'next', false)).never();

                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("ignore invalid branch configurations", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: [JSON.parse('{"foo": "bar"}'), 'master'], allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.error('Invalid branch configuration found and ignored.')).once();

                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("works with template in 'to' branch name", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branches: [{from: 'master', to: '${branch.name}'}], allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });
});

// todo: remove with next major release when `branchName` is removed
describe("perform-backmerge with deprecated branchName setting", () => {
    jest.mock('semantic-release/lib/get-git-auth-url', () => jest.fn((c) => c.options.repositoryUrl));

    it("trigger deprecation notice", async() => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        await performBackmerge(instance(mockedGit), {branchName: 'master', allowSameBranchMerge: false}, context);
        verify(mockedLogger.log('The property "branchName" is deprecated. Please use "branches" instead: `branches: ["master"]`')).once();
        verify(mockedLogger.error(anyString())).once();
    })

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
        performBackmerge(instance(mockedGit), {branchName: 'develop'}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("merge into the same branch", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branchName: 'master', allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("disallow merging into the same branch", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        await performBackmerge(instance(mockedGit), {branchName: 'master', allowSameBranchMerge: false}, context);
        verify(mockedLogger.error(anyString())).once();
    });

    it("works with template in branch name", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branchName: '${branch.name}', allowSameBranchMerge: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "master".')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.rebase('master')).never();
                verify(mockedGit.push('my-repo', 'master', false)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("works without plugin definition", (done) => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles()).thenResolve([]);
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};
        performBackmerge(instance(mockedGit), {branchName: 'develop'}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
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
        performBackmerge(instance(mockedGit), {branchName: 'develop', forcePush: true}, context)
            .then(() => {
                verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
                verify(mockedGit.checkout('master')).once();
                verify(mockedGit.configFetchAllRemotes()).once();
                verify(mockedGit.fetch(context.options.repositoryUrl)).once();
                verify(mockedGit.checkout('develop')).once();
                verify(mockedGit.rebase('master')).once();
                verify(mockedGit.push('my-repo', 'develop', true)).once();
                done();
            })
            .catch((error) => done(error));
    });

    it("if files were changed a commit will be created", async () => {
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

        await performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                message: 'my-commit-message'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();
        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.rebase('master')).once();
        verify(mockedGit.commit('my-commit-message')).once();
        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("stash and unstash", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.rebase(anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                clearWorkspace: true,
                restoreWorkspace: true
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        const checkoutDevelopAction = mockedGit.checkout('develop');
        verify(mockedGit.stash()).calledBefore(checkoutDevelopAction);
        verify(checkoutDevelopAction).once();
        verify(mockedGit.rebase('master')).once();

        const pushAction = mockedGit.push('my-repo', 'develop', false)
        verify(pushAction).once();
        verify(mockedGit.unstash()).calledAfter(pushAction);
    });

    it("merge as backmerge strategy", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                backmergeStrategy: 'merge'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'none')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("checkout mode ours", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                backmergeStrategy: 'merge',
                mergeMode: 'ours'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'ours')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("merge mode theirs", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                backmergeStrategy: 'merge',
                mergeMode: 'theirs'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'theirs')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });

    it("merge mode ours", async () => {
        const mockedGit = mock(Git);
        const mockedLogger = mock(NullLogger);
        when(mockedGit.checkout(anyString())).thenResolve();
        when(mockedGit.configFetchAllRemotes()).thenResolve();
        when(mockedGit.getStagedFiles())
            .thenReturn(new Promise<string[]>(resolve => resolve([])));
        when(mockedGit.fetch()).thenResolve();
        when(mockedGit.commit(anyString())).thenResolve();
        when(mockedGit.merge(anyString(), anyString())).thenResolve();
        when(mockedGit.push(anyString(), anyString(), anything())).thenResolve();

        const context = {logger: instance(mockedLogger), branch: {name: 'master'}, options: {repositoryUrl: 'my-repo'}};

        await performBackmerge(
            instance(mockedGit),
            {
                branchName: 'develop',
                backmergeStrategy: 'merge',
                mergeMode: 'ours'
            },
            context
        );
        verify(mockedLogger.log('Performing back-merge into branch "develop".')).once();
        verify(mockedGit.checkout('master')).once();
        verify(mockedGit.configFetchAllRemotes()).once();
        verify(mockedGit.fetch(context.options.repositoryUrl)).once();

        verify(mockedGit.checkout('develop')).once();
        verify(mockedGit.merge('master', 'ours')).once();

        verify(mockedGit.push('my-repo', 'develop', false)).once();
    });
});
