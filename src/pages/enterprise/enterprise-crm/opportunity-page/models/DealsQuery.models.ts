export interface DealsQueryModel {
    id?: string
    name?: string;
    accountId?: string;
    contactId?: string;
    ownerId?: string;
    stage?: string;
    closingDateFrom?: string;
    closingDateTo?: string;
    limit?: number,
    offset?: number
}