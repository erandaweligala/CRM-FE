import {FC, useEffect, useState} from "react";
import {Col, Row, Skeleton} from "antd";
import CardType1Detail from "./components/card-type-1-detail-view/CardType1Detail";

import PackageName from "../../../../assets/images/package-name.svg?react";
import TotalPayable from "../../../../assets/images/total-payable.svg?react";
import UnresolvedTicket from "../../../../assets/images/unresolved-tickets.svg?react";

import LastInteractions from "./components/last-interactions/LastInteractions";
import OrderHistory from "./components/order-history/OrderHistory";
import UsageSummary from "./components/usage-summary/UsageSummary";


import {useAppSelector} from "../../../../store/main-store";

interface ConnectionOverviewTabProps {
}

const ConnectionOverviewTab: FC<ConnectionOverviewTabProps> = () => {

    const customerOverviewDataFromStore = useAppSelector(state => state.customerProfile.customerOverview);
    const selectedMsisdnDataFromStore = useAppSelector(state => state.customerProfile.selectedMsisdn);
    const connectionOverviewDataFromStore = useAppSelector(state => state.customerProfile.connectionOverview);
    const [selectedMsisdnDetails, setSelectedMsisdnDetails] = useState<{
        msisdn: string | null;
        paymentType: string | null;
    }>({
        msisdn: null,
        paymentType:null
    })

    useEffect(() => {

        const selectedMsisdnDetailsFromArray = customerOverviewDataFromStore?.serviceReferenceList.find((singleMsisdn) => {
            return singleMsisdn.serviceReference === selectedMsisdnDataFromStore;
        });

        if (selectedMsisdnDetailsFromArray) {
            setSelectedMsisdnDetails({
                msisdn: selectedMsisdnDetailsFromArray.serviceReference,
                paymentType: selectedMsisdnDetailsFromArray.paymentType
            })
        }

    }, [selectedMsisdnDataFromStore, customerOverviewDataFromStore])

    return (
        <>
            {
                !connectionOverviewDataFromStore &&
                <Skeleton active={true} paragraph={{rows: 10}}/>
            }

            {
                connectionOverviewDataFromStore &&
                <div className="connection-overview-component">
                    <Row gutter={[16, 16]} className="mb-2">
                        <Col span={8}>
                            <CardType1Detail
                                icon={<PackageName/>}
                                title="Package Name"
                                description={connectionOverviewDataFromStore.connectionSummary.packageName}
                                backgroundColor="#0081A7"
                                contentDescTitle={["Registered Date", "Expiry Date"]}
                                contentDescDesc={[connectionOverviewDataFromStore.connectionSummary.registerDate, connectionOverviewDataFromStore.connectionSummary.expireDate]}
                            />
                        </Col>
                        <Col span={8}>
                            {
                                selectedMsisdnDetails?.paymentType?.toUpperCase() === "POSTPAID" &&
                                <CardType1Detail
                                    icon={<TotalPayable/>}
                                    title="Main Balance"
                                    description={connectionOverviewDataFromStore.balanceSummary.mainBalance}
                                    backgroundColor="#00BDA4"
                                    contentDescTitle={["Last Bill Value", "Payment Due Date"]}
                                    contentDescDesc={[
                                        connectionOverviewDataFromStore.balanceSummary.lastBillValue,
                                        connectionOverviewDataFromStore.balanceSummary.paymentDueDate
                                    ]}
                                />
                            }
                            {
                                selectedMsisdnDetails?.paymentType?.toUpperCase() === "PREPAID" &&
                                <CardType1Detail
                                    icon={<TotalPayable/>}
                                    title="Main Balance"
                                    description={connectionOverviewDataFromStore.balanceSummary.mainBalance}
                                    backgroundColor="#00BDA4"
                                    contentDescTitle={["Expire Date", "Last Recharge Date"]}
                                    contentDescDesc={[
                                        connectionOverviewDataFromStore.balanceSummary.expireDate,
                                        connectionOverviewDataFromStore.balanceSummary.lastRechargeDate
                                    ]}
                                />
                            }
                        </Col>
                        <Col span={8}>
                            <CardType1Detail
                                icon={<UnresolvedTicket/>}
                                title="Unresolved Tickets"
                                description={connectionOverviewDataFromStore.ticketSummary.unresolvedTroubleTicketCount}
                                backgroundColor="#FF6E3C"
                                contentDescTitle={["Last Ticket Date", "All Ticket Count "]}
                                contentDescDesc={[connectionOverviewDataFromStore.ticketSummary.lastTicketDate, connectionOverviewDataFromStore.ticketSummary.allTicketCount]}
                            />
                        </Col>
                        <Col span={6}>
                            <LastInteractions data={connectionOverviewDataFromStore.timeLine}/>
                        </Col>
                        <Col span={8}>
                            <UsageSummary data={connectionOverviewDataFromStore.usageSummary}/>
                        </Col>
                        <Col span={10}>
                            <OrderHistory data={connectionOverviewDataFromStore.orderSummary}/>
                        </Col>
                    </Row>
                    <Row className="mt-3 mb-3">
                        <Col span={24}>
                            {/* <ServiceAndUsage
                                data={connectionOverviewDataFromStore.quotaSummary && connectionOverviewDataFromStore.quotaSummary.slice(0, 3)}
                            /> */}
                        </Col>
                    </Row>
                </div>
            }
        </>
    )
}

export default ConnectionOverviewTab;