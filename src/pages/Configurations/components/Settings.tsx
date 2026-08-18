import { FC } from "react";
import { BSS_Breadcrumb } from "bss-component-library";

const Settings: FC = () => {
  return (
    <div className="settings">
      <BSS_Breadcrumb>
        <BSS_Breadcrumb.Section>CPQ</BSS_Breadcrumb.Section>
        <BSS_Breadcrumb.Section>Settings</BSS_Breadcrumb.Section>
      </BSS_Breadcrumb>

    </div>
  );
};

export default Settings;
