import BackendEndpoints from "../../../../../../../constants/backend-endpoints";
import { ProductResponseBodyModel, ProductResponseSearchBody } from "../models/ProductDetailsListResponseBody.model";
import { AddProductRequestBodyModel, ProductQueryModel } from "../models/AddProductRequestBody.model";
import { getErrorHumanReadableMessage } from "../../../../../../../helpers/backend-errors-human-readable";
import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse";
import axiosInstance from "../../../../../../../services/axios.service";
import showNotification from "../../../../../../../services/notification.service";

export const getProductDetailsList = async (_referenceId: string): Promise<ProductResponseBodyModel> => {
    try {
        const response = await axiosInstance.get<NewCommonApiResponse<ProductResponseBodyModel>>(BackendEndpoints.PRODUCT_DETAILS_LIST_DEAL);
        return response.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const createProductDetails = async (data: AddProductRequestBodyModel): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.post(BackendEndpoints.PRODUCT_DETAILS_CREATE_DEAL, data);
        showNotification("SUCCESS", "Product Details Created Successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const searchProductDetails = async (searchPara: ProductQueryModel): Promise<ProductResponseSearchBody[]> => {
    try {
        const response = await axiosInstance.post<NewCommonApiResponse<ProductResponseSearchBody[]>>(BackendEndpoints.PRODUCT_DETAILS_LIST_DEAL_SEARCH, {
            referenceId: searchPara.referenceId,
            name: searchPara.productName,
            id: searchPara.productID,
            limit: 1000,
            offset: 0
        });
        return response.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const deleteProductDetails = async (dealID: string, id: string): Promise<"SUCCESS"> => {
    try {
        console.log(dealID);
        await axiosInstance.delete(`${BackendEndpoints.PRODUCT_DETAILS_DELETE_DEAL}/${id}`);
        showNotification("SUCCESS", "Product Details Deleted Successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}