import jwt_decode from "jwt-decode";
import INTERNAL_ROUTES from "../constants/internal-routes";
import AccessTokenModel from "../model/AccessToken.Model";
import showNotification from "./notification.service";
import {getErrorHumanReadableMessage} from "../helpers/backend-errors-human-readable";
import store, {authActions} from "../store/main-store";
import {getLoginUrl, logout} from "./authentication-api.service";
import {LogoutBroadcastChannel} from "./browser-broadcast.service";
import {LocalStorageConstants} from "../constants/local-storage";
import {AUTH_BYPASS_ENABLED} from "../constants/auth-bypass";

const initialApplicationLoading = (isCallingFromInitialAppLoad: boolean) => {

    // Auth bypass - the store already holds a synthetic session, nothing to restore.
    if (AUTH_BYPASS_ENABLED) {
        return;
    }

    if (
        isCallingFromInitialAppLoad && (
            window.location.pathname.includes('/internal') ||
            window.location.pathname.includes(INTERNAL_ROUTES.SESSION_EXPIRE_PAGE) ||
            window.location.pathname.includes(INTERNAL_ROUTES.UNAUTHORIZED_ACCESS_PAGE)
        )
    ) {
        return;
    }

    const jwtAccessTokenFromLocalStorage: string | null = localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN);
    const globalLastActiveTimeInEpoch: string | null = localStorage.getItem(LocalStorageConstants.LAST_ACTIVE_TIME);
    const nowTimeInEpoch = Math.floor(Date.now() / 1000); // Convert millisecond to seconds

    if (jwtAccessTokenFromLocalStorage && globalLastActiveTimeInEpoch) {

        try {
            const jwtAccessTokenDecoded: AccessTokenModel = jwt_decode(jwtAccessTokenFromLocalStorage);

            // Check Token Expiration
            if (nowTimeInEpoch < jwtAccessTokenDecoded.exp) {
                if (parseInt(globalLastActiveTimeInEpoch) + jwtAccessTokenDecoded.idleTimeRange > nowTimeInEpoch) {
                    mainLoginHandling(jwtAccessTokenFromLocalStorage);
                } else {
                    logoutAndRedirectToSessionExpirePage();
                }
            } else {
                clearLocalStorage();
            }

        } catch (error: any) {
            clearLocalStorage();
        }
    }

}


const newLoginProcess = async () => {

    // Auth bypass - skip the identity provider and land on the home page.
    if (AUTH_BYPASS_ENABLED) {
        document.location.href = INTERNAL_ROUTES.HOME_PAGE;
        return;
    }

    try {
        const loginUrl = await getLoginUrl();
        console.log('Login URL: ', loginUrl);
        window.location.replace(loginUrl);
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
    }

}


export const mainLoginHandling = (token: string) => {

    const nowTimeInEpoch = Math.floor(Date.now() / 1000); // Seconds

    const jwtDecoded: AccessTokenModel = jwt_decode(token);

    // Get Token Expired Time
    const tokenExpireTimeInSec = jwtDecoded.exp - nowTimeInEpoch;

    // Token Expired
    if (tokenExpireTimeInSec <= 0) {
        console.log('Token Is Expired');
        logoutAndRedirectToSessionExpirePage();
        throw new Error('Token Expired');
    }

    localStorage.setItem("user-data", token);
    store.dispatch(authActions.userLogin({accessToken: token}));

}


const logoutAndRedirectToSessionExpirePage = () => {

    // Auth bypass - the session never expires, keep the user where they are.
    if (AUTH_BYPASS_ENABLED) {
        return;
    }

    logout().finally(() => {
        clearLocalStorage();
        // store.dispatch(authActions.userLogout()); // This line does not need because hard reload automatically clear the store
        LogoutBroadcastChannel.postMessage("LOGOUT");
        document.location.href = INTERNAL_ROUTES.SESSION_EXPIRE_PAGE;
    });
}


export const anotherTabAskToLogout = () => {

    // Auth bypass - ignore logout broadcasts from other tabs.
    if (AUTH_BYPASS_ENABLED) {
        return;
    }

    document.location.href = INTERNAL_ROUTES.SESSION_EXPIRE_PAGE;
}


const logoutAndRedirectToLoginPage = () => {

    // Auth bypass - there is no login page to go back to, reload the home page.
    if (AUTH_BYPASS_ENABLED) {
        document.location.href = INTERNAL_ROUTES.HOME_PAGE;
        return;
    }

    logout().finally(() => {
        clearLocalStorage();
        store.dispatch(authActions.userLogout());
        LogoutBroadcastChannel.postMessage("LOGOUT");
        document.location.href = INTERNAL_ROUTES.LOGIN_PAGE;
    });
}


let idleTimeOutTimerId: any;
let idleTimeSetTimeInSeconds: number;


const setIdleLogoutTimer = (matchToGlobalTimer = false) => {

    // Auth bypass - no idle logout while authentication is switched off.
    if (AUTH_BYPASS_ENABLED) {
        return;
    }

    if (store.getState().auth.isUserLogin) {

        console.log("Logout Timer Logic Started");

        let nextIdleTimerExecutionTimeInMilliSeconds: number;

        if (matchToGlobalTimer) {
            idleTimeSetTimeInSeconds = parseInt(localStorage.getItem(LocalStorageConstants.LAST_ACTIVE_TIME)!);
            nextIdleTimerExecutionTimeInMilliSeconds = (store.getState().auth.decodedToken!.idleTimeRange - (Math.floor(Date.now() / 1000) - idleTimeSetTimeInSeconds)) * 1000;
        } else {
            idleTimeSetTimeInSeconds = Math.floor(Date.now() / 1000); // Seconds
            localStorage.setItem(LocalStorageConstants.LAST_ACTIVE_TIME, idleTimeSetTimeInSeconds.toString());
            nextIdleTimerExecutionTimeInMilliSeconds = store.getState().auth.decodedToken!.idleTimeRange * 1000;
        }

        clearTimeout(idleTimeOutTimerId);

        idleTimeOutTimerId = setTimeout(() => {
            
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const globalActiveTime = parseInt(localStorage.getItem(LocalStorageConstants.LAST_ACTIVE_TIME));

            if (globalActiveTime === idleTimeSetTimeInSeconds) {
                logoutAndRedirectToSessionExpirePage();
            } else if (globalActiveTime > idleTimeSetTimeInSeconds) {
                setIdleLogoutTimer(true);
            }

        }, nextIdleTimerExecutionTimeInMilliSeconds);

    }

}

const clearLocalStorage = () => {
      localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
      localStorage.removeItem(LocalStorageConstants.LAST_ACTIVE_TIME);
}


export {
    initialApplicationLoading,
    logoutAndRedirectToSessionExpirePage,
    logoutAndRedirectToLoginPage,
    newLoginProcess,
    setIdleLogoutTimer
}