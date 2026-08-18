import CommonPageDetailsResponse from "../../../model/CommonPageDetailsResponse";
import NewCommonApiResponse from "../../../model/NewCommonApiResponse";
import axiosInstance from "../../../services/axios.service";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../../helpers/backend-errors-human-readable";
import { PermissionByComponentIdAndMenuId, PermissionsQueryModel } from "../models/PermissionsQueryModel";
import { PermissionsTableModel } from "../models/PermissionsTableModel";
import { PermissionByComponentIdModel, PermissionViewModel } from "../models/PermissionViewModel";
import { PermissionsEditModel } from "../models/PermissionEditModel";

export const getPermissionsData = async (queryParams:PermissionsQueryModel): Promise<[PermissionsTableModel[],CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<PermissionsTableModel[]>>(
            BackendEndpoints.PERMISSIONS,
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


export const getSinglePermissionData = async (permissionId:string): Promise<PermissionViewModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<PermissionViewModel>>(
            BackendEndpoints.SINGLE_PERMISSION + "/" + permissionId,
        );

        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getPermissionByComponentId = async (queryParams:PermissionByComponentIdAndMenuId): Promise<PermissionByComponentIdModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<PermissionByComponentIdModel>>(
            BackendEndpoints.PERMISSION_BY_COMPONENT,
            {
                params: {
                    componentId: queryParams.componentId,
                }
            }
        );

        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const putEditPermissionData = async (payload: PermissionsEditModel): Promise<any> => {
    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.EDIT_PERMISSION,
            payload,
        );
        showNotification("SUCCESS", "Permission updated successfully");
        return apiResponse.data.data;
        
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const postCreatePermissionData = async (payload: PermissionsEditModel): Promise<any> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.CREATE_PERMISSION,
            payload,
        );
        showNotification("SUCCESS", "Permission created successfully");
        return apiResponse.data.data;
        
    } catch (error: any) {
        
        if(error.response.data.message === "Name already Exists"){

            showNotification("ERROR", "Name already Exists");

        }else{

            showNotification("ERROR", getErrorHumanReadableMessage(error));
            
        }
        throw new Error();
    }
}