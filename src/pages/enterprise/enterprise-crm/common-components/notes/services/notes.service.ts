import BackendEndpoints from "../../../../../../constants/backend-endpoints.ts";
import axiosInstance from "../../../../../../services/axios.service.ts";
import NewCommonApiResponse from "../../../../../../model/NewCommonApiResponse.ts";
import showNotification from "../../../../../../services/notification.service.tsx";
import {getErrorHumanReadableMessage} from "../../../../../../helpers/backend-errors-human-readable.ts";
import NotesListResponseBodyModel from "../models/NotesListResponseBody.model.ts";
import CreateAttachmentRequestBody from "../../attachments/models/CreateAttachmentRequestBody.ts";
import CreateNoteRequestBodyModel from "../models/CreateNoteRequestBody.model.ts";
import { EnterpriseCrmComponent } from "../../../../../../constants/EnterpriseCrmComponent.const.ts";

export const getNotesList = async (referenceId: string, component: EnterpriseCrmComponent): Promise<NotesListResponseBodyModel[]> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_LIST_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_LIST_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_LIST_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_LIST_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<NotesListResponseBodyModel[]>>(
            backendUrlAccordingToTheComponent + "/" + referenceId
        );
        return apiResponse.data.data;

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const deleteNote = async (id: string, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_DELETE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_DELETE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_DELETE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_DELETE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.delete(
            backendUrlAccordingToTheComponent + "/" + id,
        );
        showNotification("SUCCESS", "Note Deleted successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const createNote = async (requestBody: CreateNoteRequestBodyModel, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_CREATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_CREATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_CREATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_CREATE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.post(
            backendUrlAccordingToTheComponent,
            requestBody
        );
        showNotification("SUCCESS", "Create Note successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const updateNote = async (referenceId: string, requestBody: CreateNoteRequestBodyModel, component: EnterpriseCrmComponent): Promise<CreateAttachmentRequestBody> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_UPDATE_ACCOUNT;
        showNotification("SUCCESS", "Update Note successfully");
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_UPDATE_CONTACT;
        showNotification("SUCCESS", "Update Note successfully");
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_UPDATE_LEAD;
        showNotification("SUCCESS", "Update Note successfully");
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.NOTES_UPDATE_DEAL;
        showNotification("SUCCESS", "Update Note successfully");
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<CreateAttachmentRequestBody>>(
            backendUrlAccordingToTheComponent + "/" + referenceId,
            requestBody
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}