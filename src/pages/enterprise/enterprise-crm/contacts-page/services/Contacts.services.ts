import NewCommonApiResponse from "../../../../../model/NewCommonApiResponse";
import axiosInstance from "../../../../../services/axios.service";
import BackendEndpoints from "../../../../../constants/backend-endpoints";
import showNotification from "../../../../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../../../../helpers/backend-errors-human-readable";
import CommonPageDetailsResponse from "../../../../../model/CommonPageDetailsResponse";
import { DropDownResponseModel } from "../models/DropDownData.response.model";
import { ContactQueryModel } from "../models/ContactQuery.model";
import { ContactTableModel } from "../models/ContactTable.model";
import store from "../../../../../store/main-store.ts";
import {metaDataAction} from "../../../../../store/meta-data.slice.ts";

export const getAllContactData = async (payload: ContactQueryModel): Promise<[ContactTableModel[], CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<ContactTableModel[]>>(
            BackendEndpoints.CONTACT_DATA,
            payload
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!]
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getContactsAccountData = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.CONTACT_META_DATA,
        );
        return apiResponse.data.data
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getStatusData = async (): Promise<DropDownResponseModel[]> => {
    try {
        const metaData = store.getState().metaData.metaData.find((metaData) => metaData.metaDataId === "CONTACT_STATUS");
        if (metaData) return metaData.data;
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.PARTY_STATUS,
        );
        store.dispatch(metaDataAction.setMetaData({ metaDataId: "CONTACT_STATUS", data: apiResponse.data.data }));
        return apiResponse.data.data
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getIndustryList = async (): Promise<DropDownResponseModel[]> => {
    try {
        const metaData = store.getState().metaData.metaData.find((metaData) => metaData.metaDataId === "INDUSTRY_LIST");;
        if (metaData) return metaData.data;
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.INDUSTRY_LIST,
        );
        store.dispatch(metaDataAction.setMetaData({ metaDataId: "INDUSTRY_LIST", data: apiResponse.data.data }));
        return apiResponse.data.data
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getAccountType = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.ACCOUNT_TYPE_LIST,
        );
        return apiResponse.data.data
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
