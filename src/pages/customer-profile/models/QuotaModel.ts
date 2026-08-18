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

interface QuotaModel {
    data: BucketModel[];
    voice: BucketModel[];
    sms: BucketModel[];
}

export default QuotaModel;
