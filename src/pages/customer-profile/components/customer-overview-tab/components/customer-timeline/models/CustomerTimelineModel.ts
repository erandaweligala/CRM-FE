export interface CustomerTimelineModel {
    id:string;
    interactionDate:string;
    interactionType:string;
    // interactionTypes?:string[];
}

export interface CustomerTimelineRequestModel {
    fromDate:string;
    toDate:string;
    searchType:string;
    searchValue:string;
}

export interface TimelineDisplayModel{
    id:string;
    date:string;
    interactionTypes?:CustomerTimelineModel[]
  }