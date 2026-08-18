export interface AddAccountRequestModel {
    accountOwner: string;
    accountName: string;
    parentAccount: {
        id: string | undefined;
        href: string | undefined
        name: string | undefined;
    }
    accountNo: string;
    accountType: string;
    industry: string;
    annualRevenue: string;
    rating: string;
    addressInfo: {
        contactNo: string;
        email: string;
        buildingNo: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        preferred: boolean;
    }
    billingAddressInfo: {
        buildingNo: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }
    description: string;
}