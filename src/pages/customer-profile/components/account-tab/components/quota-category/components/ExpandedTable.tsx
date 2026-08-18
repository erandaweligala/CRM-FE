import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC } from "react";
import { InstanceModel } from "../../../../../models/AccountModel";
import { BSS_SquareButton as BssSquareButton} from "bss-component-library";

const innerTableColumns: ColumnsType<InstanceModel> = [
    {
        title: 'Bucket Instance ID',
        dataIndex: 'bucketInstanceId',
    },
    {
        title: 'Initial Amount',
        dataIndex: 'initialAmount',
    },
    {
        title: 'Used Amount',
        dataIndex: 'usedAmount',
    },
    {
        title: 'Remaining Amount',
        dataIndex: 'remainingAmount',
    },
    {
        title: 'Effective Time',
        dataIndex: 'effectiveTime',
    },
    {
        title: 'Expire Time',
        dataIndex: 'expireTime',
    },
    {
        title: 'Offering ID',
        dataIndex: 'offerId',
    },
    {
        title: 'Action',
        align: "center",
        render: () => (
            <span>
                <BssSquareButton
                    onClick={() => {}}
                    type="EDIT"
                    isButtonInsideTable={true}
                />
            </span>
        ),
    },
];
const ExpandedTable: FC<{ data: InstanceModel[] }> = ({ data }) => (
    <Table
      columns={innerTableColumns}
      dataSource={data}
      pagination={false}
      rowKey="bucketInstanceId"
    />
  );
  export default ExpandedTable;
  