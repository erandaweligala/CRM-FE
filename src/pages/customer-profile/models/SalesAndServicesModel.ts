export interface OrderDetailsModel {
    orderItemAction: string;
    orderItemId: string;
    productOrderId: string;
    role: string;
}

export interface ProductsModel {
    bundleProduct: boolean;
    productId: string;
    productName: string;
    startDate: string;
    status: string;
    terminateDate: string;
    offerCharacteristic: {
        attributeName: string;
        attributeValue: string;
    }[];
    orderDetails: OrderDetailsModel[];
}

interface SalesAndServicesModel {
    categoryName: string;
    products: ProductsModel[]
}

export default SalesAndServicesModel;