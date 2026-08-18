export interface GetQuoteListParamModel{
    name: string;
    id: string;
    startDate: string | undefined;
    endDate: string | undefined;
    accountName: string | undefined;
    status:string | undefined;
    isSecondary: boolean;
    offset: number;
    limit: number;
}