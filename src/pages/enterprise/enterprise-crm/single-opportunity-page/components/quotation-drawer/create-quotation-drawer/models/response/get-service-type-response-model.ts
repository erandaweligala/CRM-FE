export interface ServiceTypeResponseModel {
    serviceTypeInfo: ServiceTypeInfoModel[];
}

export interface ServiceTypeInfoModel {
    id: string;
    serviceType: string;
    licensing: string;
    allowNegativeGp: string;
    approvalGpLevel: string;
    updateBillDetail: string;
    dealRegistrationRequired: string;
}