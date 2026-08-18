import {FC, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getAccessTokenUsingTempToken} from "../../services/authentication-api.service.ts";
import {mainLoginHandling} from "../../services/authentication-logic.service.ts";
import INTERNAL_ROUTES from "../../constants/internal-routes.ts";

const AuthCodeHanding: FC = () => {

   const [searchParams] = useSearchParams();
   const navigate = useNavigate();

   useEffect(() => {

      const code = searchParams.get('code');
      const tenant = localStorage.getItem("tenant");
      
      if(code && tenant) {
         getAccessTokenUsingTempToken(code, tenant).then((accessToken) => {
            mainLoginHandling(accessToken);
            navigate(INTERNAL_ROUTES.HOME_PAGE, {replace: true});
         }).catch(() => {
            navigate(INTERNAL_ROUTES.LOGIN_PAGE, {replace: true});
         })
      } else {
         navigate(INTERNAL_ROUTES.LOGIN_PAGE, {replace: true});
      }
      
   }, [navigate, searchParams]);

   return (
      <h3>Loading..</h3>
   )

}

export default AuthCodeHanding;