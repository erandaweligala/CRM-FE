import { FC } from "react";
import DealsKanbanViewResponseModel from "../../../../models/DealsKanbanViewResponse.model";
import "./KanbanViewFunnelItemList.scss";

interface KanbanViewFunnelItemListProps {
  data: DealsKanbanViewResponseModel;
}

const KanbanViewFunnelItemList: FC<KanbanViewFunnelItemListProps> = ({ data }) => {
  const getPercentageBadgeColor = (stage: string) => {
    if (stage === "Closed Won") return "#3D8B36";
    if (stage === "Closed Lost") return "#D9534F";
    return "#0D4879";
  };

  return (
    <div
      style={{
        minWidth: "20px",
        maxWidth: "250px",
        width: "250px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#EAF1FB",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          color: "#111",
          fontSize: "12px",
          fontWeight: "500",
          padding: "6px 12px",
          marginBottom: "6px",
          position: "relative",
          clipPath: "polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 8% 50%)",
        }}
      >
        {data.count} {Number(data.count) === 1 ? "Opportunity" : "Opportunities"}
      </div>

      <div
        className="kanban-header-container"
        style={{
          textAlign: "left",
          background: "#F4F4F4",
          padding: "12px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "#111",
            marginBottom: "6px",
          }}
        >
          {data.stage}
        </div>

        <div style={{ fontSize: "13px", color: "#0D4879", fontWeight: "500" }}>
          Rs.{data.totalAmount ? Number(data.totalAmount).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "0.00"}
        </div>
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: getPercentageBadgeColor(data.stage),
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            padding: "6px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.percentage}%
        </div>
      </div>
    </div>
  );
};

export default KanbanViewFunnelItemList;