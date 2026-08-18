import axios, {AxiosInstance} from "axios";
import {BehaviorSubject} from "rxjs";
import store from "../store/main-store";
import {LocalStorageConstants} from "../constants/local-storage";
import {
    logoutAndRedirectToSessionExpirePage,
    mainLoginHandling,
    setIdleLogoutTimer
} from "./authentication-logic.service";
import API_ENDPOINTS from "../constants/backend-endpoints";
import {getNewAccessTokenFromCurrentAccessToken} from "./authentication-api.service";

export const pendingApiCalls$ = new BehaviorSubject<number>(0);

const loadingSpinnerExcludeUrls = [
    API_ENDPOINTS.GET_NEW_ACCESS_TOKEN_FROM_CURRENT_ACCESS_TOKEN,
    API_ENDPOINTS.Dashboard_SUPERSET_TOKEN_API,
    API_ENDPOINTS.NEW_NOTIFICATION,
];

const backendMainEndPoint = import.meta.env.VITE_BACKEND_URL;

//changes axios settings
const axiosInstance = axios.create({
    baseURL: backendMainEndPoint,
    timeout: 50000,
    headers: {
        'X-Application-Id': '1'
    }
});

let setTokenInterceptorId: number;

export const setTokenInterceptor = () => {
    axiosInstance.interceptors.request.eject(setTokenInterceptorId);

    setTokenInterceptorId = axiosInstance.interceptors.request.use((requestConfig) => {
        const state = store.getState();
        const isLoggedIn = state.auth.isUserLogin;
        const requestUrl = requestConfig.url ?? "";

        if (!isLoggedIn) return requestConfig;

        const isTokenRefreshCall = requestUrl.includes(API_ENDPOINTS.GET_NEW_ACCESS_TOKEN_FROM_CURRENT_ACCESS_TOKEN);
        const isLogoutCall = requestUrl.includes(API_ENDPOINTS.LOGOUT);

        if (!isTokenRefreshCall) {
            const storedToken = localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN);
            const currentToken = state.auth.accessToken;

            if (storedToken && storedToken !== currentToken) {
                mainLoginHandling(storedToken);
            }

            if (!storedToken) {
                triggerLogout("Cancel API Request By Application");
            }

            handleTokenExpiry(state);
        }

        if (requestConfig.headers) {
            requestConfig.headers['Authorization'] = `Bearer ${state.auth.accessToken}`;
        }

        if (!isLogoutCall) {
            setIdleLogoutTimer(false);
        }

        return requestConfig;
    });
};
const triggerLogout = (cancelMessage: string) => {
    setTimeout(() => {
        logoutAndRedirectToSessionExpirePage();
    }, 100);
    throw new axios.Cancel(cancelMessage);
};

const handleTokenExpiry = (state: any) => {
    const now = Math.floor(Date.now() / 1000);
    const exp = state.auth.decodedToken?.exp!;
    const refreshTime = state.auth.decodedToken?.refreshTimeRange!;

    if (now > exp) {
        logoutAndRedirectToSessionExpirePage();
        throw new axios.Cancel("Token Is Expired");
    }

    if (now + refreshTime > exp) {
        setTimeout(() => {
            getNewAccessTokenFromCurrentAccessToken()
                .then((newToken) => {
                    localStorage.setItem(LocalStorageConstants.ACCESS_TOKEN, newToken);
                    mainLoginHandling(newToken);
                });
        }, 2000);
    }
};
const axiosInstanceOfmDirectCall = axios.create({
    baseURL: "/crm-operational-flow-manager/ofm",
    timeout: 10000
});


export const clearTokenInterceptors = () => {
    axiosInstance.interceptors.request.clear();
}

/**
 * This response interceptor is used to Logout user if 403 or 401 response received from any API CALL
 * */
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.request?.responseURL?.includes(API_ENDPOINTS.LOGOUT)) {
            return Promise.reject(new Error(error.message ?? 'Unknown error occurred'));
        } else if (
            error.response?.status &&
            (error.response.status === 403 || error.response.status === 401)
        ) {
            console.log('Unauthorized Response Received. Logout the User');
            logoutAndRedirectToSessionExpirePage();
        }
        return Promise.reject(error instanceof Error ? error : new Error(error.message ?? 'Unknown error occurred'));
    }
);


axiosInstance.interceptors.request.use((request) => {
    if (request.url && !isLoadingSpinnerExcludeUrl(request.url)) {
        pendingApiCalls$.next(pendingApiCalls$.getValue() + 1);
    }
    return request;
});


axiosInstance.interceptors.response.use(
    (response) => {
        if (response.config.url && !isLoadingSpinnerExcludeUrl(response.config.url)) {
            pendingApiCalls$.next(pendingApiCalls$.getValue() - 1);
        }
        return response;
    },
    (error) => {
        if (error.config.url && !isLoadingSpinnerExcludeUrl(error.config.url)) {
            pendingApiCalls$.next(pendingApiCalls$.getValue() - 1);
        }
        return Promise.reject(error instanceof Error ? error : new Error(error.message ?? 'Unknown error occurred'));
    }
);


