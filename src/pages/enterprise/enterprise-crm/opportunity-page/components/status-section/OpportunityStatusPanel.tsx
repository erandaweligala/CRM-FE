import { FC, useEffect, useRef, useState } from "react";
import { getDealStage, updateDealStage } from "../../services/Deals.services";
import showNotification from "../../../../../../services/notification.service";
import "./OpportunityStatusPanel.scss"
import DropdownValue from "../../../common-models/DropdownValueStage";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal";
import BssCollapse from "../../../../../../components/BSS_Collapse/BSS_Collapse";
interface OpportunityStatusPanelProps {
  currentStatus: string;
  dealID: string;
  reloadStages: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

const OpportunityStatusPanel: FC<OpportunityStatusPanelProps> = ({ currentStatus, dealID, reloadStages, setRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [dealStageList, setDealStageList] = useState<DropdownValue[]>([]);
  const [allowedTransitions, setAllowedTransitions] = useState<number[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>(currentStatus);
  const [stageChange, setStageChange] = useState<boolean>(false);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDealStageList();
  }, []);

  useEffect(() => {
    const currentStage = dealStageList.find(
      (stage) => stage.value === currentStatus
    );
    if (currentStage) {
      setAllowedTransitions(currentStage.allowedTransitions || []);
    }
  }, [dealStageList, currentStatus]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setScrollStartX(scrollContainerRef.current?.scrollLeft ?? 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - (dragStartX ?? 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollStartX - dx;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getDealStageList = async () => {
    const response = await getDealStage();
    const updatedValues = response.map((items) => ({
      label: items.label,
      value: items.value,
      id: Number(items.id),
      allowedTransitions: items.allowedTransitions || [],
      statusOrder: items.statusOrder,
    }));

    setDealStageList(updatedValues);
  };

  const handleStageClick = (stageValue: string, stageId: number) => {
    if (allowedTransitions.includes(stageId)) {
      console.log(`Clicked Stage: ${stageValue}`);
      setSelectedStage(stageValue);
    } else {
      showNotification("ERROR", "You cannot transition to this stage!");
    }
  };

  const handleChangeStage = async () => {
    const response = await updateDealStage(dealID, selectedStage);
    if (response) {
      reloadStages();
    }
    setStageChange(false);

  };
  const formatStage = (stage: string) => {
    return stage.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  };
  const getButtonClass = () => {
    if (currentStatus === "closedWon") {
      return "won";
    } else if (currentStatus === "closedLost") {
      return "lost";
    } else if (allowedTransitions.length > 0) {
      return "next";
    } else {
      return "disabled";
    }
  };
  const getStageClassName = (
    isFirst: boolean,
    isLast: boolean,
    isCurrent: boolean,
    isSelected: boolean,
    isAllowed: boolean,
    isHovered: boolean
  ) => {
    let classNames = ["stage-box"];
  
    if (isFirst) classNames.push("first");
    if (isLast) classNames.push("last");
    if (isCurrent) {
      classNames.push("current");
    } else if (isSelected) {
      classNames.push("selected");
    } else {
      classNames.push("default");
    }
  
    classNames.push(isAllowed ? "allowed" : "not-allowed");
  
    if (isHovered && isAllowed) classNames.push("hovered");
  
    return classNames.join(" ");
  };
  
  
  return (
    <div ref={(reference) => setRef(reference)}>
      <BssCollapse
        title="Opportunity Status"
        defaultExpanded
      >
        <div
          className="status-container"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="stage-wrapper">
            {dealStageList.map((status, index) => {
              const isAllowed = allowedTransitions.includes(status.id);
              const isCurrent = status.value === currentStatus;
              const isSelected = status.value === selectedStage;
              const isHovered = hoveredStage === status.value;
              const isFirst = index === 0;
              const isLast = index === dealStageList.length - 1;

              return (
              <button
                key={status.value}
                className={getStageClassName(isFirst, isLast, isCurrent, isSelected, isAllowed, isHovered)}
                onClick={() => isAllowed && handleStageClick(status.value, status.id)}
                onMouseEnter={() => isAllowed && setHoveredStage(status.value)}
                onMouseLeave={() => setHoveredStage(null)}
                disabled={!isAllowed}
                tabIndex={0}
              >
                {status.label}
              </button>
              
              );
            })}
            <button
              onClick={() => {
                const selectedStageId =
                  dealStageList.find((stage) => stage.value === selectedStage)?.id ?? 0;

                if (allowedTransitions.includes(selectedStageId)) {
                  setStageChange(true);
                }
              }}
              className={`change-stage-btn ${getButtonClass()}`}
              disabled={allowedTransitions.length === 0}
            >
              {(() => {
                if (currentStatus === "closedWon") {
                  return "Closed as Won";
                } else if (currentStatus === "closedLost") {
                  return "Closed as Lost";
                } else if (allowedTransitions.length > 0) {
                  return "Proceed To Next Stage";
                } else {
                  return "No Further Transitions";
                }
              })()}
            </button>
          </div>



          <DigitalBssConfirmModal
            title="Confirm Stage Change"
            isOpen={!!stageChange}
            onOk={handleChangeStage}
            onCancel={() => setStageChange(false)}
            btnDanger
          >
            {`Are you sure you want to change the stage from "${formatStage(currentStatus)}" to "${formatStage(selectedStage)}"?`}
          </DigitalBssConfirmModal>

        </div>
      </BssCollapse>
    </div>
  );
};

export default OpportunityStatusPanel;
