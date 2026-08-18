const ACTION_PERMISSION = {

    // Customer Profile
    DISPLAY_CUSTOMER_OVERVIEW: {actionId: 2, isMainAction: true, mainActionId: null, componentId: 2},
    DISPLAY_CONNECTION_OVERVIEW: {actionId: 7, isMainAction: true, mainActionId: null, componentId: 7},
    DISPLAY_CUSTOMER_PROFILE: {actionId: 3, isMainAction: true, mainActionId: null, componentId: 3},
    DISPLAY_ACCOUNT: {actionId: 4, isMainAction: true, mainActionId: null, componentId: 4},
    DISPLAY_PRODUCT: {actionId: 5, isMainAction: true, mainActionId: null, componentId: 5},
    DISPLAY_QUOTA: {actionId: 6, isMainAction: true, mainActionId: null, componentId: 6},

    // AUDIT LOG
    DISPLAY_AUDIT_LOG: {actionId: 45, isMainAction: true, mainActionId: null, componentId: 11},

    // Trouble Ticket
    DISPLAY_TROUBLE_TICKET_LIST: {actionId: 0, isMainAction: true, mainActionId: null, componentId: 12},

    // Self Onboarding
    DISPLAY_SELF_ONBOARDING_RECODE_LIST: {actionId: 47, isMainAction: true, mainActionId: null, componentId: 13},
    DISPLAY_SINGLE_SELF_ONBOARDING_RECODE: {actionId: 48, isMainAction: false, mainActionId: 47, componentId: 13},
    SELF_ONBOARDING_APPROVAL: {actionId: 49, isMainAction: false, mainActionId: 47, componentId: 13},
    SELF_ONBOARDING_REFECTION: {actionId: 50, isMainAction: false, mainActionId: 47, componentId: 13},

    // **** New IDs ***** //

    // HOME Page
    DISPLAY_HOME_PAGE: {actionId: 1, isMainAction: true, mainActionId: null, componentId: 1},

    // Users
    DISPLAY_USERS_LIST: {actionId: 2, isMainAction: true, mainActionId: null, componentId: 2},
    DISPLAY_MORE_USER_DETAILS: {actionId: 4, isMainAction: false, mainActionId: 2, componentId: 2},
    DISPLAY_EDIT_USER: {actionId: 3, isMainAction: false, mainActionId: 2, componentId: 2},
    DISPLAY_CREATE_USER: {actionId: 5, isMainAction: false, mainActionId: 2, componentId: 2},

    // Roles
    DISPLAY_ROLE_LIST: {actionId: 6, isMainAction: true, mainActionId: null, componentId: 3},
    DISPLAY_FULL_ROLE_DETAILS: {actionId: 8, isMainAction: false, mainActionId: 6, componentId: 3},
    DISPLAY_EDIT_ROLE: {actionId: 7, isMainAction: false, mainActionId: 6, componentId: 3},
    DISPLAY_CREATE_ROLE: {actionId: 9, isMainAction: false, mainActionId: 6, componentId: 3},

    // PERMISSIONS
    DISPLAY_PERMISSION_LIST: {actionId: 10, isMainAction: true, mainActionId: null, componentId: 4},
    DISPLAY_FULL_PERMISSION_DETAILS: {actionId: 12, isMainAction: false, mainActionId: 10, componentId: 4},
    DISPLAY_EDIT_PERMISSION: {actionId: 11, isMainAction: false, mainActionId: 10, componentId: 4},
    DISPLAY_CREATE_PERMISSION: {actionId: 13, isMainAction: false, mainActionId: 10, componentId: 4},

    // Edit Attachment
    DISPLAY_EDIT_ATTACHMENT_ACCOUNT: {actionId: 69, isMainAction: false, mainActionId: 19, componentId: 7},
    DISPLAY_EDIT_ATTACHMENT_CONTACT: {actionId: 72, isMainAction: false, mainActionId: 29, componentId: 10},
    DISPLAY_EDIT_ATTACHMENT_LEAD: {actionId: 75, isMainAction: false, mainActionId: 39, componentId: 13},
    DISPLAY_EDIT_ATTACHMENT_OPPORTUNITY: {actionId: 78, isMainAction: false, mainActionId: 49, componentId: 16},

}

export default ACTION_PERMISSION;





