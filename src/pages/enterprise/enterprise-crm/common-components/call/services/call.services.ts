import {getErrorHumanReadableMessage} from "../../../../../../helpers/backend-errors-human-readable.ts";
import CommonPageDetailsResponse from "../../../../../../model/CommonPageDetailsResponse.ts";
import NewCommonApiResponse from "../../../../../../model/NewCommonApiResponse.ts";
import axiosInstance from "../../../../../../services/axios.service.ts";
import showNotification from "../../../../../../services/notification.service.tsx";
import {CallModel} from "../model/CallModel.ts";
import {CallTableQueryModel} from "../model/CallTableQueryModels.ts";
import BackendEndpoints from "../../../../../../constants/backend-endpoints.ts";
import { EnterpriseCrmComponent } from "../../../../../../constants/EnterpriseCrmComponent.const.ts";

export const getCallList = async (queryParams: CallTableQueryModel,component: EnterpriseCrmComponent ): Promise<[CallModel[],CommonPageDetailsResponse]> => {
    
    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_VIEW_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_VIEW_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_VIEW_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_VIEW_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<CallModel[]>>(
            backendUrlAccordingToTheComponent,
            queryParams
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!];

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const postCallList = async (payload: CallModel, component: EnterpriseCrmComponent): Promise<CallModel> => {
    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_CREATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_CREATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_CREATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_CREATE_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<CallModel>>(
            backendUrlAccordingToTheComponent,
            payload,
        );
        showNotification("SUCCESS", "Call Added successfully");
        return apiResponse.data.data;
    } 
    
    catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const deleteCallList = async (id: string, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {
    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_DELETE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_DELETE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_DELETE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_DELETE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.delete(
            backendUrlAccordingToTheComponent + "/" + id,
        );
        showNotification("SUCCESS", "Call Details Deleted successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateCallList = async (id: string, payload: CallModel, component: EnterpriseCrmComponent): Promise<CallModel> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_UPDATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_UPDATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_UPDATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.CALL_UPDATE_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<CallModel>>(
            backendUrlAccordingToTheComponent+ "/" + id,
            payload,
        );
        showNotification("SUCCESS", "Call Details Updated successfully");
        return apiResponse.data.data;

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
