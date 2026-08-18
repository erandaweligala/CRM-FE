import CommonPageDetailsResponse from "../../../../../../model/CommonPageDetailsResponse.ts";
import BackendEndpoints from "../../../../../../constants/backend-endpoints.ts";
import axiosInstance from "../../../../../../services/axios.service.ts";
import NewCommonApiResponse from "../../../../../../model/NewCommonApiResponse.ts";
import showNotification from "../../../../../../services/notification.service.tsx";
import {getErrorHumanReadableMessage} from "../../../../../../helpers/backend-errors-human-readable.ts";
import MeetingListQueryModel from "../models/MeetingListQuery.model.ts";
import MeetingListModel from "../models/MeetingList.model.ts";
import CreateMeetingRequestBodyModel from "../models/CreateMeetingRequestBody.model.ts";
import { EnterpriseCrmComponent } from "../../../../../../constants/EnterpriseCrmComponent.const.ts";

export const getMeetingList = async (queryParams: MeetingListQueryModel, component: EnterpriseCrmComponent): Promise<[MeetingListModel[], CommonPageDetailsResponse]> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_LIST_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_LIST_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_LIST_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_LIST_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<MeetingListModel[]>>(
            backendUrlAccordingToTheComponent,
            queryParams
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!];

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}


export const deleteMeeting = async (id: string, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_DELETE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_DELETE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_DELETE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_DELETE_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.delete(
            backendUrlAccordingToTheComponent + "/" + id,
        );
        showNotification("SUCCESS", "Meeting Deleted successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const createMeeting = async (requestBody: CreateMeetingRequestBodyModel, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_CREATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_CREATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_CREATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_CREATE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.post(
            backendUrlAccordingToTheComponent,
            requestBody
        );
        showNotification("SUCCESS", "Meeting Created successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}

export const updateMeeting = async (meetingId: string, requestBody: CreateMeetingRequestBodyModel, component: EnterpriseCrmComponent): Promise<"SUCCESS"> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_UPDATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_UPDATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_UPDATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.MEETING_UPDATE_DEAL;
    }else {
        throw new Error("Invalid Component Type");
    }

    try {
        await axiosInstance.put(
            backendUrlAccordingToTheComponent + "/" + meetingId,
            requestBody
        );
        showNotification("SUCCESS", "Meeting Updated successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}