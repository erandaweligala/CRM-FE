import {FC} from "react";
import {Steps} from "antd";
import "./LastInteractions.scss";
import {TimeLineModel} from "../../../../models/ConnectionOverviewModel";
import { BSS_Container, BSS_SquareButton } from "bss-component-library";

interface LastInteractionsProps {
    data: TimeLineModel[]
}

const LastInteractions: FC<LastInteractionsProps> = () => {

    const dummyData: TimeLineModel[] = [
        {
            title: "Feb 26, 2023 09:52:03 AM",
            description: "Activated the Mobile Connection",
            date: ""
        },
        {
            title: "Feb 26, 2023 09:51:48 AM",
            description: "Attached the CBS Main Package - Student Package offer",
            date: ""
        },
        {
            title: "Feb 26, 2023 09:51:12 AM",
            description: "Mobile Connection Provisioned",
            date: ""
        },
        {
            title: "Feb 26, 2023 09:50:00 AM",
            description: "Attached the CBS Main Package",
            date: ""
        },
    ]

    const stepItems = dummyData.map((singleTimelineItem) => {
        return {title: singleTimelineItem.title, description: singleTimelineItem.description}
    })

    return (
        <BSS_Container
            titleComponent={<BSS_SquareButton onClick={() => {}} type="VIEW"/>}
            title="Last 10 Interactions"
            height="250px"
        >
            <div className="pa-3 last-interactions">
                <Steps
                    progressDot
                    direction="vertical"
                    className="data-display-stepper"
                    items={stepItems}
                />
            </div>

        </BSS_Container>
    )
}

export default LastInteractions;