export interface UpdateOrganizationInfoRequest {
    nameType: string | null;
    tradingName: string | null;
    isLegalEntity: string;
    isHeadOffice: string;
    organizationType: string | null;
    existsDuring: string | null;
    status: string;
    createDate: string | null;
}