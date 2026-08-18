export interface ActionLogsModel {
    transactionId: string | null;
    dateAndTime: string;
    username: string | null;
    activity: string;
    subjectType: string | null;
    subjectValue: string | null;
    status: string;
    statusDescription: string | null;
    clientIp: string;
}

export interface ActionLogQueryParamsModel {
	offSet:number;
	itemsPerPage:number;
    fromDate?:string;
	toDate?:string;
	subjectTypeId?: string;
	subjectTypeValue?: string;
	subjectValue?: string;
	userId?: string;
	user?: string;
	activityId?:string;
	activityValue?:string;
	statusId?: string;
	status?: string;
	transactionId?: string;
	sortBy?:string; 
	sortOrder?:string;
  }

export interface SearchDropdownModel {
    name: string;
    id: string;
}