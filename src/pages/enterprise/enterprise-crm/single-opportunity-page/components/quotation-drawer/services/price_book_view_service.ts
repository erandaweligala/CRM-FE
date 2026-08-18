import {ViewPricebookListRequestModel} from "../models/request/view_pricebook_list_request_model";
import BackendEndpoints from "../../../../../../../constants/backend-endpoints";
import axiosInstance from "../../../../../../../services/axios.service";
import {ViewPriceBookListResponseModel} from "../models/response/view_price_book_list_response_model";
import showNotification from "../../../../../../../services/notification.service";
import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse";

export const viewPriceBookList = async (viewPriceBookRequestParam: ViewPricebookListRequestModel, setTotalViewPriceBookPages: (totalViewPriceBookPages: number) => void): Promise<ViewPriceBookListResponseModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<ViewPriceBookListResponseModel>>(
            BackendEndpoints.VIEW_PRICE_BOOK_LIST,
            {
                params: viewPriceBookRequestParam
            }
        );
        setTotalViewPriceBookPages(apiResponse?.data?.pageDetail?.totalRecords ? parseInt(apiResponse?.data?.pageDetail?.totalRecords) : 0);
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", "View Price Book Failed");
        return error;
    }
}