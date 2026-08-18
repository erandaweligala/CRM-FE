import {FC} from "react";
import {BalanceDetailModel} from "../../../../models/AccountModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import AccountBalanceExpandedTable from "./components/AccountBalanceExpandedTable";

interface AccountBalanceProps {
    data: BalanceDetailModel[]
}

const AccountBalance: FC<AccountBalanceProps> = ({data}) => {

    const outerTableColumns: ColumnsType<BalanceDetailModel> = [
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
        },
        {
            title: 'Reserve Amount',
            dataIndex: 'reservedAmount',
        }
    ];
    const renderExpandedRow = (record: BalanceDetailModel) => {
        return <AccountBalanceExpandedTable data={record.instances} />;
    };
    return (
        <Table
            columns={outerTableColumns}
            dataSource={data}
            expandable={{
                expandedRowRender: renderExpandedRow,
                rowExpandable: (row) => row.instances && row.instances.length > 0,
            }}
            pagination={false}
            rowKey="id"
        />
    )
}

export default AccountBalance;