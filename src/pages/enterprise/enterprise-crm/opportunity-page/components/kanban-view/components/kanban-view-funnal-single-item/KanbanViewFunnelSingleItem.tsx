import { CalendarOutlined } from "@ant-design/icons";
import { FC } from "react";
import DealsKanbanViewResponseModel from "../../../../models/DealsKanbanViewResponse.model";
import "./KanbanViewFunnelSingleItem.scss";
interface KanbanViewFunnelSingleItemProps {
  data: DealsKanbanViewResponseModel;
  onClickSingleDeal: (dealId: string) => void;
}

const KanbanViewFunnelSingleItem: FC<KanbanViewFunnelSingleItemProps> = ({ data, onClickSingleDeal }) => {
  return (
    <div
      className="kanban-single-column"
      style={{
        minWidth: "250px",
        maxWidth: "250px",
        width: "250px",
        flexShrink: 0,
        padding: "8px",
        background: "#F4F4F4",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >

      {data.dealList.length > 0 ? (
        data.dealList.map((item) => {
          return (
            <button
              className="kanban-card"
              key={item.id}
              style={{
                all: "unset",
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
                marginBottom: "8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "6px",
              }}
              onClick={() => onClickSingleDeal(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClickSingleDeal(item.id);
                }
              }}
            >
              <div
                className="font-md-semi-bold"
                style={{ fontSize: "14px", fontWeight: "bold", color: "#111" }}
              >
                {item.name}
              </div>

              {item.accountName && (
                <div
                  className="font-md-medium mt-1"
                  style={{ fontSize: "12px", color: "#777" }}
                >
                  {item.accountName}
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E0E0E0",
                  margin: "6px 0",
                }}
              />

              {item.amount && (
                <div
                  className="font-md-medium mt-1"
                  style={{ fontSize: "14px", fontWeight: "bold", color: "#000" }}
                >
                  Rs. {Number(item.amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </div>
              )}

              {item.contactName && (
                <div
                  style={{ fontSize: "12px", color: "#777" }}
                >
                  {item.contactName}
                </div>
              )}

              {item.closingDate && (
                <div
                  style={{
                    alignSelf: "flex-end",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#F8F8F8",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    marginTop: "4px",
                  }}
                >
                  <CalendarOutlined style={{ color: "#629a21" }} />
                  <span style={{ color: "#000000" }}>{item.closingDate}</span>
                </div>
              )}

            </button>
          );
        })
      ) : (
        <div style={{ color: "#aaa", textAlign: "center", paddingTop: "20px" }}>No Opportunity</div>
      )}
    </div>
  );
};

export default KanbanViewFunnelSingleItem;