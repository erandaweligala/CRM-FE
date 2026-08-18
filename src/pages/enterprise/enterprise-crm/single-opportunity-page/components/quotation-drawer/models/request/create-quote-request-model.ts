export default interface CreateQuoteRequestModel {
    organization: {
        id: string | undefined;
        href: string | undefined;
        name: string | undefined;
        role: string | undefined;
        type: string | undefined;
        baseType: string | undefined;
    }
    quoteInfo: {
        quoteName: string;
        isSecondary: boolean;
        quotePrimaryRef: {
            quoteId: string | undefined;
            quoteName: string | undefined;
        }
        status: string | undefined;
        expireOn: string;
        opportunity: {
            oppId: string | undefined;
            oppName: string | undefined;
        }
        amt: number;
        currency: string;
        primaryContact: {
            id: string | null | undefined;
            href: string | null |  undefined;
            name: string | undefined;
            role: string | undefined;
            type: string | undefined;
            baseType: string | undefined;
        }
        owner: string;
        serviceType: {
            id: string;
            name: string;
        }
    }
    contractInfo: {
        startDate: string;
        endDate: string;
        subscriptionTerm: string;
        contractMethod: {
            id: string | undefined;
            name: string | undefined;
        }
        contractPrice: {
            id: string | undefined;
            name: string | undefined;
        }
        terminationDate: string;
    }
    billingInfo: {
        billingFrequency: {
            id: string | undefined;
            name: string | undefined;
        },
        billStartDate:string;
    }
    priceBook: {
        id: string | undefined;
        name: string | undefined;
    }
}