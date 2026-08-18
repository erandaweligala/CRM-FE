import axiosInstance from "../../../../../services/axios.service.ts";
import BackendEndpoints from "../../../../../constants/backend-endpoints.ts";
import showNotification from "../../../../../services/notification.service.tsx";
import {getErrorHumanReadableMessage} from "../../../../../helpers/backend-errors-human-readable.ts";
import SingleNotification from "../models/SingleNotification.ts";
import NewCommonApiResponse from "../../../../../model/NewCommonApiResponse.ts";

export const getAllNotification = async (pageNumber:number, itemPerPage: number): Promise<[SingleNotification[], number]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SingleNotification[]>>(
            BackendEndpoints.GET_ALL_NOTIFICATION,
            {
                params: {
                    offset: pageNumber, // backend API offset(page number) is 0 based. page 1 = 0, page 2 = 1
                    limit: itemPerPage
                }
            }
        );

        const totalRecords: number = apiResponse.data.pageDetail?.totalRecords ?  parseInt(apiResponse.data.pageDetail.totalRecords): 0 ;

        return [apiResponse.data.data, totalRecords];

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const newNotification = async (durationInSeconds: number): Promise<SingleNotification[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SingleNotification[]>>(
            BackendEndpoints.NEW_NOTIFICATION,
            {
                params: {
                    duration: durationInSeconds
                }
            }
        );

        return apiResponse.data.data;

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}