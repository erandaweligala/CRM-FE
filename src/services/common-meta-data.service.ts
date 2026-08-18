import axiosInstance from "./axios.service";
import NewCommonApiResponse from "../model/NewCommonApiResponse";
import BackendEndpoints from "../constants/backend-endpoints";
import showNotification from "./notification.service";
import {getErrorHumanReadableMessage} from "../helpers/backend-errors-human-readable";
import AllUsersModel from "../model/AllUsers.model";
import {DropDownResponseModel} from "../pages/enterprise/enterprise-crm/contacts-page/models/DropDownData.response.model";
import DropdownValue from "../pages/enterprise/enterprise-crm/common-models/DropdownValue";

export const getAllSystemUsersList = async (): Promise<DropdownValue[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<AllUsersModel[]>>(
            BackendEndpoints.USER_NAMES,
        );

        const uniqueUsers = new Set<string>();
        return apiResponse.data.data
            .filter((singleUser) => {
            if (uniqueUsers.has(singleUser.name)) {
                return false;
            } else {
                uniqueUsers.add(singleUser.name);
                return true;
            }
            })
            .map((singleUser) => {
            return { label: singleUser.name, value: singleUser.name };
            });

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getAllAccountList = async (contactId?: string): Promise<DropdownValue[]> => {
    try {
        const endpoint = contactId 
            ? `${BackendEndpoints.ACCOUNT_PARENT_LIST}?contactId=${contactId}` 
            : BackendEndpoints.ACCOUNT_PARENT_LIST;

        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(endpoint);
        return apiResponse.data.data.map((singleAccount) => {
            return {
                label: singleAccount.name,
                value: singleAccount.id
            }
        });
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getAllContactList = async (accountId?:string): Promise<DropdownValue[]> => {
    try {
        const endpoint = accountId 
        ? `${BackendEndpoints.CONTACT_LIST_META_DATA}?accountId=${accountId}` 
        : BackendEndpoints.CONTACT_LIST_META_DATA;
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(endpoint);
        return apiResponse.data.data.map((singleAccount) => {
            return {
                label: singleAccount.name,
                value: singleAccount.id
            }
        })
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}