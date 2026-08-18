export interface UserEditModel {
    name: string;
    userId: string;
    email?: string;
    status: string;
    roleNames?: string[];
    roleIds: string[];
    initialPassword?: string;
    customProperties: {
        propertyId: string;
        propertyName: string;
        valueId: string;
        valueName: string;
    }[];
    groups:{
        groupId: string;
        groupName: string;
        levelId: string;
        levelName: string;
    }[];
    clientId: string;
    tenantId: string;
}

export interface UserCreateModel{
    email: string;
    roleIds: string[];
    status: string;
    name: string;
    customProperties: {
        propertyId: string;
        propertyName: string;
        valueId: string;
        valueName: string;
    }[];
    groups:{
        groupId: string;
        groupName: string;
        levelId: string;
        levelName: string;
    }[];
    clientId: string;
    tenantId: string;
}