interface ProductDetailsListResponseBodyModel {
    id: string;
    name: string;
    categoryName: string;
    lifecycleStatus: string;
    description: string;
}
export interface ProductResponseBodyModel {
    productOfferings: ProductDetailsListResponseBodyModel[];
}
export interface ProductResponseSearchBody {
    id: string;
    name: string;
    category: string;
    productId: string;
}

export default ProductDetailsListResponseBodyModel;