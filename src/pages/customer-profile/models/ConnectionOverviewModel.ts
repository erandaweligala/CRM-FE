export interface ConnectionSummaryModel {
    paymentType: string;
    networkType: string;
    packageName: string;
    status: string;
    statusChangedDate: string;
    registerDate: string;
    expireDate: string;
}

export interface BalanceSummaryModel {
    mainBalance: string;
    lastBillValue: string; // postpaid only
    paymentDueDate: string; // postpaid only
    expireDate: string; // prepaid only
    lastRechargeDate: string; // prepaid only
}

export interface PaymentSummaryModel {
    totalPayment: string;
    lastPaymentValue: string;
    lastPaymentDate: string;
}

export interface TicketSummaryModel {
    unresolvedTroubleTicketCount: string;
    lastTicketDate: string;
    allTicketCount: string;
}

export interface QuotaSummaryElementModel {
    name: string;
    remainingQuantity: string;
    remainingPercentage: string;
    totalQuantity: string;
}

export interface QuotaSummaryModel {
    usageType: string;
    bucket: QuotaSummaryElementModel[];
}

export interface OrderSummaryModel {
    orderId: string;
    orderStatus: "Completed" | "Fail" | "Acknowledged";
    orderDate: string | null;
}

export interface TimeLineModel {
    title: string;
    date: string;
    description: string;
}

export interface ProductSummaryModel {
    type: string;
    value: number;
}

export interface UsageSummaryModel {
    type: string;
    value: number;
}

interface ConnectionOverviewModel {
    connectionSummary: ConnectionSummaryModel;
    balanceSummary: BalanceSummaryModel;
    paymentSummary: PaymentSummaryModel;
    ticketSummary: TicketSummaryModel;
    quotaSummary: QuotaSummaryModel[];
    orderSummary: OrderSummaryModel[];
    timeLine: TimeLineModel[];
    productSummary: ProductSummaryModel[];
    usageSummary: UsageSummaryModel[];
}

export default ConnectionOverviewModel;