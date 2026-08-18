import React, { useState } from "react";
import "./ContentSwitcherTabs.scss";
import TermsAndConditions from "./components/TermsAndConditionsList";
//import ServiceTypes from "../ServiceTypes/serviceTypes";

const ContentSwitcherTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Terms and Conditions");

  //const tabs = ["Terms and Conditions", "Service Types"];
    const tabs = ["Terms and Conditions"];
  return (
    <>
      <div className="custom-tabs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "Terms and Conditions" && <TermsAndConditions />}
        {/* {activeTab === "Service Types" && <ServiceTypes />} */}
      </div>
    </>
  );
};

export default ContentSwitcherTabs;
