import store from "../store/main-store";
import {AUTH_BYPASS_ENABLED} from "../constants/auth-bypass";

const getAllowedActions = (): number[] => {

    const allAllowedActions: number[] = []

    store.getState().auth.decodedToken?.permissions.components.forEach((singleComponent) => {
        allAllowedActions.push(...singleComponent.actions);
    });

    return allAllowedActions;
}


const getAllowedAttributes = (): number[] => {

    const allAllowedAttribute: number[] = []

    store.getState().auth.decodedToken?.permissions.components.forEach((singleComponent) => {
        allAllowedAttribute.push(...singleComponent.attributes);
    });

    return allAllowedAttribute;
}

export const hasPermissionToTheAction = (actionDetails: {actionId: number, isMainAction: boolean, mainActionId: number | null, componentId: number}): boolean => {

    // Auth bypass - no authorization check is performed
    if(AUTH_BYPASS_ENABLED) {
        return true
    }

    // For Development Usage
    if(actionDetails.actionId === 0) {
        return true
    }

    return getAllowedActions().some((singleActionId) => singleActionId === actionDetails.actionId);
}

export const hasPermissionToAtLeastOneAction = (actionDetailList: {actionId: number, isMainAction: boolean, mainActionId: number | null, componentId: number}[]): boolean => {
    return actionDetailList.some((singleAction) => {
        return hasPermissionToTheAction(singleAction);
    })
}

export const hasPermissionToTheAttribute = (attributeDetails: {attributeId: number, parentActionId: number}): boolean => {

    // Auth bypass - no authorization check is performed
    if(AUTH_BYPASS_ENABLED) {
        return true
    }

    // For Development Usage
    if(attributeDetails.attributeId === 0) {
        return true
    }

    return getAllowedAttributes().some((singleAttributeId) => singleAttributeId === attributeDetails.attributeId);
}

export const hasPermissionToTheMenu= (menuDetails: {menuId: number}): boolean => {

    // Auth bypass - every menu entry is visible
    if(AUTH_BYPASS_ENABLED) {
        return true
    }

    if(menuDetails.menuId === 0) {
        return true
    }

    return store.getState().auth.decodedToken!.permissions.menuids!.some((singleMenuId) =>singleMenuId === menuDetails.menuId)
}

