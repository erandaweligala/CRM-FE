export interface HierarchyGroupLevel {
    levelId: string;
    levelName: string;
    levelValue: string;
  }
  
  export interface UserHierarchyGroup {
    groupId: string;
    groupName: string;
    levels: HierarchyGroupLevel[];
  }
  