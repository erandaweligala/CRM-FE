import {getErrorHumanReadableMessage} from "../../../../../../../helpers/backend-errors-human-readable.ts";
import axiosInstance from "../../../../../../../services/axios.service.ts";
import showNotification from "../../../../../../../services/notification.service.tsx";
import BackendEndpoints from "../../../../../../../constants/backend-endpoints.ts";
import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse.ts";
import CommonApiResponse from "../../../../../../../model/CommonApiResponseQuotes.ts";
import { ChangeQuoteStatusRequestModel } from "../models/request/change-quote-status-request-model.ts";
import { AxiosInstance } from "axios";
import {ConvertToSaleRequestModel, QuotesResponseBodyModel} from "../models/quotes-response-body-model.ts";

export const getQuotationDetailsList = async (referenceId: string): Promise<QuotesResponseBodyModel> => {
    try {
        const response = await axiosInstance.get<NewCommonApiResponse<QuotesResponseBodyModel>>(
            `${BackendEndpoints.QUOTES_DETAILS_LIST_DEAL}?opportunityId=${referenceId}&offset=0&limit=1000`
        );
        return response.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const createReinitiateQuotation = async (parentId: string, quotationName: string): Promise<"SUCCESS"> => {
    try {
        const payload = {
            parentId: parentId,
            quotationName: quotationName,
        };
        await axiosInstance.post(BackendEndpoints.REINITIATE_QUOTE, payload);
        showNotification("SUCCESS", `Quotation with ID ${parentId} has been successfully reinitiated as ${quotationName}`);
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const updateQuote = async (
  quoteId: string,
  payload:ConvertToSaleRequestModel
): Promise<NewCommonApiResponse<ConvertToSaleRequestModel>> => {
  try {
    const { data, status } = await axiosInstance.put<
      NewCommonApiResponse<ConvertToSaleRequestModel>
    >(`${BackendEndpoints.UPDATE_QUOTE}/${quoteId}`,payload);

    console.log("Convert-to-Sale response", data);

    if (status === 200) {
      showNotification("SUCCESS", "Opportunity converted to Sale Order successfully");
    }
    return data;                          
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw error;
  }
};

export const changeQuoteStatus = async (quoteId: string | undefined, requestBody: ChangeQuoteStatusRequestModel, axiosInstance: AxiosInstance): Promise<CommonApiResponse<any>> => {
    try {
        const apiResponse = await axiosInstance.put<CommonApiResponse<any>>(
            BackendEndpoints.CHANGE_QUOTE_STATUS + '/' + quoteId,
            requestBody
        );
        if (apiResponse?.status === 200) {
            showNotification("SUCCESS", "Quote Status Changed Successfully");
        }
        return apiResponse.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return error;
    }
}
