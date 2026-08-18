export interface ViewPriceBookByIdResponseModel {
    priceBookDetails: PriceBookByIdInfo;
}

export interface PriceBookByIdInfo {
    bookId: string;
    bookName: string;
    description: string;
    productList: PriceBookByIdProductList[];
}

export interface PriceBookByIdProductList {
    productName: string;
    productId: string;
    pricePlans: PriceBookByIdPricePlan[];
}

export interface PriceBookByIdPricePlan {
    planName: string;
    listPrice: number;
    currency: string;
    discount: string;
    totalPrice: string;
}