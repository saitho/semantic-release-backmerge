jest.mock('execa');
import execa from 'execa';

import Git from "./git";

const execaOpts = {foo: 'bar'};
const subject = new Git(execaOpts);

describe("git", () => {
    beforeEach(() => {
        ((execa as unknown) as jest.Mock).mockClear();
    });
    it("add", async () => {
        await subject.add(['test.txt', 'test2.txt']);
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['add', '--force', '--ignore-errors', 'test.txt', 'test2.txt'],
            expect.objectContaining(execaOpts)
        );
    });

    it("commit", async () => {
        await subject.commit('my message');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['commit', '-m', 'my message'],
            expect.objectContaining(execaOpts)
        );
    });

    it("push", async () => {
        await subject.push(
            'http://github.com/saitho/semantic-release-backmerge',
            'develop',
            false
        );
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['push', 'http://github.com/saitho/semantic-release-backmerge', 'HEAD:develop'],
            expect.objectContaining(execaOpts)
        );

        await subject.push(
            'http://github.com/saitho/semantic-release-backmerge',
            'develop',
            true
        );
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['push', 'http://github.com/saitho/semantic-release-backmerge', 'HEAD:develop', '-f'],
            expect.objectContaining(execaOpts)
        );
    });

    it("push on second try", async () => {
        ((execa as unknown) as jest.Mock)
            .mockRejectedValueOnce({stderr: 'An error occurred'});
        await subject.push(
            'http://github.com/saitho/semantic-release-backmerge',
            'develop',
            false
        );
        expect(execa).toHaveBeenCalledTimes(2)
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['push', 'http://github.com/saitho/semantic-release-backmerge', 'HEAD:develop'],
            expect.objectContaining(execaOpts)
        );

        await subject.push(
            'http://github.com/saitho/semantic-release-backmerge',
            'develop',
            true
        );
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['push', 'http://github.com/saitho/semantic-release-backmerge', 'HEAD:develop', '-f'],
            expect.objectContaining(execaOpts)
        );
    });

    it("fetch", async () => {
        ((execa as unknown) as jest.Mock)
            .mockRejectedValueOnce({stderr: 'An error occurred'});
        await subject.fetch();
        expect(execa).toHaveBeenCalledTimes(2)
        expect(execa).toHaveBeenCalledWith('git', ['fetch'], expect.objectContaining(execaOpts));
    });

    it("fetch on second try", async () => {
        ((execa as unknown) as jest.Mock)
            .mockRejectedValueOnce({stderr: 'An error occurred'});
        await subject.fetch();
        expect(execa).toHaveBeenCalledTimes(2)
        expect(execa).toHaveBeenCalledWith('git', ['fetch'], expect.objectContaining(execaOpts));
    });

    it("fetch", async () => {
        const url = 'https://someUrl';
        await subject.fetch(url);
        expect(execa).toHaveBeenCalledWith('git', ['fetch', url], expect.objectContaining(execaOpts));
    });

    it("configFetchAllRemotes", async () => {
        await subject.configFetchAllRemotes();
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*'],
            expect.objectContaining(execaOpts)
        );
    });

    it("rebase", async () => {
        await subject.rebase('develop');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['rebase', 'origin/develop'],
            expect.objectContaining(execaOpts)
        );
    });

    it("checkout", async () => {
        await subject.checkout('develop');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['checkout', '-B', 'develop'],
            expect.objectContaining(execaOpts)
        );
    });

    it("checkout on second try", async () => {
        ((execa as unknown) as jest.Mock)
            .mockRejectedValueOnce({stderr: 'An error occurred'});
        await subject.checkout('develop');
        expect(execa).toHaveBeenCalledTimes(2)
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['checkout', '-B', 'develop'],
            expect.objectContaining(execaOpts)
        );
    });

    it("stash", async () => {
        await subject.stash();
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['stash'],
            expect.objectContaining(execaOpts)
        );
    });

    it("unstash", async () => {
        await subject.unstash();
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['stash', 'pop'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge", async () => {
        await subject.merge('master');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours ff)", async () => {
        await subject.merge('master', "none", 'ff');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '--ff', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours no-ff)", async () => {
        await subject.merge('master', "none", 'no-ff');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '--no-ff', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours ff-only)", async () => {
        await subject.merge('master', "none", 'ff-only');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '--ff-only', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours)", async () => {
        await subject.merge('master', 'ours');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xours', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours ff)", async () => {
        await subject.merge('master', 'ours', 'ff');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xours', '--ff', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours no-ff)", async () => {
        await subject.merge('master', 'ours', 'no-ff');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xours', '--no-ff', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (ours ff-only)", async () => {
        await subject.merge('master', 'ours', 'ff-only');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xours', '--ff-only', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (theirs)", async () => {
        await subject.merge('master', 'theirs');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xtheirs', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (theirs ff)", async () => {
        await subject.merge('master', 'theirs', 'ff');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xtheirs', '--ff', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (theirs no-ff)", async () => {
        await subject.merge('master', 'theirs', 'no-ff');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xtheirs', '--no-ff', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("merge (theirs ff-only)", async () => {
        await subject.merge('master', 'theirs', 'ff-only');
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['merge', '-Xtheirs', '--ff-only', 'origin/master'],
            expect.objectContaining(execaOpts)
        );
    });

    it("getModifiedFiles", async () => {
        const execaMock: any = execa;
        execaMock.mockResolvedValueOnce({
            stdout: `A  file.txt\nB file2.txt`
        });

        const files = await subject.getModifiedFiles();
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['status', '-s', '-uno'],
            expect.objectContaining(execaOpts)
        );
        expect(files).toEqual(['A  file.txt','B file2.txt']);
    });

    it("getModifiedFiles fails", (done) => {
        const execaMock: any = execa;
        execaMock.mockRejectedValueOnce({
            stderr: 'An error occurred'
        });
        subject.getModifiedFiles()
            .then(() => done('Error expected'))
            .catch(() => done());
    });
});
