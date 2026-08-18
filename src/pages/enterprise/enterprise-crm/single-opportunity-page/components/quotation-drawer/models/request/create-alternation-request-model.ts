export interface CreateAlternationRequestModel {
    priceType: string ;
    applicationDuration: number;
    alterationType: string;
    priority: number;
    price: {
        percentage?: string;
        taxIncludedAmount?: {
            unit: string;
            value: number;
        };
    };
}
