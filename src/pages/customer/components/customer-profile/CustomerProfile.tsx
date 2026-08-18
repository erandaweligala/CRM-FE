import { FC, useEffect, useState } from "react";
import "./CustomerProfile.scss";
import { Tabs, TabsProps } from "antd";
import CustomerOverviewTab from "./components/customer-overview-tab/CustomerOverviewTab";
import CustomerProfileTab from "./components/customer-profile-tab/CustomerProfileTab";
import PageNoData from "../../../../components/page-no-data/PageNoData";
import { useAppDispatch, useAppSelector } from "../../../../store/main-store";
import { customerAction } from "../../../../store/customer.slice";
import CustomerProfileTabsEnum from "./constants/customer-profile-tabs.enum";
import { SearchPanelModel } from "./models/SearchPanel.model";
import { hasPermissionToTheAction } from "../../../../../src/services/permission.service";
import ACTION_PERMISSION from "../../../../../src/constants/action-permission";
import { OrdersRequestModel } from "../../../customer-profile/models/OrdersModel";
import { getConnectionOrdersData, getCustomerProfileData, getConnectionOverviewData, getConnectionAccountData } from "../../../customer-profile/services/customer-profile.service";


interface CustomerProfileProps {
        searchPanelData?: SearchPanelModel;

}

const CustomerProfile: FC<CustomerProfileProps> = ({searchPanelData}) => {

    const [activeTabKey, setActiveTabKey] = useState<CustomerProfileTabsEnum>(CustomerProfileTabsEnum.CUSTOMER_OVERVIEW);
    const [tabs, setTabs] = useState<TabsProps['items']>([])

    const selectedMsisdnDataFromStore = useAppSelector(state => state.customer.selectedMsisdn);
    const customerId = useAppSelector(state => state.customer.customerOverview?.customerOverview.customerId);
    const customerOverviewDataFromStore = useAppSelector(state => state.customer.customerOverview);
    const connectionOverviewDataFromStore = useAppSelector(state => state.customer.connectionOverview);
    const customerProfileDataFromStore = useAppSelector(state => state.customer.customerProfile);
    const accountDataFromStore = useAppSelector(state => state.customer.account);
    const productsDataFromStore = useAppSelector(state => state.customer.products);
    const ordersDataFromStore = useAppSelector(state => state.customer.orders);

    const dispatch = useAppDispatch();

    useEffect(() => {

        const items: TabsProps['items'] = [];

        if (hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_CUSTOMER_OVERVIEW)) {
            items.push({
                key: CustomerProfileTabsEnum.CUSTOMER_OVERVIEW,
                label: "Customer Overview",
                children: <CustomerOverviewTab />,
            });
        }

        if (hasPermissionToTheAction(ACTION_PERMISSION.DISPLAY_CUSTOMER_PROFILE)) {
            items.push({
                key: CustomerProfileTabsEnum.CUSTOMER_PROFILE,
                label: "Customer Profile",
                children: <CustomerProfileTab onReloadTabDataRequest={() => singleTabDataLoading("PROFILE")} />,
            });
        }
        setTabs(items);

    }, [searchPanelData, selectedMsisdnDataFromStore])


    useEffect(() => {
        if (selectedMsisdnDataFromStore) {
            setValues();
        }
    }, [selectedMsisdnDataFromStore]);
    const setValues = async () => {
        const payload: OrdersRequestModel = {
            serviceReference: selectedMsisdnDataFromStore ?? undefined,
        }
        const ordersData = await getConnectionOrdersData(payload);
        dispatch(customerAction.setOrders(ordersData));
    }
    const singleTabDataLoading = async (tabId: "PROFILE" | "CONNECTION_OVERVIEW" | "ACCOUNT" | "PRODUCTS" | "ORDERS") => {
        if (tabId === "PROFILE") {
            const customerProfileData = await getCustomerProfileData(customerId ?? null);
            dispatch(customerAction.setCustomerProfile(customerProfileData));
        } else if (tabId === "CONNECTION_OVERVIEW") {
            if (selectedMsisdnDataFromStore) {
                const connectionOverviewData = await getConnectionOverviewData(selectedMsisdnDataFromStore);
                dispatch(customerAction.setConnectionOverview(connectionOverviewData));
            }
        } else if (tabId === "ACCOUNT") {
            if (selectedMsisdnDataFromStore) {
                const accountData = await getConnectionAccountData(selectedMsisdnDataFromStore);
                dispatch(customerAction.setAccount(accountData));
            }
        }else if (tabId === "ORDERS") {
            const payload: OrdersRequestModel = {
                serviceReference: selectedMsisdnDataFromStore ?? undefined,
            }
            const ordersData = await getConnectionOrdersData(payload);
            dispatch(customerAction.setOrders(ordersData));
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




    return (
     
            <div>

                {
                    !customerOverviewDataFromStore &&
                    <PageNoData />
                }

                {
                    customerOverviewDataFromStore &&
                        <Tabs
                            defaultActiveKey="1"
                            items={tabs}
                            onChange={onTabChange}
                            activeKey={activeTabKey} />
                }


            </div>


      
    );
};

export default CustomerProfile;