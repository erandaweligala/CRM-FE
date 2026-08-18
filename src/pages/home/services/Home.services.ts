import NewCommonApiResponse from "../../../model/NewCommonApiResponse";
import axiosInstance from "../../../services/axios.service";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import {getErrorHumanReadableMessage} from "../../../helpers/backend-errors-human-readable";
import { GuestToken, GuestTokenQueryParams } from "../models/GuestToken.model";

export const getGuestToken = async (queryParams: GuestTokenQueryParams): Promise<GuestToken> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<GuestToken>>(
            BackendEndpoints.Dashboard_SUPERSET_TOKEN_API,
            {
                params: queryParams
            }
        );
        return apiResponse.data.data;
    } catch (error: unknown) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getDashboardId = async (userDashboardID: string | null): Promise<string> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<string>>(
            `${BackendEndpoints.Dashboard_ID_API}/${userDashboardID}`,
        );
        return apiResponse.data.data;
    } catch (error: unknown) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
