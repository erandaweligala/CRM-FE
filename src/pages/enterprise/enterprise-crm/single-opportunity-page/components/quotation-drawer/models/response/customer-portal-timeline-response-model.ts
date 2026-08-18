export interface ChangeHistoryItemModel {
  ChangedStatus: string;
  oldStatus: string;
  statusReason: string;
  changedDate: string;
}

 export interface TimeLineHistoryModel {
  changeHistory: ChangeHistoryItemModel[];
}

export interface TimeLineResponseModel {
  responseData: TimeLineHistoryModel;
}