import BackendEndpoints from "../../../../../../../constants/backend-endpoints";
import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse";
import axiosInstance from "../../../../../../../services/axios.service";
import showNotification from "../../../../../../../services/notification.service";
import { Quote, QuotesResponseBodyModel, ReinitiateQuotePayload } from "../model/agreement-quote-body-model";

export const getAccountAgreements = async (
  accountId: string,
  offset: number,
  limit: number
): Promise<{ quoteList: Quote[]; total: number }> => {
  const data  = await axiosInstance.get<NewCommonApiResponse<QuotesResponseBodyModel>>(
          BackendEndpoints.GET_ACCOUNT_AGREEMENTS,
    {
      params: {
        organizationId: accountId,
        offset,
        limit,
      },
    }
  );
  return {
    quoteList: data?.data.data.quoteList ?? [],
    total: Number(data?.data.pageDetail?.totalRecords ?? 0),
  };
};

export const reinitiateQuote = async (payload: ReinitiateQuotePayload) => {
    await axiosInstance.post(BackendEndpoints.REINITIATE_AGREEMENT, payload);
    showNotification("SUCCESS", "Renew Agreement Successfully");
};

