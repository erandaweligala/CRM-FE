import {Outlet, Navigate} from "react-router-dom";
import MainMenu from "../components/main-menu/MainMenu";
import {useAppSelector} from "../store/main-store";
import INTERNAL_ROUTES from "../constants/internal-routes";
import {useEffect} from "react";
import {setIdleLogoutTimer} from "../services/authentication-logic.service";
import {getMicroFrontendComponentList} from "../services/micro-frontend.service.ts";
import {AUTH_BYPASS_ENABLED} from "../constants/auth-bypass";

const PrivateRoute = () => {

    // While the auth bypass is on every private route is treated as accessible.
    const isLogin = useAppSelector(state => state.auth.isUserLogin) || AUTH_BYPASS_ENABLED;

    useEffect(() => {
        if (isLogin) {
            setIdleLogoutTimer(false);
             getMicroFrontendComponentList();
        }
    }, [isLogin]);

    if (isLogin) {
        return (
            <>
                <MainMenu/>
                <Outlet/>
            </>
        )
    } else {
        return <Navigate to={INTERNAL_ROUTES.LOGIN_PAGE}/>;
    }

}

export default PrivateRoute;