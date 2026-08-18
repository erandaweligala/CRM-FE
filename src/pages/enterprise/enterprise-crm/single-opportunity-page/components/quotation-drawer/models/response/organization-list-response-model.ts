export interface OrganizationListResponseModel {
    organizationCustomer: OrganizationalCustomer[];
}
export interface OrganizationalCustomer {
    id: string;
    brId: string;
    href: string;
    name: string;
    roleName: string;
    type: string;
    baseType: string;
}
