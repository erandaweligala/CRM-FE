export interface Subscription {
    count: string;
    status: string;
}
export interface PaymentRelationship {
    name: string;
    paymentStatus: string;
    paymentTerm: string;
};
export interface BillingInfo{
    creditScore: string; 
    outstanding: string;
    subscription: Subscription;
    dueDate: string;
    paymentRelationship: PaymentRelationship;
    billCycle: string;
    billMonth: string;
    paymentRelationshipNumber: string;
    billingAddress: string;
};