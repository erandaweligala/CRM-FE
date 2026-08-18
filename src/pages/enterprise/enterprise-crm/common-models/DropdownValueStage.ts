export interface DropdownValue {
    label: string;
    value: string;
    id:number;
    allowedTransitions: number[];
    statusOrder: number;
}

export default DropdownValue;