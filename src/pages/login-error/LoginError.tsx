import {useParams} from "react-router-dom";
import CELogo from "../../../src/assets/images/CE Logo_02@2x.png";
import LoginFailed from "../../../src/assets/images/LoginFailed.png";
import "../session-expire/SessionExpired.scss";
import {Button} from "antd";
import INTERNAL_ROUTES from "../../constants/internal-routes";

const LoginError = () => {

    const {errorType} = useParams();

    // return <h3>Login Error Page: Error {errorType} </h3>
    return (
        <div className="content-center-all-side">

            <div className="login-error-container content-center-all-side-column">
                <>
                    <img
                        src={CELogo}
                        alt="ce-logo"
                        height={33}
                        width={'100%'}
                    />
                </>

                <div className="status-title">
                     {
                        errorType && errorType === 'no-user' && 'User not in system'
                     }
                     {
                        errorType && errorType === 'user-inactive' && 'User inactive'
                     }
                     {
                        errorType && errorType === 'internal-error' && 'System error'
                     }
                </div>

                <div className="image-wrapper">
                    <img
                        src={LoginFailed}
                        alt="middle-Image"
                        height={150}
                        width={'100%'}
                    />
                </div>

                <div className="status-description">
                    Please Contact Administrator. Your session failed, please log again
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-btn w-100 mt-5"
                    onClick={()=> document.location.href = INTERNAL_ROUTES.LOGIN_PAGE}
                >
                   BACK TO LOGIN PAGE
                </Button>

            </div>

        </div>
    )

}

export default LoginError;