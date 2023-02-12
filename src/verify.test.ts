import {verify} from "./verify";

describe("verify", () => {
    it("does not throw error for valid config", () => {
        verify({backmergeBranches: ['develop'], message: 'my message', plugins: ['my-plugin'], forcePush: true});
    });
    it("does not throw error for default config", () => {
        verify({});
    });
    it("throws error for wrongly typed branches setting", () => {
        expect(() => {
            verify({backmergeBranches: 'wrongType', message: 'my message'} as any);
        }).toThrowError('SemanticReleaseError: Invalid `backmergeBranches` option.');
    });
    it("throws error if branches is not an array", () => {
        expect(() => {
            verify({backmergeBranches: ''} as any);
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
