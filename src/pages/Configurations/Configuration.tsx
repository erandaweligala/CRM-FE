import { FC } from "react";
import "./Configuration.scss";
import { BSS_Breadcrumb } from "bss-component-library";
import SettingsBar from "./SettingsBar";
import ContentSwitcherTabs from "./ContentSwitcherTabs";

const Configuration: FC = () => {
  return (
    <div className="configuration">
      <BSS_Breadcrumb>
        <BSS_Breadcrumb.Section>CPQ</BSS_Breadcrumb.Section>
        <BSS_Breadcrumb.Section>Settings</BSS_Breadcrumb.Section>
      </BSS_Breadcrumb>
      
      <div className="outer-wrapper">
  <div className="terms-page">
    <SettingsBar />
    <ContentSwitcherTabs />
    
  </div>
</div>

    </div>
  );
};

export default Configuration;
