import AccountStatusEnum from "../constants/account-status.enum";

export interface ManageByModel {
    name: string;
    role: string;
}
export interface TimeLineModel {
    date: string;
    description: string;
    title: string;
}

export interface HouseMemberItemModel {
    name: string;
    serviceNumber: string;
    accountStatus: "Active" | "Suspend" | "Call Bar";
}

export interface NextBestOfferModel {
    name: string;
    iconType: "NETFLIX" | "FACEBOOK" | "YOUTUBE" | "TIKTOK";
}
export interface HotProductsModel {
    name: string;
    iconType: "NETFLIX" | "FACEBOOK" | "YOUTUBE" | "TIKTOK";
}


export interface CustomerSummeryModel {
    period: string;
    revenue: string;
    nps: string | number;
}

export interface CustomerEngagements{
    type:string;
    serviceProviderInitiated:number;
    customerInitiated:number;
}

export interface CustomerPersonas{
    type:string;
    personas:string[];
}


interface CustomerOverviewModel {
    serviceReferenceList: {
        serviceReference: string,
        accountStatus: AccountStatusEnum,
        paymentType: "Prepaid" | "Postpaid",
        connectionType: "GSM" | "TV" | "BroadBand"
    }[];
    customerOverview: {
        customerId: string,
        customerType: "Individual" | "Organization",
        customerStatus: "Active" | "In-Active",
        isBlackListed: boolean,
        isBirthday: boolean,
        country: string;
        email: string;
        preferredLanguage: string;
        totalTicketCount: string;
        resolvedTicketCount: string;
        unresolvedTicketCount: string;
        registedDate: string;
        timeLine: TimeLineModel[];
        type: string;
        customerIdentification: string;
        points: string;
        netPromoterScore: string;
        name: string;
        connections: {
            type: string;
            value: number;
        }[];
        contactNo: string;
        expirationDate: string;
        ticketByCategory: {
            category: string;
            value: number;
        }[];
        averageRevenue: {
            month: string;
            value: number
        }[];
        preferredContactMethod: "CALL" | "WHATSAPP" | "EMAIL";
		preferredContactTime: string;
		devicePreference: "APPLE" | "ANDROID";
		preferredCustomerService: "SELFCARE" | "CALL_CENTER";
		billingAndPayment: string;
		channels: string[];
        houseMembers:HouseMemberItemModel[];
        nextBestOffer:NextBestOfferModel[];
        hotProducts:HotProductsModel[];        
        customerSummary:CustomerSummeryModel[];
        engagements:CustomerEngagements[];
        customerPersonas:CustomerPersonas[];
        manageBy:ManageByModel[];
    };
}

export default CustomerOverviewModel;