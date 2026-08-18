export interface CallModel {
    id?: string;
    callType: string;
    callMedium: string;
    status: string;
    startDateTime: string;
    subject: string;
    purpose: string;
    agenda: string;
    referenceId?: string;
    ownerId?: string;
}