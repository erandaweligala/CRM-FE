import {FC} from "react";
import {Col, Row} from "antd";
import TicketIcon from "../../../../assets/images/Ticket_Icon.svg?react";
import TicketsByCategory from "./components/tickets-by-category/TicketsByCategory";
import Connections from "./components/connections/Connections";
import AverageRevenue from "./components/average-revenue/AverageRevenue";
import CustomerTimeline from "./components/customer-timeline/CustomerTimeline";
import {useAppSelector} from "../../../../store/main-store";
import CustomerPersonal from "./components/customer-personal/CustomerPersonal";
import Engagement from "./components/engagement/Engagement";
import CustomerSummery from "./components/customer-summery/CustomerSummery";
import { SearchPanelModel } from "../../models/SearchPanel.model";
import DigitalBssCardTypeTemp from "../../../../components/DigitalBssCardType/DigitalBssCardType_Temp";
interface CustomerOverviewTabProps {
    searchPanelData: SearchPanelModel|undefined;
}

const CustomerOverviewTab: FC<CustomerOverviewTabProps> = ({searchPanelData}) => {

    const customerOverviewData = useAppSelector(state => state.customerProfile);

    return (
        <>
            {
                customerOverviewData &&
                <div className="customer-overview-tab">
                    <Row gutter={[12, 12]}>
                        <Col span={8}>
                            <DigitalBssCardTypeTemp
                                icon={<TicketIcon style={{width:50,height:40}}/>}
                                text="Total Trouble Tickets"
                                count={customerOverviewData.customerOverview!.customerOverview.totalTicketCount}
                                backgroundColor="#17BA98"
                            />
                        </Col>
                        <Col span={8}>
                            <DigitalBssCardTypeTemp
                                icon={<TicketIcon style={{width:50,height:40}}/>}
                                text="Resolved Trouble Tickets"
                                count={customerOverviewData.customerOverview!.customerOverview.resolvedTicketCount}
                                backgroundColor="#0081A7"
                            />
                        </Col>
                        <Col span={8}>
                            <DigitalBssCardTypeTemp
                                icon={<TicketIcon style={{width:50,height:40}}/>}
                                text="Unresolved Trouble Tickets"
                                count={customerOverviewData.customerOverview!.customerOverview.unresolvedTicketCount}
                                backgroundColor="#FFBF69"
                            />
                        </Col>

                        <Col span={8}>
                            <TicketsByCategory data={customerOverviewData.customerOverview!.customerOverview.ticketByCategory}/>
                        </Col>

                        <Col span={8}>
                            <Connections data={customerOverviewData.customerOverview!.customerOverview.connections}/>
                        </Col>

                        <Col span={8}>
                            <AverageRevenue data={customerOverviewData.customerOverview!.customerOverview.averageRevenue}/>
                        </Col>

                        <Col span={24}>
                            {searchPanelData && <CustomerTimeline searchPanelData={searchPanelData}/>}
                        </Col>

                        
                        
                        <Col span={10} >
                        <Row>
                            <Col span={24} className="mb-3">
                                <CustomerPersonal data={customerOverviewData.customerOverview!.customerOverview.customerPersonas}/>
                            </Col>
                            <Col span={24}>                            
                                {customerOverviewData.customerOverview!.customerOverview.customerSummary && customerOverviewData.customerOverview!.customerOverview.customerSummary.length > 0 && (
                                    <CustomerSummery data={customerOverviewData.customerOverview!.customerOverview.customerSummary[0]}/>
                                )}
                            </Col>
                        </Row>
                        </Col>
                        <Col span={14} >
                            <Engagement engagementData={customerOverviewData.customerOverview!.customerOverview.engagements}/>
                        </Col>
              
                    </Row>
                </div>
            }

        </>
    )
}

export default CustomerOverviewTab;