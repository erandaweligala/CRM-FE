interface MeetingListQueryModel {
    id?: string;
    title?: string;
    location?: string;
    fromDateTime?: string;
    toDateTime?: string;
    host?: string;
    status?: string;
    referenceId?: string; // Account ID or Contact ID or Deal ID etc
    limit: number,
    offset: number
}

export default MeetingListQueryModel;