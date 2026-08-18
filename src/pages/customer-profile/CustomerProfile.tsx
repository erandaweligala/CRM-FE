import {FC, useEffect, useState} from "react";
import "./CustomerProfile.scss";
import {Col, Row, Tabs, TabsProps} from "antd";
import GeneralInfoCard from "./components/general-info-card/GeneralInfoCard";
import ConnectionTypeBtn from "./components/connection-type-btn/ConnectionTypeBtn";
import ConnectionOverviewTab from "./components/connection-overview-tab/ConnectionOverviewTab";
import CustomerOverviewTab from "./components/customer-overview-tab/CustomerOverviewTab";
import CustomerProfileTab from "./components/customer-profile-tab/CustomerProfileTab";
import AccountTab from "./components/account-tab/AccountTab";
import SalesAndServicesTab from "./components/sales-and-services-tab/SalesAndServicesTab";
import PageNoData from "../../components/page-no-data/PageNoData";
import {useAppDispatch, useAppSelector} from "../../store/main-store";
import {
    getConnectionAccountData,
    getConnectionOrdersData,
    getConnectionOverviewData,
    getConnectionProductData,
    getCustomerProfileData
} from "./services/customer-profile.service";
import {customerProfileAction} from "../../store/customer-profile.slice";
import CustomerProfileTabsEnum from "./constants/customer-profile-tabs.enum";
import {SearchPanelModel} from "./models/SearchPanel.model";
import {hasPermissionToTheAction} from "../../services/permission.service";
import ACTION_PERMISSION from "../../constants/action-permission";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import OrdersTab from "./components/orders-tab/OrdersTab";
import { OrdersRequestModel } from "./models/OrdersModel";


interface CustomerProfileProps {
    searchPanelData?: SearchPanelModel;
}

