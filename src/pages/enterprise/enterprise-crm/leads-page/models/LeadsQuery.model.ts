export interface LeadsQueryModel {
    id?:string ,
    name?:string,
    ownerId?:string ,
    creationDate?:string ,
    status?:string ,
    leadSource?:string ,
    accountName?:string,
    contactName?:string,
    limit: number,
    offset: number
}