export interface IndividualCustomer {
    id: null | string;
    href: null | string;
    givenName: string;
    familyName: string;
    role: string;
    designation: string;
    type: string;
    baseType: string;
}

export default interface CustomerDataResponseModel {
    individualCustomer: IndividualCustomer[];
}
