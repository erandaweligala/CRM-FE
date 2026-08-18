import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC } from "react";
import { CreditInstanceModel } from "../../../../../models/AccountModel";

const innerTableColumns: ColumnsType<CreditInstanceModel> = [
    {
        title: 'Credit Instance ID',
        dataIndex: 'creditInstanceId',
    },
    {
        title: 'Limit Class',
        dataIndex: 'limitClass',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
    },
    {
        title: 'Effective Time',
        dataIndex: 'effectiveTime',
    },
    {
        title: 'Expire Time',
        dataIndex: 'expireTime',
    }
];
const AccountCreditExpandedTable: FC<{ data: CreditInstanceModel[] }> = ({ data }) => (
    <Table
      columns={innerTableColumns}
      dataSource={data}
      pagination={false}
      rowKey="creditInstanceId"
    />
  );
  export default AccountCreditExpandedTable;
  