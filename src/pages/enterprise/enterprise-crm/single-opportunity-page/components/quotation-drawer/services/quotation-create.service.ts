import axiosInstance from "../../../../../../../services/axios.service";
import BackendEndpoints from "../../../../../../../constants/backend-endpoints";
import {getErrorHumanReadableMessage} from "../../../../../../../helpers/backend-errors-human-readable";
import showNotification from "../../../../../../../services/notification.service";
import CommonApiResponse from "../../../../../../../model/CommonApiResponseQuotes";
import CreateQuoteRequestModel from "../models/request/create-quote-request-model";
import CreateQuoteResponseModel from "../models/response/create-quote-response-model";
import {QuotationListResponseModel} from "../models/response/quote-list-response-model";
import {GetQuoteListParamModel} from "../models/request/get-quote-list-param-model";
import { ServiceTypesResponseModel } from "../models/response/serviceTypesInfo-response-model";
import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse";

export const createQuote = async (createQuoteRequestBody: CreateQuoteRequestModel): Promise<CreateQuoteResponseModel> => {
    try {
        const apiResponse = await axiosInstance.post<CommonApiResponse<CreateQuoteResponseModel>>(
            BackendEndpoints.CREATE_QUOTE,
            createQuoteRequestBody
        );
        console.log("Create Quote Response", apiResponse.data.responseData);
        if (apiResponse.status === 200) {
            showNotification("SUCCESS", "Quote Created Successfully");
        }
        return apiResponse.data.responseData;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return error;
    }
}

export const getQuoteListForSearch = async (getQuoteListRequestParam: GetQuoteListParamModel, setTotalViewQuotationRecords: (totalViewQuotationPages: number) => void): Promise<QuotationListResponseModel> => {
    try {
        const apiResponse = await axiosInstance.get<CommonApiResponse<QuotationListResponseModel>>(
            BackendEndpoints.GET_QUOTE_LIST,
            {
                params: getQuoteListRequestParam
            }
        );
        setTotalViewQuotationRecords(apiResponse?.data?.result?.pageDetail?.totalRecords ? parseInt(apiResponse?.data?.result?.pageDetail?.totalRecords) : 0);
        return apiResponse.data.responseData;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return error;
    }
}

export const getServiceTypesInfo = async (): Promise<ServiceTypesResponseModel> => {
  try {
    const apiResponse =
      await axiosInstance.get<NewCommonApiResponse<ServiceTypesResponseModel>>(
        BackendEndpoints.GET_SERVICE_TYPES
      );
    return apiResponse.data.data;            
  } catch (error) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw error;
  }
};