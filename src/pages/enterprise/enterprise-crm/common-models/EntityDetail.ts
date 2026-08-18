interface EntityDetail {
    inputType: "TEXT_INPUT" | "TEXT_AREA" | "EMAIL" | "PHONE" | "LIST" | "DATE" | "NUMBER" | "USER_LIST" | "ACCOUNT_LIST" | "CONTACT_LIST"|"CURRENCY_UNIT_LIST";
    isDeletable: boolean;
    inputId: string;
    isRequired: boolean;
    section: string;
    columnIndex: string;
    rowIndex: string;
    inputLable: string;
    value: string|undefined;
    targetPath:string;
}

export default EntityDetail;