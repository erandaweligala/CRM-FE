import {FC} from "react";
import {Descriptions} from "antd";
import {CallModel} from "../../model/CallModel";


interface SingleCallViewProps {
    clickedItem: CallModel;
}

const SingleCallView: FC<SingleCallViewProps> = ({clickedItem}) => {

    return(
        <>
            {clickedItem && (
               <Descriptions bordered className="custom-descriptions" column={1} style={{marginTop: "20px"}}>
                    <Descriptions.Item label="ID">{clickedItem.id}</Descriptions.Item>
                    <Descriptions.Item label="Call Type">{clickedItem.callType}</Descriptions.Item>
                    <Descriptions.Item label="Call Medium">{clickedItem.callMedium}</Descriptions.Item>
                    <Descriptions.Item label="Status">{clickedItem.status}</Descriptions.Item>
                    <Descriptions.Item label="Start Date Time">{clickedItem.startDateTime}</Descriptions.Item>
                    <Descriptions.Item label="Owner">{clickedItem.ownerId}</Descriptions.Item>
                    <Descriptions.Item label="Subject">{clickedItem.subject}</Descriptions.Item>
                    <Descriptions.Item label="Purpose">{clickedItem.purpose}</Descriptions.Item>
                    <Descriptions.Item label="Agenda">{clickedItem.agenda}</Descriptions.Item>
                </Descriptions>
            )}
        </>
    )
}

export default SingleCallView;