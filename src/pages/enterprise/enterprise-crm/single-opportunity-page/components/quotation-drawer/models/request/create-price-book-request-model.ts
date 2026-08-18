export interface CreatePriceBookRequestModel {
    bookName: string | undefined;
    priceBookInfo: PriceBookInfo[] | undefined;
}

export interface PriceBookInfo {
    productInfo: {
        id: string | undefined;
        href: string | undefined;
        name: string | undefined;
        category: CategoryList[] | undefined;
    }
    pricePlanInfo: PricePlanInfo[] | undefined;

}

export interface CategoryList {
    id: string | undefined;
    name: string | undefined;
}

export interface PricePlanInfo {
    planId: string | undefined;
    planName: string | undefined;
    alteration: {
        priceType: string | undefined;
        applicationDuration?: number | null;
        alterationType?: string;
        priority: number| null;
        price: {
            percentage: number| null;
            taxIncludedAmount: {
                unit: string | undefined | null;
                value: number| null;
            } | null | undefined;
        }
    }
}