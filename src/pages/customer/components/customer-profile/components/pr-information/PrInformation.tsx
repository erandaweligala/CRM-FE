import { Col, Tabs, TabsProps } from "antd";
import PrOverview from "../pr-overview/PrOverview";
import { useAppDispatch, useAppSelector } from "../../../../../../store/main-store";
import { customerAction } from "../../../../../../store/customer.slice";
import { FC } from "react";
import OrdersTab from "../../../../../customer-profile/components/orders-tab/OrdersTab";
import PrBill from "./components/pr-bill/PrBill";
import PrPayment from "./components/pr-payments/PrPayment";
import SalesAndServicesTab from "../../../../../customer-profile/components/sales-and-services-tab/SalesAndServicesTab";
import { getConnectionSubscriptionsData } from "../../../../../customer-profile/services/customer-profile.service";

interface PrInformationProps {

    selectedPaymentResponsibility: string;

}
const PrInformation: FC<PrInformationProps> = ({ selectedPaymentResponsibility }) => {
    const dispatch = useAppDispatch();
    const selectedMsisdnDataFromStore = useAppSelector(state => state.customer.selectedMsisdn);
    const tabList: TabsProps['items'] = [
        {
            key: "Overview",
            label: "PR Overview",
            children: <PrOverview selectedPaymentResponsibility={selectedPaymentResponsibility} />,
        },
        {
            key: "Bills",
            label: "PR Bills",
            children: <PrBill />,
        },
        {
            key: "Payments",
            label: "PR Payments",
            children: <PrPayment />,
        },//NEW ADDED
        {
            key: "Subscriptions",
            label: "Subscriptions",
            children: <SalesAndServicesTab/>,
        },
        {
            key: "Orders",
            label: "Orders",
            children: <OrdersTab msisdn={selectedMsisdnDataFromStore} />,
        }
    ];
    const singleTabDataLoading = async (tabId: "Subscriptions") => {
        if (tabId === "Subscriptions") {
            const productsData = await getConnectionSubscriptionsData(selectedPaymentResponsibility);
            dispatch(customerAction.setProducts(productsData));
        }
    }

    const onTabChange = async (key: string) => {
        console.log(key);
        if (key === "Subscriptions") {
            await singleTabDataLoading("Subscriptions");
        }
    };
    return (
        <Col span={24} className="pl-3">
            <Tabs
                defaultActiveKey="Overview"
                items={tabList}
                onChange={onTabChange}
                className="w-100"
            />
        </Col>
    )
}

export default PrInformation;
