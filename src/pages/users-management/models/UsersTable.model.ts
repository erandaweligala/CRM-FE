export interface UserTableModel {
    userId: string;
    name: string;
    email: string;
    status: string;
    // designation: 'active' | 'inactive' | 'pending';
  }

  export interface UsersQueryModel {
    userName?: string;
    roleId?: string;
    statusId?: string;
    offset: number;
    limit: number;
    sortOrder: "ASC" | "DESC";
    // designation?: 'active' | 'inactive' | 'pending';
  }