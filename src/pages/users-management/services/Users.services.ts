import NewCommonApiResponse from "../../../model/NewCommonApiResponse";
import axiosInstance from "../../../services/axios.service";
import {UserTableModel, UsersQueryModel} from "../models/UsersTable.model";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import {getErrorHumanReadableMessage} from "../../../helpers/backend-errors-human-readable";
import {UserViewModel} from "../models/UserView.model";
import {UserCreateModel, UserEditModel} from "../models/User.edit.model";
import {UserEmailValidModel} from "../models/UserEmailValid.model";
import CommonPageDetailsResponse from "../../../model/CommonPageDetailsResponse";
import {MetaDataModel} from "../models/MetaData.model";
import UserCustomPropertyModel from "../models/UserCustomProperty.model";
import { UserHierarchyGroup } from "../models/UserHierarchyGroupWithLevels.model";

export const getAllUsersData = async (queryParams: UsersQueryModel): Promise<[UserTableModel[], CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<UserTableModel[]>>(
            BackendEndpoints.USERS,
            {
                params: queryParams
            }
        );

        return [apiResponse.data.data, apiResponse.data.pageDetail!]

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getSingleUserData = async (userId: string): Promise<UserViewModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<UserViewModel>>(
            BackendEndpoints.SINGLE_USER + "/" + userId
        );

        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
export const getUserHierarchyGroupData = async (): Promise<UserHierarchyGroup[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<UserHierarchyGroup[]>>(
            BackendEndpoints.GET_USER_HIERARCHY_GROUP,
            {
            params: {
                limit: 100000,
                offset: 0
            }
            }
        );

        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const postEditUserData = async (payload: UserEditModel): Promise<UserViewModel> => {
    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<UserViewModel>>(
            BackendEndpoints.EDIT_USER,
            payload
        );
        showNotification("SUCCESS", "User updated successfully");
        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const postCreateNewUserData = async (payload: UserCreateModel): Promise<UserViewModel> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<UserViewModel>>(
            BackendEndpoints.CREATE_USER,
            payload
        );
        showNotification("SUCCESS", "User Created successfully");
        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const checkValidEmail = async (email: string): Promise<UserEmailValidModel> => {
    try {

        const apiResponse = await axiosInstance.post<NewCommonApiResponse<UserEmailValidModel>>(
            BackendEndpoints.CHECK_VALID_EMAIL + "/" + email
        );

        if (apiResponse.data.data.isValidUser === true) {
            return apiResponse.data.data
        } else {
            showNotification("ERROR", apiResponse.data.message);
            return apiResponse.data.data
        }

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getRolesData = async (): Promise<MetaDataModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<MetaDataModel[]>>(
            BackendEndpoints.META_DATA_ROLES
        );

        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getStatusData = async (): Promise<MetaDataModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<MetaDataModel[]>>(
            BackendEndpoints.META_DATA_STATUS
        );

        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getCustomProperties = async (): Promise<UserCustomPropertyModel[]> => {
    try {

        const apiResponse = await axiosInstance.get<NewCommonApiResponse<UserCustomPropertyModel[]>>(
           BackendEndpoints.GET_CUSTOM_PROPERTIES
        );

        return apiResponse.data.data

    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}