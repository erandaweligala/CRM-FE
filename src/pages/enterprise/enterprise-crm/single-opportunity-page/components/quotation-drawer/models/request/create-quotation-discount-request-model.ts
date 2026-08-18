export interface CreateQuotationDiscountRequestModel {
    oneTimeDiscountType: string;
    recurringDiscountType: string;
    oneTimeValue: string;
    recurringValue: string;
    quoteId: string;
    optionId: string;
    status: string;
}

