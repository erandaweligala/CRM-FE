export interface GetCurrencyConversionListResponseModel{
    currencyConvertList: SingleCurrencyItem[];
}

export interface SingleCurrencyItem{
    id:string;
    fromCurrencyName: string;
    fromCurrencyValue: number;
    toCurrencyName: string;
    toCurrencyValue: number;
}