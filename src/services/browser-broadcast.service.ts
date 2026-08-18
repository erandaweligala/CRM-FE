import INTERNAL_ROUTES from "../constants/internal-routes";
import {anotherTabAskToLogout} from "./authentication-logic.service";

export enum BroadCastChannels {
    Logout= "LOGOUT"
}

export const LogoutBroadcastChannel = new BroadcastChannel(BroadCastChannels.Logout);

LogoutBroadcastChannel.onmessage = (event) => {
    if(event.data === "LOGOUT" && !window.location.pathname.includes(INTERNAL_ROUTES.SESSION_EXPIRE_PAGE)) {
        anotherTabAskToLogout();
    }
}