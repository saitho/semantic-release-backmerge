export type BackmergeStrategy = "rebase" | "merge";

export interface Config {
    branchName: string;
    backmergeStrategy: BackmergeStrategy;
    plugins: any;
    forcePush: boolean;
    message: string;
    allowSameBranchMerge: boolean;
    clearWorkspace: boolean;
    restoreWorkspace: boolean;
}
