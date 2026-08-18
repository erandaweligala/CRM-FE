export interface ViewPriceBookListResponseModel {
    priceBookLists: SinglePriceBook[];
}

export interface SinglePriceBook {
    id: string;
    bookName: string;
    status: string;
}
