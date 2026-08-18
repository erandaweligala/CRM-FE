import {Outlet, Navigate} from "react-router-dom";
import MainMenu from "../components/main-menu/MainMenu";
import {useAppSelector} from "../store/main-store";
import INTERNAL_ROUTES from "../constants/internal-routes";
import {useEffect} from "react";
import {setIdleLogoutTimer} from "../services/authentication-logic.service";
import {getMicroFrontendComponentList} from "../services/micro-frontend.service.ts";

const PrivateRoute = () => {

    const isLogin = useAppSelector(state => state.auth.isUserLogin);

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