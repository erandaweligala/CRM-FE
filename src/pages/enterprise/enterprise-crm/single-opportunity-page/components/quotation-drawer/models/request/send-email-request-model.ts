export interface SendEmailRequestModel {
    emailAddress: string;
    isSaved: boolean | undefined;
    templateId: string | undefined;
    quoteId: string | undefined;
    comment: string | undefined;
    userName: string | undefined;
}