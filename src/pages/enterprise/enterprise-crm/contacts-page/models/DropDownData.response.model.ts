export interface DropDownResponseModel {
    id:string
    value: string;
    name: string;
    label: string;
    isQuotaEnabled?: boolean;
    allowedTransitions: number[];
    statusOrder: number;
}