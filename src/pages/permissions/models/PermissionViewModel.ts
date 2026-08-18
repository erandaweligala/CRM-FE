export interface Attributes {
    attributeId: string;
    isSelected: boolean;
    attributeName: string;
}
export interface SubActions {
    isSelected: boolean;
    actionId: string;
    attributes: Attributes[];
    actionName: string;
}
export interface MainActions {
    isSelected: boolean;
    actionId: string;
    attributes: Attributes[];
    subActions: SubActions[]
    actionName: string;
  }



export interface PermissionViewModel {
    permissionId: string;
    description: string;
    permissionName: string;
    menuId: string;
		menuName: string;
		componentId: string;
		componentName: string;
    mainActions: MainActions[];
  }

  export interface PermissionByComponentIdModel {
    mainActions: MainActions[];
  }