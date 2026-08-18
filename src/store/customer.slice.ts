import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import CustomerOverviewModel from "../pages/customer-profile/models/CustomerOverviewModel";
import ConnectionOverviewModel from "../pages/customer-profile/models/ConnectionOverviewModel";
import {CustomerProfileModel} from "../pages/customer-profile/models/CustomerProfileModel";
import AccountModel from "../pages/customer-profile/models/AccountModel";
import SalesAndServicesModel from "../pages/customer-profile/models/SalesAndServicesModel";
import { OrdersModel } from "../pages/customer-profile/models/OrdersModel";

interface CustomerState {
    selectedMsisdn: string | null,
    customerOverview: CustomerOverviewModel | null;
    connectionOverview: ConnectionOverviewModel | null;
    customerProfile: CustomerProfileModel | null;
    account: AccountModel | null;
    products: SalesAndServicesModel[] | null;
    orders: OrdersModel[] | null;
    serviceReferenceType: string| null;
    serviceReferenceValue: string| null;
    customerIdentificationType: string| null;
}

const initialCustomerState: CustomerState = {
    selectedMsisdn: null,
    customerOverview: null,
    connectionOverview: null,
    customerProfile: null,
    account: null,
    products: null,
    orders: null,
    serviceReferenceType: null,
    serviceReferenceValue: null,
    customerIdentificationType: null,
}

const customerSlice = createSlice({
    name: "customerOverview",
    initialState: initialCustomerState,
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
        setServiceReferenceType(state, action: PayloadAction<string>) {
            state.serviceReferenceType = action.payload;
        },
        setServiceReferenceValue(state, action: PayloadAction<string>) {
            state.serviceReferenceValue = action.payload;
        },
        setCustomerIdentificationType(state, action: PayloadAction<string>) {
            state.customerIdentificationType = action.payload;
        },
        clearStore(state) {
            state.selectedMsisdn = null;
            state.connectionOverview = null;
            state.customerOverview = null;
            state.customerProfile = null;
            state.account = null;
            state.products = null;
            state.orders = null;
            state.serviceReferenceType = null;
            state.serviceReferenceValue = null;
            state.customerIdentificationType = null;
        },
        changeTab(state) {
            state.customerProfile = null;
            state.orders = null;
            state.account = null;
            state.products = null;
            state.connectionOverview = null;
            state.serviceReferenceType = null;
            state.serviceReferenceValue = null;
            state.customerIdentificationType = null;
        }
    }
});

export const  customerAction = customerSlice.actions;

export default customerSlice;