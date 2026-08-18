import axiosInstance from "../../../services/axios.service";
import { TermsAndConditionsModel } from "../models/TermsAndConditionsModel";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../../helpers/backend-errors-human-readable";
import NewCommonApiResponse from "../../../model/NewCommonApiResponse";

// Get all terms
export const getAllTerms = async (): Promise<TermsAndConditionsModel[]> => {
  try {
    const res = await axiosInstance.get<NewCommonApiResponse<TermsAndConditionsModel[]>>(
      BackendEndpoints.GET_ALL_QUOTE_CONFIGURATION
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error(getErrorHumanReadableMessage(error));
  }
};

// Get term by ID
export const getTermById = async (id: string): Promise<TermsAndConditionsModel> => {
  try {
    const res = await axiosInstance.get<NewCommonApiResponse<TermsAndConditionsModel>>(
      BackendEndpoints.GET_BY_ID_QUOTE_CONFIGURATION+ "/" +id
    );
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error(getErrorHumanReadableMessage(error));
  }
};

// Create new term
export const createTerm = async (term: Partial<TermsAndConditionsModel>): Promise<TermsAndConditionsModel> => {
  try {
    const res = await axiosInstance.post<NewCommonApiResponse<TermsAndConditionsModel>>(
      BackendEndpoints.CREATE_QUOTE_CONFIGURATION,
      term
    );
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error(getErrorHumanReadableMessage(error));
  }
};

// Update term
export const updateTerm = async (id: string, term: Partial<TermsAndConditionsModel>): Promise<TermsAndConditionsModel> => {
  try {
    const res = await axiosInstance.put<NewCommonApiResponse<TermsAndConditionsModel>>(
      BackendEndpoints.UPDATE_QUOTE_CONFIGURATION+ "/" +id,
      term
    );
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error(getErrorHumanReadableMessage(error));
  }
};

// Delete term
export const deleteTerm = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(BackendEndpoints.DELETE_QUOTE_CONFIGURATION+ "/" +id);
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error(getErrorHumanReadableMessage(error));
  }
};