export interface RoleTableQueryModel {
    offset:number;
	limit:number;
    roleId?: string;
    roleName?: string;
    searchBy?: string;
    sortOrder: "ASC" | "DESC";
}