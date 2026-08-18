import NO_DASHBOARD from "./../../assets/images/noDashboardIcon.svg?react";
import { FC } from "react";
import "./NoDashboard.scss";

interface NoDashboardProps {
    description?: string;
    height?: string;
    onContactClick?: () => void;
}

const NoDashboard: FC<NoDashboardProps> = ({
    description = "No dashboard has been assigned to you. Please contact your administrator to get access.",
    height = "DEFAULT",
}) => {
    return (
        <div
            className={`no-dashboard ${height === "DEFAULT" ? "default-height" : ""}`}
            style={{ height: height !== "DEFAULT" ? height : undefined }}
        >
            <div className="no-dashboard-content">
                <NO_DASHBOARD className="no-dashboard-icon" />
                <p className="description">{description}</p>
            </div>
        </div>
    );
};

export default NoDashboard;