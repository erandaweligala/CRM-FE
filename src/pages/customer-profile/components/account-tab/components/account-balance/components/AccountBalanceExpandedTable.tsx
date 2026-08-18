import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC } from "react";
import { BalanceInstanceModel } from "../../../../../models/AccountModel";

const innerTableColumns: ColumnsType<BalanceInstanceModel> = [
    {
        title: 'Instance ID',
        dataIndex: 'instanceId',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
    },
    {
        title: 'Initial Amount',
        dataIndex: 'initialAmount',
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
        title: 'Offering Name',
        dataIndex: 'offeringName',
    }
];const AccountBalanceExpandedTable: FC<{ data: BalanceInstanceModel[] }> = ({ data }) => (
    <Table
      columns={innerTableColumns}
      dataSource={data}
      pagination={false}
      rowKey="creditInstanceId"
    />
  );
    export default AccountBalanceExpandedTable;
  