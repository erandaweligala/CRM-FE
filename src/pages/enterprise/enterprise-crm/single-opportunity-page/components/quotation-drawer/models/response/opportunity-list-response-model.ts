export interface OpportunityListResponseModel {
    opportunityList: OpportunityListModel[];
}

export interface OpportunityListModel {
    id: string;
    owner: string;
    name: string;
    oppType: string;
    validFor: {
        startDateTime: string | null;
        endDateTime: string;
    };
    type: string;
    baseType: string;
    amount: string;
}
