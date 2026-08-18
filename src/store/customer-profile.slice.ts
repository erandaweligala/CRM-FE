import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import CustomerOverviewModel from "../pages/customer-profile/models/CustomerOverviewModel";
import ConnectionOverviewModel from "../pages/customer-profile/models/ConnectionOverviewModel";
import {CustomerProfileModel} from "../pages/customer-profile/models/CustomerProfileModel";
import AccountModel from "../pages/customer-profile/models/AccountModel";
import SalesAndServicesModel from "../pages/customer-profile/models/SalesAndServicesModel";
import { OrdersModel } from "../pages/customer-profile/models/OrdersModel";

interface CustomerProfileState {
    selectedMsisdn: string | null,
    customerOverview: CustomerOverviewModel | null;
    connectionOverview: ConnectionOverviewModel | null;
    customerProfile: CustomerProfileModel | null;
    account: AccountModel | null;
    products: SalesAndServicesModel[] | null;
    orders: OrdersModel[] | null;
}

const initialCustomerProfileState: CustomerProfileState = {
    selectedMsisdn: null,
    customerOverview: null,
    connectionOverview: null,
    customerProfile: null,
    account: null,
    products: null,
    orders: null
}

const customerProfileSlice = createSlice({
    name: "customerOverview",
    initialState: initialCustomerProfileState,
    reducers: {
        setSelectedMsisdn(state, action: PayloadAction<string>) {
            state.selectedMsisdn = action.payload;
        },
        setCustomerOverview(state, action: PayloadAction<CustomerOverviewModel>) {
            state.customerOverview = action.payload;
        },
        setConnectionOverview(state, action: PayloadAction<ConnectionOverviewModel>) {
            state.connectionOverview = action.payload;
        },
        setCustomerProfile(state, action: PayloadAction<CustomerProfileModel>) {
            state.customerProfile = action.payload;
        },
        setAccount(state, action: PayloadAction<AccountModel>) {
            state.account = action.payload;
        },
        setProducts(state, action: PayloadAction<SalesAndServicesModel[]>) {
            state.products = action.payload;
        },
        setOrders(state, action: PayloadAction<OrdersModel[]>) {
            state.orders = action.payload;
        },
        clearStore(state) {
            state.selectedMsisdn = null;
            state.connectionOverview = null;
            state.customerOverview = null;
            state.customerProfile = null;
            state.account = null;
            state.products = null;
            state.orders = null;
        },
        changeTab(state) {
            state.customerProfile = null;
            state.orders = null;
            state.account = null;
            state.products = null;
            state.connectionOverview = null;
        }
    }
});

export const  customerProfileAction = customerProfileSlice.actions;

export default customerProfileSlice;