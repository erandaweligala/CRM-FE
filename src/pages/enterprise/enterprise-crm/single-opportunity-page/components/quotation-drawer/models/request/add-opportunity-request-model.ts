export interface AddOpportunityRequestModel {
    opportunitytOwner: string;
    opportunityName: string;
    account: {
        id: string | undefined;
        href: string | undefined;
        name: string | undefined;
    }
    contact: {
        id: string | undefined;
        href: string | undefined;
        name: string | undefined;
    } | null;
    type: string;
    amount: number;
    leadSource: string;
    closeDate: string;
    profitability: string;
    description: string;
}