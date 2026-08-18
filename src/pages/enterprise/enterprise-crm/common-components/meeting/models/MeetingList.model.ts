import {ParticipantTypes} from "../components/create-edit-view-meeting/CreateEditViewMeeting";

interface MeetingListModel {
    id: string;
    title: string;
    location: string;
    isAllDay: boolean;
    fromDateTime: string;
    toDateTime: string;
    host: string;
    isRepeat: boolean;
    repeatType: string;
    referenceType: string;
    referenceId: string;
    referenceName: string;
    description: string;
    status: string;
    participants: {
        id: string;
        name: string;
        type: ParticipantTypes;
    }[];
}

export default MeetingListModel;