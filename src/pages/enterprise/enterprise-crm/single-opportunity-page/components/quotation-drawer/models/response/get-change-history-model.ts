export interface GetChangeHistoryModel {
    changeHistory: ChangeHistoryModel[];
}

export interface ChangeHistoryModel {
    userName: string;
    changedStatus: string;
    oldStatus: string;
    statusReason: string;
    changedDate: Date;
}