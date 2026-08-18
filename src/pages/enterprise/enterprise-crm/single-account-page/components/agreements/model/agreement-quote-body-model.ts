export interface ValidFor {
    endDateTime?: string | null;
}

export interface Organization {
    id: string;
    name: string;
    href: string;
    role?: string;
}

export interface PrimaryContact {
    id: string;
    name: string;
    href: string;
    role?: string;
}

export interface RelatedParty {
    id: string;
    href: string;
    name: string;
    role?: string | null;
    "@baseType"?: string | null;
    "@schemaLocation"?: string | null;
    "@type"?: string | null;
    "@referredType"?: string | null;
}
export interface ContractInfo {
    startDate: string| null;
    endDate: string| null;
    ordered:boolean;
}

export interface Quote {
    id: string;
    name?: string;
    status: string;
    currency?: string;
    validFor?: ValidFor;
    organization?: Organization;
    primaryContact?: PrimaryContact;
    opportunityName?: string;
    relatedParty: RelatedParty[];
    contractInfo:ContractInfo;
}


export interface QuotesResponseBodyModel {
    quoteList: Quote[];
}

export interface ReinitiateQuotePayload {
    parentId: string;
    quotationName: string;
    expirationDate: string;
    startDate: string;
    endDate: string;
    amount: string;
}
