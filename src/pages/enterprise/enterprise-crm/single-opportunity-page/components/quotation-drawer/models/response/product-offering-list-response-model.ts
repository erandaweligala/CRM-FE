export interface ProductData {
    productList: Product[],
}

export interface Product {
    id: string;
    href: string;
    name: string;
    category: ProductOfferingCategory[];
    productOfferingPrice: ProductOfferingPrice[];
    prodSpecCharValueUse: ProdSpecCharValueUse[];
    type: string;
    baseType: string;
}

export interface ProdSpecCharValueUse {
    charType: string;
    name: string;
    productSpecCharacteristicValue: ProductSpecCharacteristicValue[]
}

export interface ProductSpecCharacteristicValue {
    valueType: string;
    value: string;
}

export interface ProductOfferingCategory {
    id: string;
    href: string;
    name: string;
}

export interface ProductOfferingPrice {
    id: string;
    href: string;
    name: string;
    type: string;
    baseType: string;
}