export interface PermissionsEditModel {
    permissionId?:string,
    menuId: string,
    name: string,
    description: string,
    componentId: string,
    actions: string[],
    attributes: string[]
}