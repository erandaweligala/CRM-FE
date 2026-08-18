import CommonPageDetailsResponse from "../../../../../../model/CommonPageDetailsResponse.ts";
import BackendEndpoints from "../../../../../../constants/backend-endpoints.ts";
import axiosInstance from "../../../../../../services/axios.service.ts";
import NewCommonApiResponse from "../../../../../../model/NewCommonApiResponse.ts";
import showNotification from "../../../../../../services/notification.service.tsx";
import {getErrorHumanReadableMessage} from "../../../../../../helpers/backend-errors-human-readable.ts";
import AttachmentsListRequestBodyModel from "../models/AttachmentsListRequestBody.model.ts";
import CreateAttachmentRequestBody from "../models/CreateAttachmentRequestBody.ts";
import AttachmentsListResponseBodyModel from "../models/AttachmentsListResponseBody.model.ts";
import { EnterpriseCrmComponent } from "../../../../../../constants/EnterpriseCrmComponent.const.ts";
import BRCopyUploadRequestBody from "../models/BRCopyUploadRequestBody.ts";

export const getAttachmentList = async (requestBody: AttachmentsListRequestBodyModel, component: EnterpriseCrmComponent): Promise<[AttachmentsListResponseBodyModel[], CommonPageDetailsResponse]> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_LIST_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_LIST_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_LIST_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_LIST_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<AttachmentsListResponseBodyModel[]>>(
            backendUrlAccordingToTheComponent,
            requestBody
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!];

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const deleteAttachment = async (id: string, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DELETE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DELETE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DELETE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DELETE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.delete(
            backendUrlAccordingToTheComponent + "/" + id,
        );
        showNotification("SUCCESS", "Attachment Deleted successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const createAttachment = async (requestBody: CreateAttachmentRequestBody, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_CREATE_ACCOUNT;
        requestBody.type="ACCOUNT";
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_CREATE_CONTACT;
        requestBody.type="CONTACT";
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_CREATE_LEAD;
        requestBody.type="LEAD";
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_CREATE_DEAL;
        requestBody.type="OPPORTUNITY";
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.post(
            backendUrlAccordingToTheComponent,
            requestBody
        );
        showNotification("SUCCESS", "Attachment Uploaded successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const downloadAttachment = async (attachmentId: string, component: EnterpriseCrmComponent): Promise<CreateAttachmentRequestBody> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DOWNLOAD_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DOWNLOAD_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DOWNLOAD_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_DOWNLOAD_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<CreateAttachmentRequestBody>>(
            backendUrlAccordingToTheComponent + "/" + attachmentId
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const BRCopyUpload = async (requestBody: BRCopyUploadRequestBody, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_BR_COPY_UPLOAD;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_BR_COPY_UPLOAD;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_BR_COPY_UPLOAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.ATTACHMENT_BR_COPY_UPLOAD;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.post(
            backendUrlAccordingToTheComponent,
            requestBody
        );
        console.log("BR COPY UPLOAD API CALLING...")
        showNotification("SUCCESS", "Attachment Approved Successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}