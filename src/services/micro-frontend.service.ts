import axiosInstance from "./axios.service";
import NewCommonApiResponse from "../model/NewCommonApiResponse";
import BackendEndpoints from "../constants/backend-endpoints";
import showNotification from "./notification.service";
import {getErrorHumanReadableMessage} from "../helpers/backend-errors-human-readable";
import MicrofrontentComponentListModel from "../model/MicrofrontentComponentList.model";
import store from "../store/main-store";
import {metaDataAction} from "../store/meta-data.slice";

export const getMicroFrontendComponentList = async (): Promise<MicrofrontentComponentListModel[]> => {

   try {

      if(store.getState().metaData.microFrontendComponentList.length > 0) {
         return store.getState().metaData.microFrontendComponentList
      }

      const apiResponse = await axiosInstance.get<NewCommonApiResponse<MicrofrontentComponentListModel[]>>(
         BackendEndpoints.MICRO_FRONTEND_COMPONENT_LIST
      )

      store.dispatch(metaDataAction.setMicroFrontComponentList(apiResponse.data.data));

      return apiResponse.data.data

   } catch (error: any) {
      showNotification("ERROR", getErrorHumanReadableMessage(error));
      return []
   }

}


export const createNewCrmExtension = async (componentName: string, displayName: string) => {

   try {
      await axiosInstance.post(
         BackendEndpoints.MICRO_FRONTEND_COMPONENT_CREATE,
         {
            componentName,
            displayName
         }
      )
      return "SUCCESS"
   } catch (error: any) {
      showNotification("ERROR", getErrorHumanReadableMessage(error));
      return "Error"
   }

}