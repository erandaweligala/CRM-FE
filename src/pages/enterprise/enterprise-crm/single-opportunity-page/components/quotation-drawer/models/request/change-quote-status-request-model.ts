export interface ChangeQuoteStatusRequestModel {
    newStatus: string | undefined;
    oldStatus: string | undefined;
    statusReason: string | undefined;
    userName: string | undefined;
}