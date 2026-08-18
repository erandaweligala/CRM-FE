import {useAppSelector} from "../../store/main-store";
import {Navigate} from "react-router-dom";
import INTERNAL_ROUTES from "../../constants/internal-routes";
import {FC} from "react";

interface NotFountProps {
}

const NotFount: FC<NotFountProps> = () => {

    const isLogin = useAppSelector(state => state.auth.isUserLogin);

    if (isLogin) {
        return <Navigate to={INTERNAL_ROUTES.HOME_PAGE}/>;
    } else {
        return <Navigate to={INTERNAL_ROUTES.LOGIN_PAGE}/>;
    }

}

export default NotFount;