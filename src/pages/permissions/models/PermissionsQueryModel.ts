export interface PermissionsQueryModel {
    offset:number;
	limit:number;
    permissionName?: string;
    menuId?: string;
    componentId?: string;
    sortOrder: "ASC" | "DESC";
}

export interface CheckedValuesObject {
    checkedActions: any[];
    checkedAttributes: any[];
}
export interface PermissionByComponentIdAndMenuId {
    componentId?: string;
}