const CustomerProfile: FC<CustomerProfileProps> = ({searchPanelData}) => {

    const [activeTabKey, setActiveTabKey] = useState<CustomerProfileTabsEnum>(CustomerProfileTabsEnum.CUSTOMER_OVERVIEW);
    const [tabs, setTabs] = useState<TabsProps['items']>([])

    const selectedMsisdnDataFromStore = useAppSelector(state => state.customerProfile.selectedMsisdn);
    const customerID = useAppSelector(state => state.customerProfile.customerOverview?.customerOverview.customerId);
    const customerOverviewDataFromStore = useAppSelector(state => state.customerProfile.customerOverview);
    const connectionOverviewDataFromStore = useAppSelector(state => state.customerProfile.connectionOverview);
    const customerProfileDataFromStore = useAppSelector(state => state.customerProfile.customerProfile);
    const accountDataFromStore = useAppSelector(state => state.customerProfile.account);
    const productsDataFromStore = useAppSelector(state => state.customerProfile.products);
    const ordersDataFromStore = useAppSelector(state => state.customerProfile.orders);

    const dispatch = useAppDispatch();

    useEffect(() => {

        const items: TabsProps['items'] = [];

        if(hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_CUSTOMER_OVERVIEW)) {
            items.push({
                key: CustomerProfileTabsEnum.CUSTOMER_OVERVIEW,
                label: "Customer Overview",
                children: <CustomerOverviewTab searchPanelData={searchPanelData}/>,
            });
        }

        if(hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_CONNECTION_OVERVIEW)) {
            items.push({
                key: CustomerProfileTabsEnum.CONNECTION_OVERVIEW,
                label: "Connection Overview",
                children: <ConnectionOverviewTab/>,
            });
        }

        if(hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_CUSTOMER_PROFILE)) {
            items.push({
                key: CustomerProfileTabsEnum.CUSTOMER_PROFILE,
                label: "Customer Profile",
                children: <CustomerProfileTab onReloadTabDataRequest={() => singleTabDataLoading("PROFILE")}/>,
            });
        }

        if(hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_ACCOUNT)) {
            items.push({
                key: CustomerProfileTabsEnum.ACCOUNT,
                label: "Account",
                children: <AccountTab/>,
            });
        }

        if(hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_PRODUCT)) {
            items.push({
                key: CustomerProfileTabsEnum.PRODUCTS,
                label: "Subscriptions",
                children: <SalesAndServicesTab/>,
            });
        }

        //need to add permissions accordingly 
        //for now quota permission is set
        if(hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_QUOTA)) {
            items.push({
                key: CustomerProfileTabsEnum.ORDERS,
                label: "Orders",
                children: <OrdersTab msisdn={selectedMsisdnDataFromStore}/>,
            });
        }

        setTabs(items);

    }, [searchPanelData,selectedMsisdnDataFromStore])

    const singleTabDataLoading = async (tabId: "PROFILE" | "CONNECTION_OVERVIEW" | "ACCOUNT" | "PRODUCTS" | "ORDERS") => {
        if(tabId === "PROFILE") {
            console.log("Selected Service Number: " + selectedMsisdnDataFromStore);
            const customerProfileData = await getCustomerProfileData(customerID ?? null);
            dispatch(customerProfileAction.setCustomerProfile(customerProfileData));
        } else if(tabId === "CONNECTION_OVERVIEW") {
            const connectionOverviewData = await getConnectionOverviewData(selectedMsisdnDataFromStore);
            dispatch(customerProfileAction.setConnectionOverview(connectionOverviewData));
        } else if(tabId === "ACCOUNT") {
            const accountData = await getConnectionAccountData(selectedMsisdnDataFromStore);
            dispatch(customerProfileAction.setAccount(accountData));
        } else if(tabId === "PRODUCTS") {
            const productsData = await getConnectionProductData(selectedMsisdnDataFromStore);
            dispatch(customerProfileAction.setProducts(productsData));
        } else if(tabId === "ORDERS") {
            const payload :OrdersRequestModel = {
                serviceReference: selectedMsisdnDataFromStore ?? undefined,
             }
            const ordersData = await getConnectionOrdersData(payload);
            dispatch(customerProfileAction.setOrders(ordersData));
        }
    }


    const onTabChange = async (key: string) => {
        if (key === CustomerProfileTabsEnum.CUSTOMER_OVERVIEW) {
            // Data Should be there
        } else if (key === CustomerProfileTabsEnum.CONNECTION_OVERVIEW && !connectionOverviewDataFromStore) {
            await singleTabDataLoading("CONNECTION_OVERVIEW");
        } else if (key === CustomerProfileTabsEnum.CUSTOMER_PROFILE && !customerProfileDataFromStore) {
            await singleTabDataLoading("PROFILE");
        } else if (key === CustomerProfileTabsEnum.ACCOUNT && !accountDataFromStore) {
            await singleTabDataLoading("ACCOUNT");
        } else if (key === CustomerProfileTabsEnum.PRODUCTS && !productsDataFromStore) {
            await singleTabDataLoading("PRODUCTS");
        } else if (key === CustomerProfileTabsEnum.ORDERS && !ordersDataFromStore) {
            await singleTabDataLoading("ORDERS");
        }
        setActiveTabKey(key as CustomerProfileTabsEnum);
    };


    const onClickMsisdn = (msisdn: string) => {
        dispatch(customerProfileAction.setSelectedMsisdn(msisdn));
        setActiveTabKey(CustomerProfileTabsEnum.CUSTOMER_OVERVIEW);
        dispatch(customerProfileAction.changeTab());
    }


    return (
        <div className="customer-profile">
            <div style={{marginTop: 12}}>
                {
                    !customerOverviewDataFromStore &&
                    <PageNoData/>
                }

                {
                    customerOverviewDataFromStore &&
                    <Row gutter={[12, 12]} className="mt-3">


                        <ActionPermission action={ACTION_PERMISSION.DISPLAY_CUSTOMER_OVERVIEW}>
                            <Col span={6}>
                                <GeneralInfoCard/>
                            </Col>
                        </ActionPermission>

                        <Col span={hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_CUSTOMER_OVERVIEW) ? 18 : 24}>

                            <div>

                                {
                                    customerOverviewDataFromStore.serviceReferenceList.map((singleConnection) => {
                                        return (
                                            <ConnectionTypeBtn
                                                msisdn={singleConnection.serviceReference}
                                                isActive={singleConnection.serviceReference === selectedMsisdnDataFromStore}
                                                paymentType={singleConnection.paymentType}
                                                connectionType={singleConnection.connectionType}
                                                accountStatus={singleConnection.accountStatus}
                                                onClick={(msisdn) => onClickMsisdn(msisdn)}
                                                key={singleConnection.serviceReference}
                                            />
                                        )
                                    })
                                }

                            </div>

                            <Tabs
                                defaultActiveKey="1"
                                items={tabs}
                                onChange={onTabChange}
                                className="mt-3"
                                activeKey={activeTabKey}
                            />

                        </Col>

                    </Row>
                }


            </div>


        </div>
    );
};

export default CustomerProfile;