axiosInstanceOfmDirectCall.interceptors.request.use((request) => {
    if (request.url && !isLoadingSpinnerExcludeUrl(request.url)) {
        pendingApiCalls$.next(pendingApiCalls$.getValue() + 1);
    }
    return request;
});

axiosInstanceOfmDirectCall.interceptors.response.use(
    (response) => {
        if (response.config.url && !isLoadingSpinnerExcludeUrl(response.config.url)) {
            pendingApiCalls$.next(pendingApiCalls$.getValue() - 1);
        }
        return response;
    },
    (error) => {
        if (error.config.url && !isLoadingSpinnerExcludeUrl(error.config.url)) {
            pendingApiCalls$.next(pendingApiCalls$.getValue() - 1);
        }
        return Promise.reject(new Error(error.message ?? 'Unknown error occurred'));

    }
);

const isLoadingSpinnerExcludeUrl = (url: string) => {
    let isLoadingSpinnerExcludeUrl = false;
    loadingSpinnerExcludeUrls.forEach((singleExcludeUrl) => {
        if (url.includes(singleExcludeUrl)) {
            isLoadingSpinnerExcludeUrl = true;
        }
    });
    return isLoadingSpinnerExcludeUrl;
}


export default axiosInstance;
export {axiosInstanceOfmDirectCall};



export const setInterceptorsForAxiosInstance = (axiosInstance: AxiosInstance) => {
    setTokenInterceptorId = axiosInstance.interceptors.request.use((config) => {
        console.log('CRM: setTokenInterceptor() - Axios Interceptor: ', config.url);

        if (!store.getState().auth.isUserLogin) return config;

        if (isNotTokenRefreshCall(config.url)) {
            handleTokenMismatch();
            handleTokenExpiryOrRefresh();
        }

        setAuthorizationHeader(config);
        if (isNotLogoutCall(config.url)) {
            setIdleLogoutTimer(false);
        }

        return config;
    });
    axiosInstance.interceptors.response.use(
        (res) => res,
        (error) => handleUnauthorizedError(error)
    );
    axiosInstance.interceptors.request.use((request) => {
        if (!isLoadingSpinnerExcludeUrl(request.url ?? "")) {
            pendingApiCalls$.next(pendingApiCalls$.getValue() + 1);
        }
        return request;
    });
    axiosInstance.interceptors.response.use(
        (response) => {
            if (response.config.url && !isLoadingSpinnerExcludeUrl(response.config.url)) {
                pendingApiCalls$.next(pendingApiCalls$.getValue() - 1);
            }
            return response;
        },
        (error) => {
            if (!isLoadingSpinnerExcludeUrl(error.config.url)) {
                pendingApiCalls$.next(pendingApiCalls$.getValue() - 1);
            }
            return Promise.reject(new Error(error.message ?? 'Unknown error occurred'));
        }
    );
};
const isNotTokenRefreshCall = (url?: string) =>
    !url?.includes(API_ENDPOINTS.GET_NEW_ACCESS_TOKEN_FROM_CURRENT_ACCESS_TOKEN);

const isNotLogoutCall = (url?: string) =>
    !url?.includes(API_ENDPOINTS.LOGOUT);

const handleTokenMismatch = () => {
    const localToken = localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN);
    const storeToken = store.getState().auth.accessToken;

    if (localToken && storeToken !== localToken) {
        mainLoginHandling(localToken);
    } else if (!localToken) {
        setTimeout(() => logoutAndRedirectToSessionExpirePage(), 100);
        throw new axios.Cancel('Cancel API Request By Application');
    }
};

const handleTokenExpiryOrRefresh = () => {
    const state = store.getState();
    const now = Math.floor(Date.now() / 1000);
    const exp = state.auth.decodedToken?.exp!;
    const refresh = state.auth.decodedToken?.refreshTimeRange!;

    if (now > exp) {
        logoutAndRedirectToSessionExpirePage();
        throw new axios.Cancel("Token Is Expired");
    }

    if (now + refresh > exp) {
        setTimeout(() => {
            getNewAccessTokenFromCurrentAccessToken()
                .then((newToken) => {
                    localStorage.setItem(LocalStorageConstants.ACCESS_TOKEN, newToken);
                    mainLoginHandling(newToken);
                });
        }, 2000);
    }
};

const setAuthorizationHeader = (config: any) => {
    if (config?.headers) {
        config.headers['Authorization'] = `Bearer ${store.getState().auth.accessToken}`;
    }
};

const handleUnauthorizedError = (error: any) => {
    const url = error.response?.request?.responseURL ?? '';
    const status = error.response?.status;

    if (url.includes(API_ENDPOINTS.LOGOUT)) {
        return Promise.reject(new Error(error.message ?? 'Unknown error occurred'));
    }

    if (status === 401 || status === 403) {
        console.log('Unauthorized Response Received. Logout the User');
        logoutAndRedirectToSessionExpirePage();
    }

    return Promise.reject(new Error(error.message ?? 'Unknown error occurred'));
};