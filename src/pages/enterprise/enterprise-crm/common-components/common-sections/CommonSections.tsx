import { FC } from "react";
import { Button, Descriptions } from "antd";
import StatusStageItem from "../../single-opportunity-page/components/status-stage-item/StatusStageItem.tsx";
import WebsiteItem from "../website-item/WebsiteItem.tsx";
import DefaultItem from "../default-item/DefaultItem.tsx";
import EntityDetail from "../../common-models/EntityDetail.ts";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import { EyeOutlined } from "@ant-design/icons";

interface CommonSectionsProps {
    setRef: (el: HTMLDivElement | null, sectionName: string) => void;
    formattedResponse: { title: string; accountDetails: EntityDetail[] }[];
    redirectTo?: () => void;
}
const CommonSections: FC<CommonSectionsProps> = ({
    setRef,
    formattedResponse = [],
    redirectTo
}) => {
    const isStatusItem = (label: string) => ["Status", "Stage"].includes(label);
    const isWebsiteItem = (label: string) =>
        label.includes("Corporate Website") || label.includes("Website");

    const renderDescriptionItem = ({ inputLable, value }: EntityDetail) => {
        const val = value ?? "";

        if (isStatusItem(inputLable)) {
            return (
                <Descriptions.Item label={inputLable} key={inputLable}>
                    <StatusStageItem value={val} />
                </Descriptions.Item>
            );
        }

        if (isWebsiteItem(inputLable)) {
            return (
                <Descriptions.Item label={inputLable} key={inputLable}>
                    <WebsiteItem value={val} />
                </Descriptions.Item>
            );
        }

        return (
            <Descriptions.Item label={inputLable} key={inputLable}>
                <DefaultItem label={inputLable} value={val} />
            </Descriptions.Item>
        );
    };

    const renderExtraButton = (title: string) => {
        if (!["Lead Information", "Opportunity Information"].includes(title)) return null;

        return (
            <Button
                type="default"
                icon={<EyeOutlined />}
                size="small"
                onClick={redirectTo}
            >
                {title === "Lead Information" ? "Lead" : "Opportunity"}
            </Button>
        );
    };

    return (
        <>
            {formattedResponse.map(({ title, accountDetails }) => {
                const descriptionItem = accountDetails.find(item => item.inputLable === "Description");
                const statusItem = accountDetails.find(item => item.inputLable === "Status");
                const otherItems = accountDetails.filter(
                    item => item.inputLable !== "Description" && item.inputLable !== "Status"
                );

                const orderedItems = [
                    ...otherItems,
                    ...(statusItem ? [statusItem] : []),
                    ...(descriptionItem ? [descriptionItem] : []),
                ];

                return (
                    <div ref={(ref) => setRef(ref, title)} key={title}>
                        <BssCollapse
                            key={title}
                            title={title}
                            defaultExpanded
                            extra={renderExtraButton(title)}
                        >
                            <Descriptions
                                bordered
                                labelStyle={{ width: "15%" }}
                                column={3}
                                className="custom-descriptions descriptions-margin"
                            >
                                {orderedItems.map(renderDescriptionItem)}
                            </Descriptions>
                        </BssCollapse>
                    </div>
                );
            })}
        </>
    );
};
export default CommonSections;