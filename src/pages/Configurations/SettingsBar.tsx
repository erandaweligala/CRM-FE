import React from "react";
import { NavLink } from "react-router-dom";
import "./SettingsBar.scss";
import INTERNAL_ROUTES from "../../constants/internal-routes";

const SettingsBar: React.FC = () => {
  const tabs = [
    { label: "Quote Configuration", path: INTERNAL_ROUTES.CONFIGURATIONS },
    { label: "Action Logs", path: INTERNAL_ROUTES.ACTION_LOGS },
    { label: "Extensions", path: INTERNAL_ROUTES.EXTENSIONS },
  ];

  return (
    <div className="settings-bar">
      <div className="settings-row">
        <div className="settings-title">Settings</div>
        <div className="tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;
