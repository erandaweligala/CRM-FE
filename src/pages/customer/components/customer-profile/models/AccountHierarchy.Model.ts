export interface AccountHierarchyModel {
    accountId: string;
    accountType: string;
    accountName: string;
    children: AccountHierarchyModel[];
}
