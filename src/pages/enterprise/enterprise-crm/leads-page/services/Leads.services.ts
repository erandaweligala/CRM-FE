import NewCommonApiResponse from "../../../../../model/NewCommonApiResponse";
import axiosInstance from "../../../../../services/axios.service";
import BackendEndpoints from "../../../../../constants/backend-endpoints";
import showNotification from "../../../../../services/notification.service";
import {getErrorHumanReadableMessage} from "../../../../../helpers/backend-errors-human-readable";
import CommonPageDetailsResponse from "../../../../../model/CommonPageDetailsResponse";
import {LeadsQueryModel} from "../models/LeadsQuery.model";
import {LeadsTableModel} from "../models/LeadsTable.model";
import {DropDownResponseModel} from "../../contacts-page/models/DropDownData.response.model";
import ConvertLeadToDealRequestModel from "../models/ConvertLeadToDealRequest.model";

export const getAllLeadData = async (payload: LeadsQueryModel): Promise<[LeadsTableModel[], CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<LeadsTableModel[]>>(
            BackendEndpoints.LEADS_DATA,
            payload
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!]

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getLeadsAccountData = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.LEADS_META_DATA,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const convertLeadToDeal = async (leadId: string, requestBody: ConvertLeadToDealRequestModel): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.CONVERT_LEAD + "/" + leadId,
            requestBody
        );
        showNotification("SUCCESS", "Lead Successfully Converted To Opportunity");
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getLeadSourceList = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.LEAD_SOURCE,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getLeadStatusData = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.LEAD_STATUS_DATA,

        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}



