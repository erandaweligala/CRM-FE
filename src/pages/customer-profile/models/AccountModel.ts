export interface AccountInfoModel {
    accountId: string;
    accountType: string;
    accountStatus: string;
    paymentStatus: string;
    lastModifiedDate: string;
    defaultPaymentMethod: string;
    ratingType: string;
    billingAddress: string;
    mainBalance: string;
}

export interface CreditInstanceModel {
    creditInstanceId: string;
    limitClass: string;
    amount: string;
    effectiveTime: string;
    expireTime: string;
}

export interface AccountCreditModel {
    id: string;
    creditLimitType: string;
    creditLimitName: string;
    totalCreditAmount: string;
    totalUsageAmount: string;
    totalRemainingAmount: string;
    instances: CreditInstanceModel[];
}

export interface BalanceInstanceModel {
    instanceId: string;
    amount: string;
    initialAmount: string;
    effectiveTime: string;
    expireTime: string;
    offeringName: string;
}

export interface BalanceDetailModel {
    id: string;
    type: string;
    name: string;
    totalAmount: string;
    reservedAmount: string;
    instances: BalanceInstanceModel[];
}

export interface OutstandingDetailModel {
    billCycle: string;
    billCycleStartTime: string;
    billCycleEndTime: string;
    dueDate: string;
    outstandingAmount: string;
}

export interface PaymentPlanModel {
    id: string;
    numberOfPayment: string;
    paymentFrequency: string;
    priority: string;
    paymentMethod: string;
    totalAmount: string;
    startDate: string;
    endDate: string;
    status: string;
}

export interface CustomerBills {
    nextBillDate: string;
    amountDue: string;
    paymentDueDate: string;
    billDocument: string;
    billingPeriod: string;
    runType: string;
    billDate: string;
    id: string;
    state: string;
    category: string;
    billNo: string;
}

export interface BillingDetailsModel {
    billFormat: string;
    billPresentation: string[];
    cycleStartDate: string;
    cycleEndDate: string;
    paymentDueDate: string;
    billingPeriod: string;
}

export interface InstanceModel {
    bucketInstanceId: string;
    initialAmount: string;
    usedAmount: string;
    remainingAmount: string;
    effectiveTime: string;
    expireTime: string;
    offerId: string;
}

export interface BucketModel {
    id: string;
    name: string;
    type: string;
    totalInitialAmount: string;
    totalUsedAmount: string;
    totalRemainingAmount: string;
    totalRemainingPercentage: string;
    instances: InstanceModel[];
}

interface Quota {
    usageType: string;
    quotaByName: BucketModel[]
}

export interface Account {
    accountName: string;
    accountInfo: AccountInfoModel;
    accountCredit: AccountCreditModel[];
    accountBalance: BalanceDetailModel[];
    outstandingDetails: OutstandingDetailModel[];
    paymentPlan: PaymentPlanModel[];
    billingDetails: BillingDetailsModel;
    customerBills: CustomerBills[];
}

interface AccountModel {
    accounts: Account[];
    quota: Quota[]
}

export default AccountModel;