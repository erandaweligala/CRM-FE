import axiosInstance from "../../services/axios.service";
import BackendEndpoints from "../../constants/backend-endpoints";
import NewCommonApiResponse from "../../model/NewCommonApiResponse";
import showNotification from "../../services/notification.service";
import { getErrorHumanReadableMessage } from "../../helpers/backend-errors-human-readable";
import { ServiceType } from "./model/types";

// Get all service types
export const getAllServiceTypes = async (): Promise<ServiceType[]> => {
  try {
    const res = await axiosInstance.get<NewCommonApiResponse<{ serviceTypeInfo: ServiceType[] }>>(
      BackendEndpoints.GET_ALL_SERVICE_TYPES
    );
    console.log(res);
    return res.data.data.serviceTypeInfo ?? [];
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error();
  }
};


// Get by ID
export const getServiceTypeById = async (id: string): Promise<ServiceType> => {
  try {
    const res = await axiosInstance.get<NewCommonApiResponse<ServiceType>>(
      BackendEndpoints.GET_SERVICE_TYPE_BY_ID+ "/" +id
    );
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error();
  }
};

// Create new
export const createServiceType = async (type: Omit<ServiceType, "id">): Promise<ServiceType> => { 

  try {
    const res = await axiosInstance.post<NewCommonApiResponse<ServiceType>>(
      BackendEndpoints.CREATE_SERVICE_TYPE,
      type
    );
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error();
  }
};

// Update
export const updateServiceType = async (id: string, type: Omit<ServiceType, "id">): Promise<ServiceType> => {
    try {
    const res = await axiosInstance.put<NewCommonApiResponse<ServiceType>>(
      BackendEndpoints.UPDATE_SERVICE_TYPE+ "/" +id,
      type
    );
    return res.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error();
  }
};

// Delete
export const deleteServiceType = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(BackendEndpoints.DELETE_SERVICE_TYPE+ "/" +id);
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error();
  }
};
