import NewCommonApiResponse from "../../../model/NewCommonApiResponse";
import axiosInstance from "../../../services/axios.service";
import { ActionLogQueryParamsModel, ActionLogsModel, SearchDropdownModel } from "../models/ActionLogsModel";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../../helpers/backend-errors-human-readable";
import CommonPageDetailsResponse from "../../../model/CommonPageDetailsResponse";

export const getActionLogsData = async (queryParams:ActionLogQueryParamsModel): Promise<[ActionLogsModel[],CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<ActionLogsModel[]>>(
            BackendEndpoints.ACTION_LOGS,
            {
                params: queryParams
            }
        );

        return [apiResponse.data.data,apiResponse.data.pageDetail!]
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getSearchTypesData = async (): Promise<SearchDropdownModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SearchDropdownModel[]>>(
            BackendEndpoints.SEARCH_TYPES,
        );

        return apiResponse.data.data

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getStatusCodesData = async (): Promise<SearchDropdownModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SearchDropdownModel[]>>(
            BackendEndpoints.STATUS_CODES,
        );

        return apiResponse.data.data

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getUserNameData = async (): Promise<SearchDropdownModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SearchDropdownModel[]>>(
            BackendEndpoints.USER_NAMES,
        );

        return apiResponse.data.data

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getActivitiesData = async (): Promise<SearchDropdownModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SearchDropdownModel[]>>(
            BackendEndpoints.ACTIVITIES,
        );

        return apiResponse.data.data

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}