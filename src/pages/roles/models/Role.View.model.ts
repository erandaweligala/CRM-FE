export interface RoleViewPermissionsModel {
    menuId: string;
    menuName: string;
    componentId: string;
    componentName: string;
    permissionId?: string;
    permissionName?: string;
    permissionDescription?: string;
    description?: string;
  }


export interface RoleViewModel {
    roleId: string;
    roleName: string;
    description: string;
    permissions: RoleViewPermissionsModel[];
  }