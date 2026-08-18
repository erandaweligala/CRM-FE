export interface GetCuurencyListResponseModel {
    currencyList: SingleCurrencyModel[];
}

export interface SingleCurrencyModel {
    id: string;
    name: string;
}
