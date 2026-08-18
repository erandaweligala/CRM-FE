import EntityDetail from "../pages/enterprise/enterprise-crm/common-models/EntityDetail";

export const getValueFromSection = (details: EntityDetail[], inputId: string): string => {
    return details.find((d) => d.inputId === inputId)?.value || "";
};
  