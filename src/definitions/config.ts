export type BackmergeStrategy = "rebase" | "merge";
export type MergeMode = "none" | "ours" | "theirs";

type BranchType = string|{from: string; to: string}

export interface Config {
    branchName: string;
    branches: BranchType[];
    backmergeStrategy: BackmergeStrategy;
    plugins: any;
    forcePush: boolean;
    message: string;
    allowSameBranchMerge: boolean;
    clearWorkspace: boolean;
    restoreWorkspace: boolean;
    mergeMode: MergeMode;
}
