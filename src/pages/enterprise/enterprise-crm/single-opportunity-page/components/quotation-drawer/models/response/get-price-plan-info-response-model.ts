export interface GetPricePlanInfoResponseModel{
    pricePlanInfo: PricePlanInfoModel[];
}

export interface PricePlanInfoModel{
    planId: string;
    planType: string;
    currency: string;
    listPrice: string;
}