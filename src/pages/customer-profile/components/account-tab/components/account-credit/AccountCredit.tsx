import {FC} from "react";
import {AccountCreditModel} from "../../../../models/AccountModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import AccountCreditExpandedTable from "./components/AccountCreditExpandedTable";

interface AccountCreditProps {
    data: AccountCreditModel[]
}

const AccountCredit: FC<AccountCreditProps> = ({data}) => {

    const outerTableColumns: ColumnsType<AccountCreditModel> = [
        {
            title: 'Credit Limit Type',
            dataIndex: 'creditLimitType',
        },
        {
            title: 'Credit Limit Name',
            dataIndex: 'creditLimitName',
        },
        {
            title: 'Total Credit Amount',
            dataIndex: 'totalCreditAmount',
        },
        {
            title: 'Total Usage Amount',
            dataIndex: 'totalUsageAmount',
        },
        {
            title: 'Total Remaining Amount',
            dataIndex: 'totalRemainingAmount',
        }
    ];
    const renderExpandedRow = (record: AccountCreditModel) => {
        return <AccountCreditExpandedTable data={record.instances} />;
    };
    return (
        <Table
            columns={outerTableColumns}
            dataSource={data}
            expandable={{
                expandedRowRender:renderExpandedRow,
                rowExpandable: (row) => row.instances && row.instances.length > 0,
            }}
            pagination={false}
            rowKey="id"
        />
    )

}

export default AccountCredit;