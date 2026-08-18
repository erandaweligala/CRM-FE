import {FC} from "react";
import {BucketModel} from "../../../../models/QuotaModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import ExpandedTable from "./components/ExpandedTable";
interface DataProps {
    data: BucketModel[]
}

const QuotaCategory: FC<DataProps> = ({data}) => {

    const outerTableColumns: ColumnsType<BucketModel> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Total Initial Amount',
            dataIndex: 'totalInitialAmount',
        },
        {
            title: 'Total Used Amount',
            dataIndex: 'totalUsedAmount',
        },
        {
            title: 'Total Remaining Amount',
            dataIndex: 'totalRemainingAmount',
        },
    ];
    const renderExpandedRow = (record: BucketModel) => {
        return <ExpandedTable data={record.instances} />;
    };
    return (
            <Table
                columns={outerTableColumns}
                dataSource={data}
                expandable={{
                    expandedRowRender: renderExpandedRow,
                    rowExpandable: (_) => true,
                }}
                pagination={false}
                rowKey={'name'}
            />
    )

}

export default QuotaCategory;