import CommonPageDetailsResponse from "../../../model/CommonPageDetailsResponse";
import NewCommonApiResponse from "../../../model/NewCommonApiResponse";
import axiosInstance from "../../../services/axios.service";
import { RoleTableModel } from "../models/RoleTableModel";
import { RoleTableQueryModel } from "../models/RoleTableQueryModel";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../../helpers/backend-errors-human-readable";
import { RoleViewModel } from "../models/Role.View.model";
import { PermissionsMetaDataModel } from "../models/Permissions.meta-date.model";
import { RoleEditModel } from "../models/Role.edit.mode";
import { MenuToComponentModel } from "../models/MenuToComponent.model";

export const getRolesData = async (queryParams:RoleTableQueryModel): Promise<[RoleTableModel[],CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<RoleTableModel[]>>(
            BackendEndpoints.ROLES,
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


export const getSingleRolesData = async (roleId:string): Promise<RoleViewModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<RoleViewModel>>(
            BackendEndpoints.SINGLE_ROLE + "/" + roleId,
        );

        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getPermissionsMetaData = async (): Promise<PermissionsMetaDataModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<PermissionsMetaDataModel[]>>(
            BackendEndpoints.META_DATA_PERMISSIONS,
        );

        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const putEditRoleData = async (payload:RoleEditModel): Promise<RoleViewModel> => {
    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<RoleViewModel>>(
            BackendEndpoints.EDIT_ROLE,
            payload,
        );
        showNotification("SUCCESS", "Role updated successfully");
        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const postCreateNewRole = async (payload:RoleEditModel): Promise<RoleViewModel> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<RoleViewModel>>(
            BackendEndpoints.CREATE_NEW_ROLE,
            payload,
        );
        showNotification("SUCCESS", "Role created successfully");
        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const getMenuToComponentData = async (): Promise<MenuToComponentModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<MenuToComponentModel[]>>(
            BackendEndpoints.MENU_TO_COMPONENT,
        );

        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}