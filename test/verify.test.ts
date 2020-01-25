import {verify} from "../src/verify";

describe("verify", () => {
    it("does not throw error for valid config", () => {
        verify({branchName: 'develop'});
    });
    it("throws error for empty branch name", () => {
        expect(() => {
            verify({branchName: ''});
        }).toThrowError('SemanticReleaseError: Invalid `branchName` option.');
    });
});