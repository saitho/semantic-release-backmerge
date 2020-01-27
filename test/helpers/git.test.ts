import {verify} from "../../src/verify";

jest.mock('execa');
import * as execa from 'execa';

import Git from "../../src/helpers/git";

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

    it("fetch", async () => {
        await subject.fetch();
        expect(execa).toHaveBeenCalledWith('git', ['fetch'], expect.objectContaining(execaOpts));
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
            ['checkout', 'develop'],
            expect.objectContaining(execaOpts)
        );
    });

    it("getStagedFiles", async () => {
        const execaMock: any = execa;
        execaMock.mockResolvedValueOnce({
            stdout: `A  file.txt\nB file2.txt`
        });

        const files = await subject.getStagedFiles();
        expect(execa).toHaveBeenCalledWith(
            'git',
            ['status', '-s', '-uno'],
            expect.objectContaining(execaOpts)
        );
        expect(files).toEqual(['A  file.txt','B file2.txt']);
    });

    it("getStagedFiles fails", (done) => {
        const execaMock: any = execa;
        execaMock.mockRejectedValueOnce({
            stderr: 'An error occurred'
        });
        subject.getStagedFiles()
            .then(() => done('Error expected'))
            .catch(() => done());
    });
});