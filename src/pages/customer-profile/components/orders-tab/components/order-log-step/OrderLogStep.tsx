import { Empty, Steps } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { FC } from "react";
import "./OrderLogSteps.scss";
const { Step } = Steps;

const OrderLogStep: FC<any> = ({ ownSteps }) => {
  const statusMap: any = {
    Completed: { code: "finish", className: "finish-status" },
    InProgress: { code: "process", className: "process-status" },
    Pending: { code: "process", className: "process-status" },
    "Not Started": { code: "wait", className: "wait-status" },
    Acknowledged: { code: "wait", className: "wait-status" },
    Failed: { code: "error", className: "error-status" },
    Held: { code: "error", className: "error-status" },
    Partial: { code: "wait", className: "partial-status" },
  };

  return (
    <div className="inner-table-steps mr-8 mb-2">
      {ownSteps && ownSteps.length > 0 && (
        <div style={{ backgroundColor: "white", marginTop: 10 }}>
          <Steps className={`order-log-step-style`}>
            {ownSteps.map((singleStep: any) => {
              let stepIcon = null;
              if (
                singleStep.status === "InProgress" ||
                singleStep.status === "Pending"
              ) {
                stepIcon = (
                  <LoadingOutlined style={{ fontSize: 20, color: "#302aad" }} />
                );
              } else if (singleStep.status === "Completed") {
                stepIcon = (
                  <CheckCircleOutlined
                    style={{ fontSize: 20, color: "#00635A" }}
                  />
                );
              } else if (
                singleStep.status === "Not Started" ||
                singleStep.status === "Acknowledged"
              ) {
                stepIcon = <ClockCircleOutlined style={{ fontSize: 20 }} />;
              } else if (
                singleStep.status === "Failed" ||
                singleStep.status === "Held"
              ) {
                stepIcon = (
                  <CloseCircleOutlined
                    style={{ fontSize: 20, color: "#ff4d4f" }}
                  />
                );
              } else if (singleStep.status === "Partial") {
                stepIcon = (
                  <ExclamationCircleOutlined
                    style={{ fontSize: 20, color: "#F0973E" }}
                  />
                );
              }

              const desc = (
                <div>
                  <p className="step-status">{singleStep.status}</p>
                  <p>{singleStep.dateTime}</p>
                  <p>{singleStep.description}</p>
                </div>
              );

              return (
                <Step
                  key={singleStep.id}
                  title={singleStep.action}
                  description={desc}
                  status={statusMap[singleStep.status]?.code}
                  icon={stepIcon}
                  className={statusMap[singleStep.status]?.className}
                />
              );
            })}
          </Steps>
        </div>
      )}
      {!ownSteps && <Empty />}
    </div>
  );
};

export default OrderLogStep;
