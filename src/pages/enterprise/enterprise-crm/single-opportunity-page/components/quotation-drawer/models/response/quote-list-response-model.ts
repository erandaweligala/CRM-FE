export interface QuotationListResponseModel {
    quoteList: SingleQuote[];
}

export interface SingleQuote {
    id: string;
    name: string;
    status: string;
    currency: string;
    validFor: {
        endDateTime: string;
    }
    organization: {
        id: string;
        name: string;
        href: string;
        role: string;
    };
    primaryContact: {
        id: string;
        name: string;
        href: string;
        role: string;
    };
    opportunitySource: string;
    relatedParty: RelatedParty[];
}

export interface RelatedParty {
    name: string;
    role: string;
    id: string;
    referredType: string;
}