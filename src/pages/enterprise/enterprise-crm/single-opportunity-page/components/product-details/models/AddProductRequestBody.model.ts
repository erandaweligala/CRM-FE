export interface AddProductRequestBodyModel {
    id: string;
    name: string;
    category: string;
    referenceId: string;
    createBy: string;
}
export interface ProductQueryModel {
    productName: string;
    productCategory: string;
    productID: string;
    referenceId: string;
  }