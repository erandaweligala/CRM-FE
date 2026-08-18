import store from "../store/main-store";

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

    // For Development Usage
    if(attributeDetails.attributeId === 0) {
        return true
    }

    return getAllowedAttributes().some((singleAttributeId) => singleAttributeId === attributeDetails.attributeId);
}

export const hasPermissionToTheMenu= (menuDetails: {menuId: number}): boolean => {

    if(menuDetails.menuId === 0) {
        return true
    }

    return store.getState().auth.decodedToken!.permissions.menuids!.some((singleMenuId) =>singleMenuId === menuDetails.menuId)
}

