export interface GetProductOfferingPricePlanListModel {
    pricePlanInformation: PricePlanInformation[];
}
export interface PricePlanInformation {
    id: string;
    name: string;
    priceType: string;
}