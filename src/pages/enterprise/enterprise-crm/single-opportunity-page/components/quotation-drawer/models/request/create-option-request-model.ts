export interface RelatedParty {
    name: string;
    role: string;
    id: string;
    referredType: string;
}
export interface CreateOptionRequestModel {
    name: string;
    description: string;
    externalId: string;
    note: string;
    state: string;
    relatedParty: RelatedParty[];
}