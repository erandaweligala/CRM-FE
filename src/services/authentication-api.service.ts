import axiosInstance from "./axios.service";
import NewCommonApiResponse from "../model/NewCommonApiResponse";
import BackendEndpoints from "../constants/backend-endpoints";
import showNotification from "./notification.service";
import {getErrorHumanReadableMessage} from "../helpers/backend-errors-human-readable";

const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_KEYCLOAK_SUCCESS_URL;

export const getLoginUrl = async (): Promise<string> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<{ url: string }>>(
            BackendEndpoints.GET_AD_LOGIN_URL
        );

        return apiResponse.data.data.url;
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getAccessTokenUsingTempToken = async (code: string, tenant: string): Promise<string> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<{ accessToken: string }>>(
           BackendEndpoints.GET_ACCESS_TOKEN_FROM_TEMP_TOKEN,
           {
               code,
               tenant,
               clientId,
               redirectUri: redirect_uri
           }
        );
        return apiResponse.data.data.accessToken;
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getNewAccessTokenFromCurrentAccessToken = async (): Promise<string> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<{ accessToken: string }>>(
            BackendEndpoints.GET_NEW_ACCESS_TOKEN_FROM_CURRENT_ACCESS_TOKEN
        );
        return apiResponse.data.data.accessToken;
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}


export const logout = async () => {
    try {
        await axiosInstance.delete(
            BackendEndpoints.LOGOUT
        );
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}