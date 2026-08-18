import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import {lazy, Suspense, useEffect, useState} from "react";
import PrivateRoute from "./private-route";
import INTERNAL_ROUTES from "../constants/internal-routes";

import Login from "../pages/login/Login";
import NotFount from "../pages/not-fount/NotFount";
import LoginError from "../pages/login-error/LoginError";
import SessionExpire from "../pages/session-expire/SessionExpire";

import LazyLoadingSkeleton from "../components/lazy-loading-skeleton/LazyLoadingSkeleton";
import Accounts from "../pages/enterprise/enterprise-crm/accounts-page/Accounts.tsx";
import Contacts from "../pages/enterprise/enterprise-crm/contacts-page/Contacts.tsx";
import SingleOpportunityPage from "../pages/enterprise/enterprise-crm/single-opportunity-page/SingleOpportunityPage.tsx";
import Leads from "../pages/enterprise/enterprise-crm/leads-page/Leads.tsx";
import Deals from "../pages/enterprise/enterprise-crm/opportunity-page/Deals.tsx";
import ExternalSystem from "../components/external-system/ExternalSystem";
import type {Router as RemixRouter} from "@remix-run/router/dist/router";
import Extensions from "../pages/extension/Extensions";
import {useAppSelector} from "../store/main-store.ts";
import AuthCodeHanding from "../pages/auth-code-handling/AuthCodeHanding.tsx";
import axiosInstance, {setInterceptorsForAxiosInstance} from "../services/axios.service.ts";
import CpqIFrame from "../pages/external-systems/EmbeddedAppIframe.tsx";
import SingleAccountPage
    from "../pages/enterprise/enterprise-crm/single-account-page/SingleAccountPage.tsx";
import SingleContactPage
    from "../pages/enterprise/enterprise-crm/single-contact-page/SingleContactPage.tsx";
import SingleLeadPage from "../pages/enterprise/enterprise-crm/single-lead-page/SingleLeadPage.tsx";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary.tsx";
import Configuration from "../pages/Configurations/Configuration.tsx";
import Settings from "../pages/Configurations/components/Settings.tsx";
import axios, { AxiosInstance } from "axios";

const Home = lazy(() => import("../pages/home/Home"));
const Users = lazy(() => import("../pages/users-management/Users"));
const Roles = lazy(() => import("../pages/roles/Roles"));
const Permissions = lazy(() => import("../pages/permissions/Permissions"));
const CustomerProfile = lazy(() => import("../pages/customer-profile/CustomerProfile"));
const Customer = lazy(() => import("../pages/customer/Customer"));
const ActionLogs = lazy(() => import("../pages/action-logs/ActionLogs"));
const ProductCatalog = lazy(() => import("../pages/external-systems/EmbeddedAppIframe.tsx"));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const HomeX = lazy(() => import('cpqRemoteApp/HomeX'));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ViewFullQuotationInfo = lazy(() => import('cpqRemoteApp/ViewFullQuotationInfo'));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ApprovalWorkflow = lazy(() => import('workflowRemoteApp/ApprovalWorkflow'));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ApprovalRequestCreateForm = lazy(() => import('workflowRemoteApp/ApprovalRequestCreateForm'));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ApprovalRequestManagement = lazy(() => import('workflowRemoteApp/ApprovalRequestManagement'));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CaseType = lazy(() => import('caseManagementRemoteApp/CaseType'));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CaseRequestManagement = lazy(() => import('caseManagementRemoteApp/CaseRequestManagement'));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const TroubleTickets = lazy(() => import('caseManagementRemoteApp/TroubleTickets'));

const QuickComponent = () => {

    const quoteInfo = {
        "id": "65b66dd0c43872130394c897",
        "status": "inReview",
        "validFor": {},
        "relatedParty": []
    }

    const createAxiosInstanceWithBaseURL = (): AxiosInstance => {
        const newAxiosInstance = axios.create({
            // baseURL: "http://localhost:3004",
            baseURL: "http://192.168.0.108:30509",
            //baseURL: "http://localhost:4000",
            timeout: 10000,
        });
        setInterceptorsForAxiosInstance(newAxiosInstance);
        return newAxiosInstance;
    };

    return (
        <ViewFullQuotationInfo
            quoteInfo={quoteInfo}
            onAddTabClickFromPdfViewer={() => {
            }}
            onClickCancelButton={() => {
            }}
            viewOrEdit="EDIT"
            axiosInstance={createAxiosInstanceWithBaseURL()}
        />
    )

}

