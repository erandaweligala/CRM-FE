// use /api for all the API calls that route through the dynamic controller.

const API_ENDPOINTS = {

    GET_AD_LOGIN_URL: "/auth/azure-ad-auth/saml2-request",
    GET_ACCESS_TOKEN_FROM_TEMP_TOKEN: "/auth/user/login",
    GET_NEW_ACCESS_TOKEN_FROM_CURRENT_ACCESS_TOKEN: "/auth/user/new-access-token",
    LOGOUT: "/auth/user/logout",
    GET_TEMP_TOKEN: "/external-user/authenticate/create-temp-token",
    GET_ACCESS_TOKEN: "/external-user/authenticate/create-access-token",

    CUSTOMER_OVERVIEW: "/api/customer-overview",
    CUSTOMER_ACCOUNT_HIERARCHY: "/api/customer-account/get/",
    CONNECTION_OVERVIEW: "/api/connection-overview/get",
    CUSTOMER_PROFILE: "/api/customer-profile/main-profile/customer-profile",
    CONNECTION_ACCOUNT: "/api/customer-account/main-profile/account",
    CONNECTION_PRODUCTS_AND_SERVICES: "/api/product/get-product-details",
    CONNECTION_Subscriptions_AND_SERVICES: "/api/customer-account/get-subscription",
    ADD_PRODUCT: "/api/subscription",
    PRODUCT_SUSPEND: "/api/subscription/suspend",
    PRODUCT_RESUME: "/api/subscription/resume",
    CONNECTION_QUOTA: "/api/quota/main-profile/quota",
    CONNECTION_ORDERS: "/api/customer-profile/orders",
    CONNECTION_ORDERS_STATUS_FLOW: "/api/customer-profile/orders/order-status-flow",
    CONNECTION_ORDERS_STEPS: "/api/customer-profile/orders/order-steps",
    CUSTOMER_TIMELINE: "/api/interaction/timeline",
    UPDATE_CUSTOMER_CONTACT_DETAILS: "/api/customer-profile/contact-info",
    UPDATE_CUSTOMER_INFO: "/api/customer-profile/customer-info",
    UPDATE_ORGANIZATION_INFO: "/api/customer-profile/organization-info",
    UPDATE_Language_Info: "/api/customer-profile/language-info",
    UPDATE_Hierarchy_Info: "/api/customer-profile/hierarchy-info",
    UPDATE_RelatedParty_Info: "/api/customer-profile/relatedParty-info",
    UPDATE_TAX_EXEMPTIONS_INFO: "/api/customer-profile/tax-exemptions-info",
    REFERENCE_LINK: "/api/customer-profile/external-reference/",

    GET_SELF_ONBOARDING_CUSTOMER_LIST: "/api/self-onboarding/get-customer",
    GET_SINGLE_SELF_ONBOARDING_RECODE: "/api/self-onboarding/get-customer/get",
    REGISTER_SELF_ONBOARDING_RECODE: "/api/self-onboarding/accept-customer",
    REJECT_SELF_ONBOARDING_RECODE: "/api/self-onboarding/reject-customer",

    TROUBLE_TICKET: "/api/trouble-ticket/get-tickets",
    CREATE_TROUBLE_TICKET: "/api/trouble-ticket/create-ticket",
    EDIT_TROUBLE_TICKET: "/api/trouble-ticket/update-ticket",

    USERS: "/api/user-management/user",
    META_DATA_ROLES: "/api/user-management/roles/meta-data",
    META_DATA_STATUS: "/api/user-management/user/status/meta-data",
    SINGLE_USER: "/api/user-management/user",
    EDIT_USER: "/api/user-management/user",
    CREATE_USER: "/api/user-management/user",
    CHECK_VALID_EMAIL: "/api/user-management/user/check-valid-email",
    GET_CUSTOM_PROPERTIES: "/api/user-management/custom-properties",
    GET_USER_HIERARCHY_GROUP: "api/user-management/group-list",

    ROLES: "/api/user-management/roles",
    EDIT_ROLE: "/api/user-management/roles",
    CREATE_NEW_ROLE: "/api/user-management/roles",
    META_DATA_PERMISSIONS: "/api/user-management/permissions/meta-data",
    MENU_TO_COMPONENT: "/api/user-management/permissions/menu-to-component",
    SINGLE_ROLE: "/api/user-management/roles",

    PERMISSIONS: "/api/user-management/permissions",
    SINGLE_PERMISSION: "/api/user-management/permissions",
    PERMISSION_BY_COMPONENT: "/api/user-management/permissions/permissions-by-component",
    EDIT_PERMISSION: "/api/user-management/permissions",
    CREATE_PERMISSION: "/api/user-management/permissions",

    SINGLE_TROUBLE_TICKET: "/api/trouble-ticket/view",
    HOME: "/api/home/ticket-summary",
    TODO_CREATE: "/api/home/to-do/create",
    TODO: "/api/home/to-do",
    TODO_EDIT: "/api/home/to-do/patch",
    TODO_DELETE: "/api/home/to-do/remove",
    // Dashboard SuperSet Token API
    Dashboard_SUPERSET_TOKEN_API: "/api/dashboard/guest-token",
    Dashboard_ID_API: "/api/user-management/dashboard-management",

    ACTION_LOGS: "/api/audit/get-action-log",
    SEARCH_TYPES: "/api/audit/get-search-type-list",
    STATUS_CODES: "/api/audit/get-status-code-list",
    USER_NAMES: "/api/audit/get-user-name-list",
    ACTIVITIES: "/api/audit/get-activity-list",

    ACCOUNT_DATA: "/api/account/search",
    ACCOUNT_PARENT_LIST: '/api/account/meta-data',
    CONTACT_LIST_META_DATA: '/api/contact/meta-data',
    CONTACT_DATA: "/api/contact/search",
    CONTACT_META_DATA: "/api/contact/meta-data",
    GET_ACCOUNT_BY_ID: "/api/account/get",
    GET_CONTACT_BY_ID: "/api/contact/get",
    GET_ACCOUNT_FORM_LIST: "/api/account/e-form",
    GET_CONTACT_FORM_LIST: "/api/contact/e-form",
    GET_FORM_BY_ID: "/api/e-form",
    GET_DROPDOWN_VALUES: "/api/e-form/meta-data",
    CREATE_ACCOUNT: "/api/account",
    UPDATE_ACCOUNT: "/api/account/patch",
    CREATE_CONTACT: "/api/contact",
    UPDATE_CONTACT: "/api/contact/patch",

    PARTY_STATUS: "/api/e-form/common-meta-data/eform_party_status",
    INDUSTRY_LIST: "/api/e-form/common-meta-data/eform_industry",
    ACCOUNT_TYPE_LIST: "/api/e-form/common-meta-data/eform_account_type",
    LEAD_SOURCE: "/api/e-form/common-meta-data/eform_lead_source",
    LEAD_STATUS_DATA: "/api/e-form/common-meta-data/eform_lead_status",
    DEAL_STAGES: "/api/e-form/common-meta-data/eform_deal_status",
    UPDATE_DEAL_STAGE: "/api/deal/stage-transition/",

    LEADS_DATA: "/api/lead/search",
    LEADS_META_DATA: "/api/lead/meta-data",
    GET_LEADS_FORM_LIST: "/api/lead/e-form",
    GET_LEAD_BY_ID: "/api/lead/get",
    GET_LEAD_OPPORTUNITY_INFO_BY_ID: "/api/lead/deal",
    CREATE_LEAD: "/api/lead",
    UPDATE_LEAD: "/api/lead/patch",
    CONVERT_LEAD: "/api/lead/convert",

    DEALS_DATA: "/api/deal/search",
    DEALS_KANBAN_DATA: "/api/deal/kanban/search",
    DEALS_META_DATA: "/api/deal/meta-data",
    GET_DEALS_FORM_LIST: "/api/deal/e-form",
    GET_DEAL_BY_ID: "/api/deal/get",
    CREATE_DEAL: "/api/deal",
    UPDATE_DEAL: "/api/deal/patch",

    // Account - Task
    TASK_VIEW_ACCOUNT: "/api/account/task/search",
    TASK_CREATE_ACCOUNT: "/api/account/task",
    TASK_UPDATE_ACCOUNT: "/api/account/task/patch",
    TASK_DELETE_ACCOUNT: "/api/account/task/remove",

    // Contact - Task
    TASK_VIEW_CONTACT: "/api/contact/task/search",
    TASK_CREATE_CONTACT: "/api/contact/task",
    TASK_UPDATE_CONTACT: "/api/contact/task/patch",
    TASK_DELETE_CONTACT: "/api/contact/task/remove",

    // Lead - Task
    TASK_VIEW_LEAD: "/api/lead/task/search",
    TASK_CREATE_LEAD: "/api/lead/task",
    TASK_UPDATE_LEAD: "/api/lead/task/patch",
    TASK_DELETE_LEAD: "/api/lead/task/remove",

    // Deal - Task
    TASK_VIEW_DEAL: "/api/deal/task/search",
    TASK_CREATE_DEAL: "/api/deal/task",
    TASK_UPDATE_DEAL: "/api/deal/task/patch",
    TASK_DELETE_DEAL: "/api/deal/task/remove",

    // Account
    CALL_VIEW_ACCOUNT: "/api/account/call/search",
    CALL_CREATE_ACCOUNT: "/api/account/call",
    CALL_DELETE_ACCOUNT: "/api/account/call/remove",
    CALL_UPDATE_ACCOUNT: "/api/account/call/patch",

    // Contact
    CALL_VIEW_CONTACT: "/api/contact/call/search",
    CALL_CREATE_CONTACT: "/api/contact/call",
    CALL_DELETE_CONTACT: "/api/contact/call/remove",
    CALL_UPDATE_CONTACT: "/api/contact/call/patch",

    // Lead
    CALL_VIEW_LEAD: "/api/lead/call/search",
    CALL_CREATE_LEAD: "/api/lead/call",
    CALL_DELETE_LEAD: "/api/lead/call/remove",
    CALL_UPDATE_LEAD: "/api/lead/call/patch",

    // Deal
    CALL_VIEW_DEAL: "/api/deal/call/search",
    CALL_CREATE_DEAL: "/api/deal/call",
    CALL_DELETE_DEAL: "/api/deal/call/remove",
    CALL_UPDATE_DEAL: "/api/deal/call/patch",


    // Account - Meeting
    MEETING_LIST_ACCOUNT: "/api/account/meeting/search",
    MEETING_CREATE_ACCOUNT: "/api/account/meeting",
    MEETING_UPDATE_ACCOUNT: "/api/account/meeting/patch",
    MEETING_DELETE_ACCOUNT: "/api/account/meeting/remove",

    // Contact - Meeting
    MEETING_LIST_CONTACT: "/api/contact/meeting/search",
    MEETING_CREATE_CONTACT: "/api/contact/meeting",
    MEETING_UPDATE_CONTACT: "/api/contact/meeting/patch",
    MEETING_DELETE_CONTACT: "/api/contact/meeting/remove",

    // Lead - Meeting
    MEETING_LIST_LEAD: "/api/lead/meeting/search",
    MEETING_CREATE_LEAD: "/api/lead/meeting",
    MEETING_UPDATE_LEAD: "/api/lead/meeting/patch",
    MEETING_DELETE_LEAD: "/api/lead/meeting/remove",

    // Deal - Meeting
    MEETING_LIST_DEAL: "/api/deal/meeting/search",
    MEETING_CREATE_DEAL: "/api/deal/meeting",
    MEETING_UPDATE_DEAL: "/api/deal/meeting/patch",
    MEETING_DELETE_DEAL: "/api/deal/meeting/remove",


    // Account - Attachment
    ATTACHMENT_LIST_ACCOUNT: "/api/account/attachment/search",
    ATTACHMENT_CREATE_ACCOUNT: "/api/account/attachment/upload",
    ATTACHMENT_DELETE_ACCOUNT: "/api/account/attachment/remove",
    ATTACHMENT_DOWNLOAD_ACCOUNT: "/api/account/attachment",

    // Contact - Attachment
    ATTACHMENT_LIST_CONTACT: "/api/contact/attachment/search",
    ATTACHMENT_CREATE_CONTACT: "/api/contact/attachment/upload",
    ATTACHMENT_DELETE_CONTACT: "/api/contact/attachment/remove",
    ATTACHMENT_DOWNLOAD_CONTACT: "/api/contact/attachment",

    // Lead - Attachment
    ATTACHMENT_LIST_LEAD: "/api/lead/attachment/search",
    ATTACHMENT_CREATE_LEAD: "/api/lead/attachment/upload",
    ATTACHMENT_DELETE_LEAD: "/api/lead/attachment/remove",
    ATTACHMENT_DOWNLOAD_LEAD: "/api/lead/attachment",

    // Deal - Attachment
    ATTACHMENT_LIST_DEAL: "/api/deal/attachment/search",
    ATTACHMENT_CREATE_DEAL: "/api/deal/attachment/upload",
    ATTACHMENT_DELETE_DEAL: "/api/deal/attachment/remove",
    ATTACHMENT_DOWNLOAD_DEAL: "/api/deal/attachment",

    // BRCopy upload
    ATTACHMENT_BR_COPY_UPLOAD: "/api/account/attachment/upload/brcopy",

    // Account - Notes
    NOTES_LIST_ACCOUNT: "/api/account/note/get",
    NOTES_DELETE_ACCOUNT: "/api/account/note/remove",
    NOTES_CREATE_ACCOUNT: "/api/account/note",
    NOTES_UPDATE_ACCOUNT: "/api/account/note/patch",
    // Contact - Notes
    NOTES_LIST_CONTACT: "/api/contact/note/get",
    NOTES_DELETE_CONTACT: "/api/contact/note/remove",
    NOTES_CREATE_CONTACT: "/api/contact/note",
    NOTES_UPDATE_CONTACT: "/api/contact/note/patch",
    // Lead - Notes
    NOTES_LIST_LEAD: "/api/lead/note/get",
    NOTES_DELETE_LEAD: "/api/lead/note/remove",
    NOTES_CREATE_LEAD: "/api/lead/note",
    NOTES_UPDATE_LEAD: "/api/lead/note/patch",
    // Deal - Notes
    NOTES_LIST_DEAL: "/api/deal/note/get",
    NOTES_DELETE_DEAL: "/api/deal/note/remove",
    NOTES_CREATE_DEAL: "/api/deal/note",
    NOTES_UPDATE_DEAL: "/api/deal/note/patch",


    // Account - E-Mail
    EMAIL_VIEW_ACCOUNT: "/api/account/email/search",
    EMAIL_SINGLE_ACCOUNT: "/api/account/email/get",
    EMAIL_CREATE_ACCOUNT: "/api/account/email",
    EMAIL_UPDATE_ACCOUNT: "/api/account/email/patch",

    // Contract - E-Mail
    EMAIL_VIEW_CONTACT: "/api/contact/email/search",
    EMAIL_SINGLE_CONTACT: "/api/contact/email/get",
    EMAIL_CREATE_CONTACT: "/api/contact/email",
    EMAIL_UPDATE_CONTACT: "/api/contact/email/patch",

    // Lead - E-Mail
    EMAIL_VIEW_LEAD: "/api/lead/email/search",
    EMAIL_SINGLE_LEAD: "/api/lead/email/get",
    EMAIL_CREATE_LEAD: "/api/lead/email",
    EMAIL_UPDATE_LEAD: "/api/lead/email/patch",

    // Deal - E-Mail
    EMAIL_VIEW_DEAL: "/api/deal/email/search",
    EMAIL_SINGLE_DEAL: "/api/deal/email/get",
    EMAIL_CREATE_DEAL: "/api/deal/email",
    EMAIL_UPDATE_DEAL: "/api/deal/email/update",


    EMAIL_NAME_DATA: "/api/email/recipient",
    MICRO_FRONTEND_COMPONENT_LIST: "/api/micro-frontend/components/get",
    MICRO_FRONTEND_COMPONENT_CREATE: "/api/micro-frontend/components",


    PRODUCT_DETAILS_LIST_DEAL: "/api/product-offering/get-product-offering-list-by-status/Active",
    PRODUCT_DETAILS_CREATE_DEAL: "/api/deal/add-products",
    PRODUCT_DETAILS_DELETE_DEAL: "/api/deal/product/delete-products",
    PRODUCT_DETAILS_LIST_DEAL_SEARCH: "/api/deal/product-details/search",

    //agreements
    GET_ACCOUNT_AGREEMENTS: "/api/quote/organization/getQuoteList",
    REINITIATE_AGREEMENT: "/api/quote/reNewQuote",
    //quote
    CREATE_QUOTE: "/api/quote/createQuote",
    GET_QUOTE_LIST: "/api/quote/getQuoteList",
    VIEW_PRICE_BOOK_LIST: "/cpq/priceBook/getPriceBookList",
    QUOTES_DETAILS_LIST_DEAL: "/api/quote/opportunity/getQuoteList",
    REINITIATE_QUOTE: "/api/quote/reInitiateQuote",
    GET_FULL_QUOTE_DETAILS_BY_PARENT_QUOTE_ID: "/api/quote/getQuoteInfoTmfList",
    CONVERT_DEAL_TO_SALES_ORDER: "/api/sales-order/create-from-opportunity",
    GET_CONTACT_LIST_BY_ACCOUNT_ID: "/api/account/contact",
    ADD_ACCOUNT_TO_GIVEN_CONTACT: "/api/contact/account/add",
    REMOVE_ACCOUNT_FROM_CONTACT: "/api/contact/account/delete",

    //quoteConfiguration
    CREATE_QUOTE_CONFIGURATION:"api/quote/terms-and-conditions",
    UPDATE_QUOTE_CONFIGURATION:"api/quote/terms-and-condition",
    DELETE_QUOTE_CONFIGURATION:"api/quote/termsAnd-conditions",
    GET_ALL_QUOTE_CONFIGURATION:"api/quote/terms-and-condition/getAll",
    GET_BY_ID_QUOTE_CONFIGURATION:"api/quote/terms-and-condition/get-by-id",

    //serviceTypes
    GET_ALL_SERVICE_TYPES: "/api/service-types/getAll",
    GET_SERVICE_TYPE_BY_ID: "/api/service-types/getById",
    CREATE_SERVICE_TYPE: "/api/service-types/create",
    UPDATE_SERVICE_TYPE: "/api/service-types/update",
    DELETE_SERVICE_TYPE: "/api/service-types/delete",

    GET_SERVICE_TYPE_LIST: "/api/productServiceType/getAll",

    // Notification
    GET_ALL_NOTIFICATION: "/api/notification",
    NEW_NOTIFICATION: "/api/notification/new",
    
    // Update Status
    UPDATE_QUOTE:"/api/quote/updateQuote",
    CHANGE_QUOTE_STATUS: "/api/quote/changeStatus",

    CREATE_WORK_ORDER:"api/account/workflow/workOrder",

    //Agreement Service Types
    GET_SERVICE_TYPES:"/api/service-types/getAllServiceTypes",

};

export default API_ENDPOINTS;