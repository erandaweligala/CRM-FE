import {getErrorHumanReadableMessage} from "../../../../../../helpers/backend-errors-human-readable.ts";
import CommonPageDetailsResponse from "../../../../../../model/CommonPageDetailsResponse.ts";
import NewCommonApiResponse from "../../../../../../model/NewCommonApiResponse.ts";
import axiosInstance from "../../../../../../services/axios.service.ts";
import showNotification from "../../../../../../services/notification.service.tsx";
import BackendEndpoints from "../../../../../../constants/backend-endpoints.ts";
import {EmailTableQueryModel} from "../models/EmailTableQueryModel.ts";
import {EmailModel} from "../models/EmailModel.ts";
import {DropDownEmailResponseModel} from "../models/dropDownData.model.ts";
import { EnterpriseCrmComponent } from "../../../../../../constants/EnterpriseCrmComponent.const.ts";
import EmailRecipientModel from "../models/EmailRecipientModel.model.ts";

export const getEmailList = async (queryParams: EmailTableQueryModel,component: EnterpriseCrmComponent ): Promise<[EmailModel[],CommonPageDetailsResponse]> => {
    
    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_VIEW_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_VIEW_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_VIEW_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_VIEW_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<EmailModel[]>>(
            backendUrlAccordingToTheComponent,
            queryParams
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!];

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getSingleEmail = async (id: string, queryParams: EmailTableQueryModel,component: EnterpriseCrmComponent ): Promise<EmailModel> => {
    
    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_SINGLE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_SINGLE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_SINGLE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_SINGLE_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const response = await axiosInstance.get<NewCommonApiResponse<EmailModel>>(
            backendUrlAccordingToTheComponent+ "/" + id,
            {params: queryParams}
        );
        return response.data.data;

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const postEmailList = async (payload: EmailModel, component: EnterpriseCrmComponent): Promise<EmailModel> => {
    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_CREATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_CREATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_CREATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_CREATE_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<EmailModel>>(
            backendUrlAccordingToTheComponent,
            payload,
        );
        showNotification("SUCCESS", "Email Added successfully");
        return apiResponse.data.data;
    } 
    
    catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateEmailList = async (id: string, payload: EmailModel, component: EnterpriseCrmComponent): Promise<EmailModel> => {

    let backendUrlAccordingToTheComponent: string;

    if (component === "accounts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_UPDATE_ACCOUNT;
    } else if (component === "contacts") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_UPDATE_CONTACT;
    } else if (component === "leads") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_UPDATE_LEAD;
    } else if (component === "deals") {
        backendUrlAccordingToTheComponent = BackendEndpoints.EMAIL_UPDATE_DEAL;
    } else {
        throw new Error("Invalid Component Type");
    }

    try {
        const apiResponse = await axiosInstance.put<NewCommonApiResponse<EmailModel>>(
            backendUrlAccordingToTheComponent+ "/" + id,
            payload,
        );
        showNotification("SUCCESS", "Email Details Updated successfully");
        return apiResponse.data.data;

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getEmailRecipient = async (): Promise<DropDownEmailResponseModel[]> => {
  try {
    const userApiResponse = await axiosInstance.get<NewCommonApiResponse<EmailRecipientModel[]>>(
      BackendEndpoints.USER_NAMES
    );

    const contactApiResponse = await axiosInstance.get<NewCommonApiResponse<EmailRecipientModel[]>>(
      BackendEndpoints.CONTACT_LIST_META_DATA
    );

    const users = userApiResponse.data.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      recipientType: "USER"
    }));

    const contacts = contactApiResponse.data.data.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      recipientType: "CONTACT"
    }));

    const uniqueMap = new Map<string, DropDownEmailResponseModel>();

    [...users, ...contacts].forEach((item) => {
      if (!uniqueMap.has(item.email)) {
        uniqueMap.set(item.email, item);
      }
    });

    return Array.from(uniqueMap.values());
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error("Failed to fetch email recipients.");
  }
};