const ROUTES: RouteObject[] = [
    {
        path: INTERNAL_ROUTES.LOGIN_PAGE,
        element: <ErrorBoundary><Login/></ErrorBoundary>,
    },
    {
        path: INTERNAL_ROUTES.AUTH_CODE_RE_DIRECTION_PAGE,
        element: <ErrorBoundary><AuthCodeHanding/></ErrorBoundary>,
    },
    // {
    //    path: INTERNAL_ROUTES.GET_TEMP_TOKEN_PAGE_SUCCESS,
    //    element: <LoginSuccess/>,
    // },
    {
        path: INTERNAL_ROUTES.GET_TEMP_TOKEN_PAGE_ERROR,
        element: <LoginError/>,
    },
    {
        path: INTERNAL_ROUTES.SESSION_EXPIRE_PAGE,
        element: <SessionExpire/>,
    },
    {
        path: "",
        element: <PrivateRoute/>,
        children: [
            {
                path: INTERNAL_ROUTES.HOME_PAGE,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <Home />
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CUSTOMER_PROFILE,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <CustomerProfile/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CUSTOMER,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <Customer/>
                        </ErrorBoundary>
                    </Suspense>
                )

            },
            {
                path: INTERNAL_ROUTES.ACTION_LOGS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ActionLogs/>
                        </ErrorBoundary>
                    </Suspense>
                ),
            },
            {
                path: INTERNAL_ROUTES.USERS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Users/>
                        </ErrorBoundary>
                    </Suspense>
                ),
            },
            {
                path: INTERNAL_ROUTES.ROLES,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Roles/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.PERMISSIONS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Permissions/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.ACCOUNTS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>                            
                        <Accounts/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.SINGLE_LEAD_PAGE,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <SingleLeadPage/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.SINGLE_CONTACT_PAGE,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <SingleContactPage/>
                        </ErrorBoundary>
                       
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.SINGLE_ACCOUNT_PAGE,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <SingleAccountPage/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.COMPONENTS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <SingleOpportunityPage/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CONTACTS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Contacts/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.LEADS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Leads/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.OPPORTUNITIES,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Deals/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CREATE_PRODUCT,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ProductCatalog id="epc-iframe" title="Product Catalog" type="epc" path="create-product"/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.PRODUCT_CONFIGURATION,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ProductCatalog id="epc-iframe" title="Product Catalog" type="epc" path="product-configuration"/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.PRODUCT_FEDERATION_PROCESS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ProductCatalog id="epc-iframe" title="Product Catalog" type="epc" path="federation-process"/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.PRODUCT_FEDERATION_WORKFLOW,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ProductCatalog id="epc-iframe" title="Product Catalog" type="epc" path="federation-workflow"/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.PRODUCT_SERVICE_CATALOG,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ProductCatalog id="epc-iframe" title="Product Catalog" type="epc" path="product-service-catalog"/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.PRODUCT_RESOURCE_CATALOG,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <ProductCatalog id="epc-iframe" title="Product Catalog" type="epc" path="resource-catalog"/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CPQ_IFRAME,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <CpqIFrame id="cpq-iframe" title="CPQ" type="cpq" />
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.EXTENSIONS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Extensions/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CONFIGURATIONS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Configuration/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },      
            {
                path: INTERNAL_ROUTES.SETTINGS_ACTION_LOGS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Configuration/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.SETTINGS,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                        <Settings/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CPQ_HOME,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <QuickComponent/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.APPROVAL_WORKFLOW,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <ApprovalWorkflow axiosInstance={axiosInstance}/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CREATE_APPROVAL_REQUEST,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <ApprovalRequestCreateForm axiosInstance={axiosInstance}/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.APPROVAL_REQUEST_MANAGEMENT,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <ApprovalRequestManagement axiosInstance={axiosInstance}/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CASE_TYPE,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <CaseType axiosInstance={axiosInstance}/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
            {
                path: INTERNAL_ROUTES.CASE_REQUEST_MANAGEMENT,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <CaseRequestManagement axiosInstance={axiosInstance}/>
                        </ErrorBoundary>
                    </Suspense>
                )
            },
              {
                path: INTERNAL_ROUTES.TROUBLE_TICKET,
                element: (
                    <Suspense fallback={<LazyLoadingSkeleton/>}>
                        <ErrorBoundary>
                            <TroubleTickets axiosInstance={axiosInstance}/>
                        </ErrorBoundary>
                    </Suspense>
                )
            }
        ]
    },
    {
        path: "*",
        element: <NotFount/>,
    },
];


const MainRoutes = () => {

    const [finalRoutes, setFinalRoutes] = useState<RemixRouter>();
    const microFrontends = useAppSelector(state => state.metaData.microFrontendComponentList);

    useEffect(() => {
        loadDynamicRoutes();
    }, [microFrontends]);

    const loadDynamicRoutes = async () => {

        const mfRoutes: RouteObject[] = microFrontends.map((singleComponent) => {
            return {
                path: INTERNAL_ROUTES.DYNAMIC_EXTENSION + `/${singleComponent.componentName}`,
                element: <ErrorBoundary>
                    <ExternalSystem
                        componentName={singleComponent.componentName}
                        displayName={singleComponent.displayName}
                    />
                </ErrorBoundary>
            }
        });

        ROUTES[4].children?.push(...mfRoutes);

        const FINAL_ROUTES = createBrowserRouter(ROUTES);

        setFinalRoutes(FINAL_ROUTES);

    }

    if (finalRoutes) {
        return (
            <RouterProvider router={finalRoutes}/>
        )
    } else {
        return (
            <div>Router Loading...</div>
        )
    }

}

export default MainRoutes;