export interface ParentQuoteList{
    quotesData: Record<string, QuoteInfoTmf[]>;
}
export interface ValidFor {
    startDateTime?: string | null;
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

export interface Quote {
    id: string;
    name?: string;
    status: string;
    currency?: string;
    validFor?: ValidFor;
    organization?: Organization;
    primaryContact?: PrimaryContact;
    opportunitySource?: string;
    relatedParty: RelatedParty[];
}

export interface QuotesResponseBodyModel {
    quoteList: Quote[];
}

export interface ServiceType {
    id: string;
    name: string;
}

export interface QuoteInfoTmf {
    id: string;
    href: string;
    version: string;
    name: string;
    externalId: string;
    quoteItem: QuoteItem[];
    relatedParty: RelatedParty[];
    status:string;

}

export interface QuoteItem {
    id: string;
    action: string;
    quantity: number;
    category: Category[];
    productOffering: ProductOffering;
    quoteItemPrice: QuoteItemPrice[];
    product: {
        id: string;
        name: string;
    };
}

export interface Category {
    id: string;
    name: string;
}

export interface ProductOffering {
    id: string;
    href: string;
    name: string;
}

export interface QuoteItemPrice {
    description: string;
    name: string;
    priceType: string;
    productOfferingPrice: ProductOfferingPrice;
    priceAlteration: PriceAlteration[];
}

export interface PriceAlteration {
    applicationDuration: number;
    description: string;
    name: string;
    priceType: string;
    priority: number;
    price: {
        percentage: number;
        taxRate: any;
        dutyFreeAmount: any;
        taxIncludedAmount: {
            unit: string;
            value: number;
        };
    };
}

export interface ProductOfferingPrice {
    id: string;
    href: string;
    name: string;
}

export interface ConvertToSaleRequestModel {
  quoteInfo: {
    partyAccountId: string;
  };
}


export interface QuoteInfo {
  quoteName: string;
  status: string;
  expireOn: string; 
  opportunity: Opportunity;
  quotePrimaryRef: QuotePrimaryRef;
  amt: number;
  currency: string;
  primaryContact: PrimaryContact;
  owner: string;
  serviceType: ServiceType;
  secondary: boolean;
}

export interface Opportunity {
  oppId: string;
  oppName: string;
}

export interface QuotePrimaryRef {
  quoteId: string | null;
  quoteName: string | null;
}

export interface ParentQuoteResponseBody{
    quoteInfoTMFList: QuoteInfoTmf[], 
    quoteInfo:QuoteInfo
}