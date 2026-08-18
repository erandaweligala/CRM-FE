import { FC } from "react";
import STATUS_COLOR_MAPPING from "../../../../../../constants/StatusColorMapping.const";

interface StatusStageItemProps {
  value: string;
}

const StatusStageItem: FC<StatusStageItemProps> = ({ value }) => {
  const statusKey = value && value !== "null" ? value.replace(/\s+/g, "") : "";
  const colorConfig = STATUS_COLOR_MAPPING[statusKey] || {
    color: "#000",
    bgColor: "#FFF",
  };

  
  const formatStage = (raw: string): string => {
    if (!raw) return "";

  
    const spaced = raw.replace(/([A-Z])/g, " $1").trim();

    
    return spaced
      .split(" ")
      .map((word, idx) =>
       
        idx === 0 && word.length <= 4
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  return (
    <span
      style={{
        color: colorConfig.color,
        backgroundColor: colorConfig.bgColor,
        padding: "4px 12px",
        borderRadius: "8px",
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "350px",
      }}
    >
      {value && value !== "null" ? formatStage(value) : "No Details Stage Or Status"}
    </span>
  );
};

export default StatusStageItem;
