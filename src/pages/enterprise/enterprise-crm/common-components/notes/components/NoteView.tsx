import {FC} from "react";
import {Descriptions} from "antd";
import NotesListResponseBodyModel from "../models/NotesListResponseBody.model";

interface SingleCallViewProps {
    clickedItem: NotesListResponseBodyModel;
}

const SingleNoteView: FC<SingleCallViewProps> = ({clickedItem}) => {

    return(
        <>
            {clickedItem && (
                 <Descriptions bordered className="custom-descriptions" column={1} style={{marginTop: "20px"}}>
                    <Descriptions.Item label="ID">{clickedItem.id}</Descriptions.Item>
                    <Descriptions.Item label="Title">{clickedItem.title}</Descriptions.Item>
                    <Descriptions.Item label="Note">{clickedItem.note}</Descriptions.Item>
                    <Descriptions.Item label="Created By">{clickedItem.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Created Date & Time">{clickedItem.createdDateTime}</Descriptions.Item>
                </Descriptions>
            )}
        </>
    )
}

export default SingleNoteView;