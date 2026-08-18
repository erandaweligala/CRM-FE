export interface GetDiscountPreviewResponse {
    quoteNo: string;
    quoteDate: string;
    contractDate: string;
    options: Option[];
}

export interface Option {
    optionName: string;
    quoteItemDetails: QuoteItemDetails;
}

export interface QuoteItemDetails {
    products: Product[];
    onetimeTotal: number;
    oneTimeTotDiscount: number;
    totalAmount: number;
    recurringTotal: number;
    recurringTotDiscount: number;
    recurringFinalTotal: number;
    subscriptionType: string;
    currency: string;
}

export interface Product {
    count: number;
    productName: string;
    qty: number;
    unitPrice: number;
    discount: string;
    onetimeSubtotal: number;
    recurringTotal: number;
}