import {getErrorHumanReadableMessage} from "../../../../../../helpers/backend-errors-human-readable";
import CommonPageDetailsResponse from "../../../../../../model/CommonPageDetailsResponse";
import NewCommonApiResponse from "../../../../../../model/NewCommonApiResponse";
import axiosInstance from "../../../../../../services/axios.service";
import showNotification from "../../../../../../services/notification.service";
import {TaskModel} from "../models/TaskModel.ts";
import {TaskTableQueryModel} from "../models/TaskTableQueryModel.ts";
import BackendEndpoints from "../../../../../../constants/backend-endpoints";
import { EnterpriseCrmComponent } from "../../../../../../constants/EnterpriseCrmComponent.const.ts";

export const getTaskList = async (queryParams: TaskTableQueryModel, component: EnterpriseCrmComponent): Promise<[TaskModel[], CommonPageDetailsResponse]> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_VIEW_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_VIEW_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_VIEW_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_VIEW_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<TaskModel[]>>(
            backendUrlAccordingToTheComponent,
            queryParams
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!];

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const createTask = async (payload: TaskModel, component: EnterpriseCrmComponent): Promise<TaskModel> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        payload.type="ACCOUNT";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_CREATE_ACCOUNT;
    } else if (component === "contacts") {
        payload.type="CONTACT";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_CREATE_CONTACT;
    } else if (component === "leads") {
        payload.type="LEAD";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_CREATE_LEAD;
    } else if (component === "deals") {
        payload.type="OPPORTUNITY";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_CREATE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<TaskModel>>(
            backendUrlAccordingToTheComponent,
            payload,
        );
        showNotification("SUCCESS", "Task created successfully");
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const deleteTask = async (id: string, component: EnterpriseCrmComponent): Promise<TaskModel> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_DELETE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_DELETE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_DELETE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_DELETE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.delete<NewCommonApiResponse<TaskModel>>(
            backendUrlAccordingToTheComponent + "/" + id,
        );
        showNotification("SUCCESS", "Task Deleted successfully");
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateTask = async (id: string, payload: TaskModel, component: EnterpriseCrmComponent): Promise<TaskModel> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        payload.type="ACCOUNT";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_UPDATE_ACCOUNT;
    } else if (component === "contacts") {
        payload.type="CONTACT";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_UPDATE_CONTACT;
    }  else if (component === "leads") {
        payload.type="LEAD";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_UPDATE_LEAD;
    } else if (component === "deals") {
        payload.type="OPPORTUNITY";
        backendUrlAccordingToTheComponent = BackendEndpoints.TASK_UPDATE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<TaskModel>>(
            backendUrlAccordingToTheComponent+ "/" + id,
            payload,
        );
        showNotification("SUCCESS", "Task Updated successfully");
        return apiResponse.data.data;

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}