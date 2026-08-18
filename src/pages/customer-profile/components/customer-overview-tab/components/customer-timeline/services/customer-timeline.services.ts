import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse";
import axiosInstance from "../../../../../../../services/axios.service";
import { CustomerTimelineModel, CustomerTimelineRequestModel } from "../models/CustomerTimelineModel";
import BackendEndpoints from "../../../../../../../constants/backend-endpoints";
import showNotification from "../../../../../../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../../../../../../helpers/backend-errors-human-readable";

export const getCustomerTimelineData = async (queryParams:CustomerTimelineRequestModel): Promise<CustomerTimelineModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<CustomerTimelineModel[]>>(
            BackendEndpoints.CUSTOMER_TIMELINE,
            {
                params: queryParams
            }
        );

        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}