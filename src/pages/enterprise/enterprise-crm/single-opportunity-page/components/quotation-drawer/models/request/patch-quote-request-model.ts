export interface PatchQuoteRequestModel {
    quoteItem: {
        id: string | undefined;
        action: string;
        quantity: number;
        state: string;
        product: {
            id: string | undefined;
            name: string | undefined;
            productCharacteristic: ProductCharacteristicModel[];
        };
        quoteItemPrice: QuoteItemPriceModel[];
    }
}

export interface QuoteItemPriceModel {
    priceType: string;
    productOfferingPrice: {
        id: string;
        name: string;
        referredType: string;
    };
}
export interface ProductCharacteristicModel {
    name: string;
    valueType: string;
    value: string;
}
