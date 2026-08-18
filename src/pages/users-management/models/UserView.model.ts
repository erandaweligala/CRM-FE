export interface GroupAssignment {
    groupId: string;
    groupName: string;
    levelId: string;
    levelName: string;
  }
  
  export interface CustomPropertyItem {
    propertyId: string | number;
    propertyName: string;
    valueId: string | number;
    valueName: string;
  }
  
  export interface UserViewModel {
    userId: string;
    name: string;
    email: string;
    status: string;
    lastLoginDateTime: string;
    mobileNumber: string;
    roleIds: string[];
    roleNames: string[];
    customPropertiesItemList: CustomPropertyItem[];
    groups: GroupAssignment[];
  }
  