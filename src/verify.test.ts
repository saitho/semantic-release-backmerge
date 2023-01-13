import {verify} from "./verify";

describe("verify", () => {
    it("does not throw error for valid config", () => {
        verify({branchName: 'develop', message: 'my message', plugins: ['my-plugin'], forcePush: true});
    });
    it("throws error for empty branch name", () => {
        expect(() => {
            verify({branchName: ''});
        }).toThrowError('SemanticReleaseError: Invalid `branchName` option.');
    });
    it("throws error if branches is not an array", () => {
        expect(() => {
            verify({backmergeBranches: ''});
        }).toThrowError('SemanticReleaseError: Invalid `backmergeBranches` option.');
    });
    it("throws error for empty commit message", () => {
        expect(() => {
            verify({message: ''});
        }).toThrowError('SemanticReleaseError: Invalid `message` option.');
    });
    it("throws error if plugins is not an array", () => {
        expect(() => {
            verify({plugins: 'not an array'});
        }).toThrowError('SemanticReleaseError: Invalid `plugins` option.');
    });
});
