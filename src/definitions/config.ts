export interface Config {
    branchName: string;
    plugins: any;
    forcePush: boolean;
    message: string;
    allowSameBranchMerge: boolean;
    clearWorkspace: boolean;
    restoreWorkspace: boolean;
}
