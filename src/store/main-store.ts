import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import customerProfileSlice from "./customer-profile.slice";
import {clearTokenInterceptors, setTokenInterceptor} from "../services/axios.service";
import jwt_decode from "jwt-decode";
import AccessTokenModel from "../model/AccessToken.Model";
import metaDataSlice from "./meta-data.slice";
import {AUTH_BYPASS_ENABLED, BYPASS_SESSION} from "../constants/auth-bypass";
import customerSlice from "./customer.slice";
import { QuotationListResponseModel } from "../pages/enterprise/enterprise-crm/single-opportunity-page/components/quotation-drawer/models/response/quote-list-response-model";
import { ParentQuoteList } from "../pages/enterprise/enterprise-crm/single-opportunity-page/components/quotation-drawer/models/quotes-response-body-model";

interface AuthState {
    isUserLogin: boolean;
    accessToken: string | null;
    decodedToken: AccessTokenModel | null;
}

// With the auth bypass on, the app starts already "logged in" using a synthetic
// session so the home page renders without going through Keycloak.
const initialAuthStatus: AuthState = AUTH_BYPASS_ENABLED
    ? {
        isUserLogin: true,
        accessToken: null,
        decodedToken: BYPASS_SESSION
    }
    : {
        isUserLogin: false,
        accessToken: null,
        decodedToken: null
    }

// tmf quotation information actions

const initialTMFQuoteList: ParentQuoteList = {
    // quotesData: {
    //     '0001': [{
    //         id: "",
    //         href: "",
    //         version: "",
    //         name: "",
    //         externalId: "",
    //         quoteItem: []
    //     }]
    // }
    quotesData: {}
}

const initialInreviewQuoteList: QuotationListResponseModel = {
    quoteList: []
}

const initialQuoteList: QuotationListResponseModel = {
    quoteList: []
}
const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthStatus,
    reducers: {
        userLogin(state, action: PayloadAction<{ accessToken: string }>) {
            state.isUserLogin = true;
            state.accessToken = action.payload.accessToken;
            state.decodedToken = jwt_decode(action.payload.accessToken);
            setTokenInterceptor();
        },
        userLogout(state) {
            if (AUTH_BYPASS_ENABLED) {
                // Never drop the synthetic session while the bypass is on.
                return;
            }
            state.isUserLogin = false;
            state.accessToken = null;
            clearTokenInterceptors()
        },
    }
});

// tmf quotation related slice

const tmfQuoteInfoSlice = createSlice({
    name: "tmfQuote",
    initialState: initialTMFQuoteList,
    reducers: {
        setTmfQuoteInfo(state, action: PayloadAction<ParentQuoteList>) {
            state.quotesData = action.payload.quotesData;
        },
    }
});

const inReviewQuoteListSlice = createSlice({
    name: "inReviewQuoteList",
    initialState: initialInreviewQuoteList,
    reducers: {
        setInReviewQuoteList(state, action: PayloadAction<QuotationListResponseModel>) {
            state.quoteList = action.payload.quoteList;
        }
    }
});

//Quote List related slice
const quoteListSlice = createSlice({
    name: "quoteList",
    initialState: initialQuoteList,
    reducers: {
        setQuoteList(state, action: PayloadAction<QuotationListResponseModel>) {
            state.quoteList = action.payload.quoteList;
        }
    }
});

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        customerProfile: customerProfileSlice.reducer,
        customer:customerSlice.reducer,
        tmfQuote: tmfQuoteInfoSlice.reducer,
        quoteListSlice: quoteListSlice.reducer,
        inReviewQuoteListSlice: inReviewQuoteListSlice.reducer,
        metaData: metaDataSlice.reducer
    }
});

export const authActions = authSlice.actions;
export const tmfQuoteActions = tmfQuoteInfoSlice.actions;
export const quoteListActions = quoteListSlice.actions;
export const inReviewQuoteListActions = inReviewQuoteListSlice.actions;
export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector