import { FC } from "react";
import { Col, Row } from "antd";
import TicketIcon from "../../../../../../assets/images/Ticket_Icon.svg?react";
import { useAppSelector } from "../../../../../../store/main-store";
import { SearchPanelModel } from "../../models/SearchPanel.model";
import DigitalBssCardType from "../../../../../../components/DigitalBssCardType/DigitalBssCardType_Temp";
import Engagement from "../../../../../customer-profile/components/customer-overview-tab/components/engagement/Engagement";
import CustomerTimeline from "../../../../../customer-profile/components/customer-overview-tab/components/customer-timeline/CustomerTimeline";
import TicketsByCategory from "../../../../../customer-profile/components/customer-overview-tab/components/tickets-by-category/TicketsByCategory";
interface CustomerOverviewTabProps {
}

const CustomerOverviewTab: FC<CustomerOverviewTabProps> = () => {
    const customerOverviewData = useAppSelector(state => state.customer);
    const serviceReferenceType = customerOverviewData.serviceReferenceType;
    const serviceReferenceValue = customerOverviewData.serviceReferenceValue;
    const customerIdentificationType = customerOverviewData.customerIdentificationType;
    const serviceInfo: SearchPanelModel = {
        serviceReferenceType: serviceReferenceType ?? '',
        serviceReferenceValue: serviceReferenceValue ?? '',
        customerIdentificationType: customerIdentificationType ?? ''
    };
    if (!customerOverviewData) return null;

    const { totalTicketCount, resolvedTicketCount, unresolvedTicketCount, ticketByCategory, engagements } = customerOverviewData.customerOverview!.customerOverview;

    return (
        <div className="customer-overview-tab">
            <Row gutter={[16, 16]}>
                {[
                    { text: "Total Trouble Tickets", count: totalTicketCount, color: "#17BA98" },
                    { text: "Resolved Trouble Tickets", count: resolvedTicketCount, color: "#0081A7" },
                    { text: "Unresolved Trouble Tickets", count: unresolvedTicketCount, color: "#FFBF69" }
                ].map(({ text, count, color }) => (
                    <Col span={8} key={text}>
                        <DigitalBssCardType
                            icon={<TicketIcon style={{background:color,width:50,height:40}}/>}
                            text={text}
                            count={count}
                            backgroundColor={color}
                        />
                    </Col>
                ))}

                <Col span={12}>
                 
                        <TicketsByCategory data={ticketByCategory} />
                   
                </Col>

                <Col span={12}>
                   
                        <Engagement engagementData={engagements} />
                    
                </Col>

                <Col span={24}>
             
                        <CustomerTimeline searchPanelData={serviceInfo} />
                  
                </Col>
            </Row>
        </div>
    );
};

export default CustomerOverviewTab;