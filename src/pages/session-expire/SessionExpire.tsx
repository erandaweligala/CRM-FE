import CELogo from "../../../src/assets/images/CE Logo_02@2x.png";
import SessionExpiredImg from "../../../src/assets/images/MiddelImage.png";
import INTERNAL_ROUTES from "../../constants/internal-routes";
import "./SessionExpired.scss";
import { Button } from "antd";

const SessionExpire = () => {
    return (
        <div className="content-center-all-side">

            <div className="session-expired-container content-center-all-side-column">
                <img
                    src={CELogo}
                    alt="ce-logo"
                    height={33}
                    width={'100%'}
                />

                <div className="status-title">
                    Session failed!
                </div>

                <div className="image-wrapper">
                    <img
                        src={SessionExpiredImg}
                        alt="middle-Image"
                        height={150}
                        width={'100%'}
                    />
                </div>

                <div className="status-description">
                    Your session failed please try again
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-btn w-100 mt-5"
                    onClick={() => document.location.href = INTERNAL_ROUTES.LOGIN_PAGE}
                >
                    BACK TO LOGIN PAGE
                </Button>

            </div>

        </div>
    )

}

export default SessionExpire;