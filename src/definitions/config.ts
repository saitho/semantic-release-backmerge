export type BackmergeStrategy = "rebase" | "merge";
export type MergeMode = "none" | "ours" | "theirs";

export type BranchTypeStruct = {from: string; to: string}
type BranchType = string|BranchTypeStruct

export interface Config {
    backmergeBranches: BranchType[];
    backmergeStrategy: BackmergeStrategy;
    plugins: any;
    forcePush: boolean;
    message: string;
    allowSameBranchMerge: boolean;
    clearWorkspace: boolean;
    restoreWorkspace: boolean;
    mergeMode: MergeMode;
}
