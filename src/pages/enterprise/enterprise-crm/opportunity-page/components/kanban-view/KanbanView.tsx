import React, { useCallback } from "react";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import KanbanViewFunnelItemList from "./components/kanban-view-funnal-item-list/KanbanViewFunnelItemList";
import KanbanViewFunnelSingleItem from "./components/kanban-view-funnal-single-item/KanbanViewFunnelSingleItem";
import DealsKanbanViewResponseModel from "../../models/DealsKanbanViewResponse.model";
import { BASE_PATH } from "../../../../../../constants/internal-routes";
import "./KanbanView.scss"

interface KanbanViewProps {
    kanbanData: DealsKanbanViewResponseModel[];
}

const KanbanView: React.FC<KanbanViewProps> = ({ kanbanData }) => {
    const navigate = useNavigate();

    const navigateToDeal = useCallback((dealId: string) => {
        navigate(BASE_PATH + "/deals/" + dealId);
    }, [navigate]);


    return (
        <>
            {Array.isArray(kanbanData) && kanbanData.length > 0 ? (

                <div className="kanban-scroll-container">
                    <div className="kanban-board">
                        {kanbanData.map((stage) => (
                            <div key={stage.stage} className="kanban-column">
                                <KanbanViewFunnelItemList data={stage} />
                                <KanbanViewFunnelSingleItem data={stage} onClickSingleDeal={navigateToDeal} />
                            </div>
                        ))}
                    </div>
                </div>


            ) : (
                <div className="kanban-empty-state">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>

            )}
        </>
    );
};

export default KanbanView;