import NewCommonApiResponse from "../../../../../model/NewCommonApiResponse.ts";
import axiosInstance from "../../../../../services/axios.service.ts";
import BackendEndpoints from "../../../../../constants/backend-endpoints.ts";
import showNotification from "../../../../../services/notification.service.tsx";
import { getErrorHumanReadableMessage } from "../../../../../helpers/backend-errors-human-readable.ts";
import CommonPageDetailsResponse from "../../../../../model/CommonPageDetailsResponse.ts";
import { AccountTableModel } from "../models/AccountTable.model.ts";
import { AccountQueryModel } from "../models/AccountQuery.model.ts";
import EformsModel from "../models/Eforms.model.ts";
import StatusSectionModel from "../models/StatusSection.model.ts";
import { DropDownResponseModel } from "../../contacts-page/models/DropDownData.response.model.ts";
import LinkedAccountModel from "../models/LinkedAccount.model.ts";
import EntityDetail from "../../common-models/EntityDetail.ts";
import DropdownValue from "../../common-models/DropdownValue.ts";
import { LeadOpportunityInfo } from "../../single-lead-page/models/LeadOpportunityInfo.model.ts";
import { OpportunityLeadInfo } from "../../single-opportunity-page/models/OpportunityLeadInfo.model.ts";

type UseCaseType = "view" | "edit-create" | "all";

export const getAllAccountData = async (payload: AccountQueryModel): Promise<[AccountTableModel[], CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<AccountTableModel[]>>(
            BackendEndpoints.ACCOUNT_DATA,
            payload
        );
        return [apiResponse.data.data, apiResponse.data.pageDetail!]

    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getParentAccountData = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.ACCOUNT_PARENT_LIST,

        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getOwnerList = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropDownResponseModel[]>>(
            BackendEndpoints.USER_NAMES,

        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }

}
export const getAccountById = async (accountId: string, useCase: UseCaseType): Promise<EntityDetail[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EntityDetail[]>>(
            BackendEndpoints.GET_ACCOUNT_BY_ID + "/" + accountId,
            {
                params: {useCase}
            }
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getContactById = async (contactId: string, useCase:UseCaseType): Promise<{
    properties: EntityDetail[];
    linkedAccounts: LinkedAccountModel[]
}> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<{
            properties: EntityDetail[];
            linkedAccounts: LinkedAccountModel[]
        }>>(
            BackendEndpoints.GET_CONTACT_BY_ID + "/" + contactId,
            {
                params: {useCase}
            }
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getLeadById = async (leadId: string, useCase: UseCaseType): Promise<EntityDetail[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EntityDetail[]>>(
            BackendEndpoints.GET_LEAD_BY_ID + "/" + leadId,
            {
                params: {useCase}
            }
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getLeadOpportunityInfoById = async (leadId: string): Promise<LeadOpportunityInfo[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<LeadOpportunityInfo[]>>(
            BackendEndpoints.GET_LEAD_OPPORTUNITY_INFO_BY_ID + "/" + leadId);
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getDealById = async (dealId: string, useCase: UseCaseType): Promise<{formData: EntityDetail[]; timeLineData: StatusSectionModel[];leadInformation:OpportunityLeadInfo[]}> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<{formData: EntityDetail[]; timeLineData: StatusSectionModel[];leadInformation:OpportunityLeadInfo[]}>>(
            BackendEndpoints.GET_DEAL_BY_ID + "/" + dealId,
            {
                params: {useCase}
            }
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getAccountFormList = async (): Promise<EformsModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EformsModel[]>>(
            BackendEndpoints.GET_ACCOUNT_FORM_LIST,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getContactFormList = async (): Promise<EformsModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EformsModel[]>>(
            BackendEndpoints.GET_CONTACT_FORM_LIST,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getLeadFormList = async (): Promise<EformsModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EformsModel[]>>(
            BackendEndpoints.GET_LEADS_FORM_LIST,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getDealFormList = async (): Promise<EformsModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EformsModel[]>>(
            BackendEndpoints.GET_DEALS_FORM_LIST,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getFormDetailsByFormId = async (formId: string): Promise<EntityDetail[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<EntityDetail[]>>(
            BackendEndpoints.GET_FORM_BY_ID + "/" + formId,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getDropdownValues = async (inputId: string): Promise<DropdownValue[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<DropdownValue[]>>(
            BackendEndpoints.GET_DROPDOWN_VALUES + "/" + inputId,
        );
        return apiResponse.data.data
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const createAccount = async (formId: string, requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.CREATE_ACCOUNT + "/" + formId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateAccount = async (accountId: string ,requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.CREATE_ACCOUNT + "/" + accountId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const createContact = async (formId: string, requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.CREATE_CONTACT + "/" + formId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateContact = async (contactId: string,  requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_CONTACT + "/" + contactId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const createLead = async (formId: string, requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.CREATE_LEAD + "/" + formId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateLead = async (leadId: string,  requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_LEAD + "/" + leadId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const createDeal = async (formId: string, requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.CREATE_DEAL + "/" + formId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateDeal = async (leadId: string,  requestBody: {inputId: string; value: string}[]): Promise<"SUCCESS"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_DEAL + "/" + leadId,
            requestBody
        );
        return "SUCCESS"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}