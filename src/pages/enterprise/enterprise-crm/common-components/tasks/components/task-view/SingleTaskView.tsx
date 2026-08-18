import {FC} from "react";
import {TaskModel} from "../../models/TaskModel";
import {Descriptions} from "antd";

interface SingleTaskViewProps {
    clickedItem: TaskModel;
}

const SingleTaskView: FC<SingleTaskViewProps> = ({clickedItem}) => {
    return(
        <>
            {clickedItem && (
                <Descriptions bordered className="custom-descriptions" column={1} style={{marginTop: "20px"}}>
                    <Descriptions.Item label="ID">{clickedItem.id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{clickedItem.subject}</Descriptions.Item>
                    <Descriptions.Item label="Description">{clickedItem.description}</Descriptions.Item>
                    <Descriptions.Item label="Task Owner">{clickedItem.ownerId}</Descriptions.Item>
                    <Descriptions.Item label="Status">{clickedItem.status}</Descriptions.Item>
                    <Descriptions.Item label="Date Assigned">{clickedItem.createdDateTime}</Descriptions.Item>
                    <Descriptions.Item label="Due Date">{clickedItem.dueDateTime}</Descriptions.Item>
                    <Descriptions.Item label="Priority">{clickedItem.priority}</Descriptions.Item>
                </Descriptions>
            )}
        </>
    )
}

export default SingleTaskView;