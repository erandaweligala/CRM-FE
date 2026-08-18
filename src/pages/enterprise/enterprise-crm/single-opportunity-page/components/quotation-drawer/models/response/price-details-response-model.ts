export interface PricePlanInformation {
    result: Result;
    pricePlanInformation: ResponseData;
}
export interface Result {
    resultCode: string;
    resultDescription: string;
    pageDetail: {
        pageNumber: number;
        pageElementCount: number;
        totalRecords: number;
    };
}
export interface ResponseData {
    id: string;
    name: string;
    type: string;
    planType: string;
    rateType: string;
    description: string;
    version: string;
    validFor: {
        startDateTime: string;
        endDateTime: string;
    };
    basicInfo: BasicInfo[];
    MatrixPrice: MatrixPrice[];
}
export interface PlanInformation {
    planType: string;
}

export interface BasicInfo {
    name: string;
    type: string;
    code: string;
    fields: Field[];
}

interface Field {
    isVisible: boolean;
    isEditable: boolean;
    isRequired: boolean;
    dataType: string;
    fieldDisplayName: string;
    fieldName: string;
    fieldCode: string;
    defaultValue: string;
    value: string;
    enumValues?: EnumValue[];
}

interface EnumValue {
    value: string;
    meaning: string;
}

export interface MatrixPrice {
    name: string;
    code: string;
    rowDatas: string[];
    basicInfo: BasicInfo[];
    headDefinition: HeadDefinition[];
}

interface HeadDefinition {
    index: string;
    isVisible: boolean;
    isEditable: boolean;
    isRequired: boolean;
    dataType: string;
    columnName: string;
    fieldCode: string;
    defaultValue: string;
    enumValues: EnumValue[];
}
