export interface GetGlobalCurrencyResponse{
   globalCurrencyList: SingleGlobalCurrencyModel[];
}

export interface SingleGlobalCurrencyModel{
    id: string;
    country: string;
    currencyCode: string;
}
