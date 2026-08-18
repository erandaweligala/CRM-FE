import {FC} from "react";
import {OutstandingDetailModel} from "../../../../models/AccountModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";

interface OutstandingDetailsProps {
    data: OutstandingDetailModel[]
}

const OutstandingDetails: FC<OutstandingDetailsProps> = ({data}) => {

    const tableColumns: ColumnsType<OutstandingDetailModel> = [
        {
            title: 'Bill Cycle',
            dataIndex: 'billCycle',
        },
        {
            title: 'Bill Cycle Start Time',
            dataIndex: 'billCycleStartTime',
        },
        {
            title: 'Bill Cycle End TIme',
            dataIndex: 'billCycleEndTime',
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
        },
        {
            title: 'Outstanding Amount',
            dataIndex: 'outstandingAmount',
        }
    ];

    return (
        <Table
            columns={tableColumns}
            dataSource={data}
            pagination={false}
            rowKey="billCycle"
        />
    )
}

export default OutstandingDetails;