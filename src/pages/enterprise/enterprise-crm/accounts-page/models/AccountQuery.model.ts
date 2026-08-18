export interface AccountQueryModel {
    id?: string,
    name?:string,
    brn?:string,
    status?:string,
    accountType?:string,
    ownerId?:string,
    limit: number,
    industry?: string,
    offset: number,
    parentAccountId?:string
}

