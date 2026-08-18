import ContactInAccountModel from "../models/ContactInAccount.model.ts";
import NewCommonApiResponse from "../../../../../../../model/NewCommonApiResponse.ts";
import axiosInstance from "../../../../../../../services/axios.service.ts";
import API_ENDPOINTS from "../../../../../../../constants/backend-endpoints.ts";
import showNotification from "../../../../../../../services/notification.service.tsx";
import {getErrorHumanReadableMessage} from "../../../../../../../helpers/backend-errors-human-readable.ts";

export const getContactListByAccountId = async (accountId: string): Promise<ContactInAccountModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<ContactInAccountModel[]>>(
            API_ENDPOINTS.GET_CONTACT_LIST_BY_ACCOUNT_ID + "/" + accountId,
        );
        return apiResponse.data.data;
    }

    catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const addContactToAccount = async (contactId: string, accountId: string, accountName: string): Promise<void> => {
    try {
        await axiosInstance.post<NewCommonApiResponse<null>>(
            API_ENDPOINTS.ADD_ACCOUNT_TO_GIVEN_CONTACT,
            {
                contactId: contactId,
                accountId: accountId,
                accountName: accountName
            }
        );
    }

    catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const removeAccountFromContact = async (contactId: string, accountId: string, accountName: string): Promise<void> => {
    try {
        await axiosInstance.delete<NewCommonApiResponse<null>>(
            API_ENDPOINTS.REMOVE_ACCOUNT_FROM_CONTACT,
            {
                data: {
                    contactId: contactId,
                    accountId: accountId,
                    accountName: accountName
                }
            }
        );
    }
    catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}