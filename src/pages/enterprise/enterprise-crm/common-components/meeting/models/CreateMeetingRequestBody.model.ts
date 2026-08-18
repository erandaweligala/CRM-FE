import {ParticipantTypes} from "../components/create-edit-view-meeting/CreateEditViewMeeting";

interface CreateMeetingRequestBodyModel {
    id?: string;
    title: string;
    location: string;
    fromDateTime: string;
    toDateTime: string;
    host: string;
    referenceId: string;
    description: string;
    status: string;
    participants: {
        id: string;
        name: string;
        type: ParticipantTypes;
    }[];
}

export default CreateMeetingRequestBodyModel;